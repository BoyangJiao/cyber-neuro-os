/**
 * speechService — turns agent text into voice + a live mouth-open (jaw) signal.
 *
 * Backend priority (mirrors the chat mock-fallback pattern):
 *   1. DashScope via /api/tts → real audio → Web Audio AnalyserNode → RMS drives
 *      avatarSignal.jaw (accurate amplitude lip-sync; works in China via proxy).
 *   2. Browser SpeechSynthesis fallback → procedural speech envelope + word
 *      boundaries drive the jaw (no audio stream available; good-enough motion).
 *
 * Either way, `avatarSignal.jaw` is updated each frame and read by the avatar's
 * render loop (no React re-renders).
 */
import { avatarSignal } from '../store/useAvatarStore';

let audioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext {
    // Recreate if missing OR closed — some mobile browsers close the context when
    // the tab is backgrounded/suspended; a closed context throws on createBufferSource.
    if (!audioCtx || audioCtx.state === 'closed') {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') void audioCtx.resume();
    return audioCtx;
}

/**
 * Unlock audio playback — MUST be called from inside a user-gesture handler
 * (e.g. the button that enters Borvis). Mobile Safari/Chrome keep an
 * AudioContext created outside a gesture permanently `suspended`: sources
 * then start() without error but never play and never fire `onended`,
 * which is exactly a silent avatar stuck in "speaking".
 */
export function unlockAudio() {
    try {
        const ctx = getAudioCtx();
        void ctx.resume();
        // A one-sample silent buffer "blesses" the context on iOS.
        const buf = ctx.createBuffer(1, 1, ctx.sampleRate);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.start(0);
    } catch { /* best-effort — speak() still has its own fallbacks */ }
}

let cancelCurrent: (() => void) | null = null;

/** Procedural speech envelope (browser fallback) — layered sines + syllable gate. */
function speechEnv(t: number): number {
    const syllable = Math.sin(t * 9.0) * 0.5 + 0.5;
    const flutter = Math.sin(t * 23.0) * 0.25 + 0.75;
    const gate = Math.sin(t * 1.7) > -0.3 ? 1.0 : 0.0;
    return Math.max(0, syllable * flutter * gate);
}

interface SpeakOpts {
    /** Fires the moment audio actually starts, with its duration (seconds), so
     *  the transcript can be revealed in lock-step instead of racing ahead. */
    onStart?: (durationSec: number) => void;
}

async function speakDashScope(text: string, opts: SpeakOpts): Promise<boolean> {
    let res: Response;
    try {
        res = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
    } catch {
        return false; // endpoint unreachable → fall back
    }
    if (!res.ok) {
        if (import.meta.env.DEV) {
            const detail = await res.text().catch(() => '');
            console.info('[speech] /api/tts not ok (', res.status, ') → browser TTS fallback. upstream:', detail);
        }
        return false;
    }

    const buf = await res.arrayBuffer();
    if (buf.byteLength < 256) {
        if (import.meta.env.DEV) console.info('[speech] /api/tts returned no audio → browser TTS fallback');
        return false;
    }

    const ctx = getAudioCtx();
    // If the context still isn't running (no unlocking gesture happened yet),
    // playing would hang silently forever — use the SpeechSynthesis fallback,
    // which has its own watchdogs. (Function read defeats TS narrowing across
    // the await — resume() can legitimately flip the state.)
    const isRunning = () => (ctx.state as AudioContextState) === 'running';
    if (!isRunning()) {
        await ctx.resume().catch(() => { /* noop */ });
        if (!isRunning()) {
            if (import.meta.env.DEV) console.info('[speech] AudioContext not running (no user gesture yet) → browser TTS fallback');
            return false;
        }
    }
    let audioBuf: AudioBuffer;
    try {
        audioBuf = await ctx.decodeAudioData(buf.slice(0));
    } catch {
        if (import.meta.env.DEV) console.info('[speech] /api/tts payload not decodable audio → browser TTS fallback');
        return false; // not decodable audio → fall back
    }
    if (import.meta.env.DEV) console.info('[speech] DashScope TTS ok — amplitude lip-sync');

    const src = ctx.createBufferSource();
    src.buffer = audioBuf;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    src.connect(analyser);
    analyser.connect(ctx.destination);

    const data = new Uint8Array(analyser.fftSize);
    let raf = 0;
    const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        // smooth toward target so the mouth doesn't chatter
        avatarSignal.jaw += (Math.min(1, rms * 3.4) - avatarSignal.jaw) * 0.5;
        raf = requestAnimationFrame(tick);
    };

    return new Promise<boolean>((resolve) => {
        const finish = () => {
            clearTimeout(watchdog);
            cancelAnimationFrame(raf);
            avatarSignal.jaw = 0;
            try { src.disconnect(); } catch { /* noop */ }
            resolve(true);
        };
        src.onended = finish;
        cancelCurrent = () => { try { src.stop(); } catch { /* noop */ } finish(); };
        src.start();
        // Safety net: if `onended` never fires (context suspended mid-play on
        // mobile), settle anyway so the UI can't get stuck in "speaking".
        const watchdog = setTimeout(finish, (audioBuf.duration + 2) * 1000);
        opts.onStart?.(audioBuf.duration);
        tick();
    });
}

