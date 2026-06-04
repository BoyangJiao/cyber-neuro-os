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
    if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtx.state === 'suspended') void audioCtx.resume();
    return audioCtx;
}

let cancelCurrent: (() => void) | null = null;

/** Procedural speech envelope (browser fallback) — layered sines + syllable gate. */
function speechEnv(t: number): number {
    const syllable = Math.sin(t * 9.0) * 0.5 + 0.5;
    const flutter = Math.sin(t * 23.0) * 0.25 + 0.75;
    const gate = Math.sin(t * 1.7) > -0.3 ? 1.0 : 0.0;
    return Math.max(0, syllable * flutter * gate);
}

async function speakDashScope(text: string): Promise<boolean> {
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
    if (!res.ok) return false;

    const buf = await res.arrayBuffer();
    if (buf.byteLength < 256) return false; // not real audio → fall back

    const ctx = getAudioCtx();
    let audioBuf: AudioBuffer;
    try {
        audioBuf = await ctx.decodeAudioData(buf.slice(0));
    } catch {
        return false; // not decodable audio → fall back
    }

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
            cancelAnimationFrame(raf);
            avatarSignal.jaw = 0;
            try { src.disconnect(); } catch { /* noop */ }
            resolve(true);
        };
        src.onended = finish;
        cancelCurrent = () => { try { src.stop(); } catch { /* noop */ } finish(); };
        src.start();
        tick();
    });
}

function speakBrowser(text: string): Promise<void> {
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
        const t0 = performance.now();
        const tick = () => {
            const t = (performance.now() - t0) / 1000;
            boost *= 0.85;
            avatarSignal.jaw += (Math.min(1, speechEnv(t) * 0.7 + boost * 0.5) - avatarSignal.jaw) * 0.4;
            if (alive) raf = requestAnimationFrame(tick);
        };
        const finish = () => {
            alive = false;
            cancelAnimationFrame(raf);
            avatarSignal.jaw = 0;
            resolve();
        };

        utter.onboundary = () => { boost = 1; };
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
export async function speak(text: string): Promise<void> {
    cancelSpeech();
    if (!text.trim()) return;
    const ok = await speakDashScope(text);
    if (!ok) await speakBrowser(text);
}
