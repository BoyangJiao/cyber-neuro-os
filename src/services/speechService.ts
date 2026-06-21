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

/** Fetch + DECODE a TTS clip without playing it — so the next sentence can be
 *  synthesised while the current one is still speaking (no dead air between). */
async function prepareTts(text: string): Promise<AudioBuffer | null> {
    let res: Response;
    try {
        res = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
    } catch {
        return null; // endpoint unreachable → caller uses browser fallback
    }
    if (!res.ok) {
        if (import.meta.env.DEV) {
            const detail = await res.text().catch(() => '');
            console.info('[speech] /api/tts not ok (', res.status, ') → browser TTS fallback. upstream:', detail);
        }
        return null;
    }
    const buf = await res.arrayBuffer();
    if (buf.byteLength < 256) {
        if (import.meta.env.DEV) console.info('[speech] /api/tts returned no audio → browser TTS fallback');
        return null;
    }
    try {
        return await getAudioCtx().decodeAudioData(buf.slice(0)); // decode works on a suspended ctx
    } catch {
        if (import.meta.env.DEV) console.info('[speech] /api/tts payload not decodable audio → browser TTS fallback');
        return null;
    }
}

// Cap concurrent /api/tts synthesis. We still prefetch ahead so playback never
// stalls, but a long reply split into many sentences won't fire a dozen parallel
// requests at the proxy (rate-limit / resource spike). FIFO so clips synthesise
// roughly in the order they'll play.
const MAX_TTS_CONCURRENCY = 3;
let ttsInFlight = 0;
const ttsWaiters: Array<() => void> = [];
async function prepareTtsThrottled(text: string): Promise<AudioBuffer | null> {
    while (ttsInFlight >= MAX_TTS_CONCURRENCY) {
        await new Promise<void>((r) => ttsWaiters.push(r));
    }
    ttsInFlight++;
    try {
        return await prepareTts(text);
    } finally {
        ttsInFlight--;
        ttsWaiters.shift()?.();
    }
}

/** Ensure the AudioContext is actually running (needs a prior user gesture). */
async function ensureRunning(): Promise<boolean> {
    const ctx = getAudioCtx();
    const isRunning = () => (ctx.state as AudioContextState) === 'running';
    if (isRunning()) return true;
    await ctx.resume().catch(() => { /* noop */ });
    return isRunning();
}

/** Play a decoded clip, driving the jaw lip-sync signal; resolves when it ends. */
function playBuffer(audioBuf: AudioBuffer, opts: SpeakOpts): Promise<void> {
    const ctx = getAudioCtx();
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

    return new Promise<void>((resolve) => {
        const finish = () => {
            clearTimeout(watchdog);
            cancelAnimationFrame(raf);
            avatarSignal.jaw = 0;
            try { src.disconnect(); } catch { /* noop */ }
            resolve();
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

// ── Sequential speak queue (sentence-streaming TTS) ─────────────────────────
// Sentences are enqueued as the model streams; they play strictly in order so
// Borvis can speak WHILE the UI renders. `speakGen` invalidates queued/in-flight
// items on cancel (barge-in / new query).
// Natural pause at a sentence boundary (a "period" beat) — the only gap we keep,
// now that synthesis no longer stalls between clips.
const SENTENCE_GAP_MS = 180;
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

let speakGen = 0;
interface QueueItem { gen: number; text: string; bufP: Promise<AudioBuffer | null>; opts: SpeakOpts; resolve: () => void; }
const speakQueue: QueueItem[] = [];
let pumping = false;
// The gen we've already played a sentence for — the leading sentence of each new
// run (gen) plays with no gap; only between sentences do we keep the period beat.
// Keyed by gen (not a reset-on-cancel flag) so it's correct even if a caller
// enqueues without first calling cancelSpeech.
let playedGen = -1;

async function pumpQueue() {
    if (pumping) return;
    pumping = true;
    while (speakQueue.length) {
        const item = speakQueue.shift()!;
        if (item.gen !== speakGen) { item.resolve(); continue; }
        // The clip is already being synthesised (prefetched at enqueue time), so this
        // usually resolves immediately — the next sentence is ready before this ends.
        const buffer = await item.bufP;
        if (item.gen !== speakGen) { item.resolve(); continue; }
        if (playedGen === item.gen) await delay(SENTENCE_GAP_MS);
        if (item.gen !== speakGen) { item.resolve(); continue; }
        playedGen = item.gen;
        if (buffer && (await ensureRunning())) await playBuffer(buffer, item.opts);
        else await speakBrowser(item.text, item.opts); // synth failed / audio not unlocked
        item.resolve();
    }
    pumping = false;
}

/** Stop any in-flight + queued speech and reset the jaw. */
export function cancelSpeech() {
    speakGen++; // new gen ⇒ the next run's first sentence plays gap-free automatically
    speakQueue.length = 0;
    cancelCurrent?.();
    cancelCurrent = null;
    avatarSignal.jaw = 0;
}

/**
 * Enqueue one sentence to be spoken in order. Synthesis STARTS immediately (in
 * parallel) so it's ready by the time prior sentences finish — continuous speech
 * with only the natural sentence pause. Resolves when this clip finishes/skips.
 */
export function speakEnqueue(text: string, opts: SpeakOpts = {}): Promise<void> {
    if (!text.trim()) return Promise.resolve();
    const gen = speakGen;
    const bufP = prepareTtsThrottled(text); // kick off synthesis NOW (prefetch, capped)
    return new Promise<void>((resolve) => {
        speakQueue.push({ gen, text, bufP, opts, resolve });
        void pumpQueue();
    });
}

/** Speak `text` in one shot. Resolves when playback finishes (or is cancelled). */
export async function speak(text: string, opts: SpeakOpts = {}): Promise<void> {
    cancelSpeech();
    if (!text.trim()) return;
    const buffer = await prepareTts(text);
    if (buffer && (await ensureRunning())) await playBuffer(buffer, opts);
    else await speakBrowser(text, opts);
}