function speakBrowser(text: string, opts: SpeakOpts): Promise<void> {
    return new Promise((resolve) => {
        if (typeof speechSynthesis === 'undefined') { resolve(); return; }
        speechSynthesis.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        const isZh = /[一-鿿]/.test(text);
        const voices = speechSynthesis.getVoices();
        const voice = voices.find((v) => (isZh ? /zh|Chinese/i.test(v.lang) : /^en/i.test(v.lang)));
        if (voice) utter.voice = voice;
        utter.lang = isZh ? 'zh-CN' : 'en-US';

        let raf = 0;
        let boost = 0;
        let alive = true;
        let watchdog: ReturnType<typeof setTimeout>;
        const t0 = performance.now();
        const est = Math.max(1, text.length * (isZh ? 0.22 : 0.07));
        const tick = () => {
            const t = (performance.now() - t0) / 1000;
            boost *= 0.85;
            avatarSignal.jaw += (Math.min(1, speechEnv(t) * 0.7 + boost * 0.5) - avatarSignal.jaw) * 0.4;
            if (alive) raf = requestAnimationFrame(tick);
        };
        const finish = () => {
            if (!alive) return;
            alive = false;
            clearTimeout(watchdog);
            cancelAnimationFrame(raf);
            avatarSignal.jaw = 0;
            resolve();
        };

        // Mobile browsers may silently never start an utterance queued outside
        // a user gesture — without a watchdog the promise (and the UI status)
        // would hang in "speaking" forever. Reveal the transcript regardless.
        watchdog = setTimeout(() => {
            opts.onStart?.(est);
            watchdog = setTimeout(finish, est * 1000);
        }, 3000);

        utter.onboundary = () => { boost = 1; };
        utter.onstart = () => {
            // Speech actually started: replace the no-start watchdog with an
            // end-of-speech safety net (estimate + slack).
            clearTimeout(watchdog);
            watchdog = setTimeout(finish, (est + 4) * 1000);
            // No real duration from the API → estimate from length so the
            // transcript paces roughly with the spoken audio.
            opts.onStart?.(est);
        };
        utter.onend = finish;
        utter.onerror = finish;
        cancelCurrent = () => { try { speechSynthesis.cancel(); } catch { /* noop */ } finish(); };

        speechSynthesis.speak(utter);
        tick();
    });
}

/** Stop any in-flight speech and reset the jaw. */
export function cancelSpeech() {
    cancelCurrent?.();
    cancelCurrent = null;
}

/** Speak `text`. Resolves when playback finishes (or is cancelled). */
export async function speak(text: string, opts: SpeakOpts = {}): Promise<void> {
    cancelSpeech();
    if (!text.trim()) return;
    const ok = await speakDashScope(text, opts);
    if (!ok) await speakBrowser(text, opts);
}
