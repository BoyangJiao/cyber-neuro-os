/**
 * asrService — push-to-talk capture → WAV → DashScope ASR (/api/asr) → transcript.
 *
 * Records mic PCM via Web Audio (mono, encoded to a 16-bit WAV so the format is
 * one Qwen-ASR reliably accepts), reports a live input level for the UI, and on
 * stop posts the audio for transcription.
 */

export interface Recording {
    /** Stop, transcribe, and resolve the recognized text ('' on failure). */
    stop: () => Promise<string>;
    /** Abort without transcribing. */
    cancel: () => void;
}

function encodeWav(chunks: Float32Array[], sampleRate: number): Blob {
    let length = 0;
    for (const c of chunks) length += c.length;
    const pcm = new Float32Array(length);
    let off = 0;
    for (const c of chunks) { pcm.set(c, off); off += c.length; }

    const buffer = new ArrayBuffer(44 + pcm.length * 2);
    const view = new DataView(buffer);
    const writeStr = (o: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };

    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + pcm.length * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);          // PCM
    view.setUint16(22, 1, true);          // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, pcm.length * 2, true);
    let p = 44;
    for (let i = 0; i < pcm.length; i++) {
        const s = Math.max(-1, Math.min(1, pcm[i]));
        view.setInt16(p, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        p += 2;
    }
    return new Blob([buffer], { type: 'audio/wav' });
}

function blobToDataUri(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result as string);
        fr.onerror = reject;
        fr.readAsDataURL(blob);
    });
}

/** Begin a push-to-talk recording. `onLevel` reports input loudness (0..1). */
export async function startListening(onLevel?: (level: number) => void): Promise<Recording> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = ctx.createMediaStreamSource(stream);
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    const chunks: Float32Array[] = [];

    processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        chunks.push(new Float32Array(input));
        if (onLevel) {
            let sum = 0;
            for (let i = 0; i < input.length; i++) sum += input[i] * input[i];
            onLevel(Math.min(1, Math.sqrt(sum / input.length) * 4));
        }
    };
    source.connect(processor);
    processor.connect(ctx.destination); // required for onaudioprocess to fire

    const teardown = () => {
        processor.disconnect();
        source.disconnect();
        stream.getTracks().forEach((t) => t.stop());
        void ctx.close();
    };

    return {
        cancel: teardown,
        stop: async () => {
            const sampleRate = ctx.sampleRate;
            teardown();
            if (chunks.length === 0) return '';
            const wav = encodeWav(chunks, sampleRate);
            const dataUri = await blobToDataUri(wav);
            try {
                const res = await fetch('/api/asr', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ audio: dataUri }),
                });
                if (!res.ok) {
                    if (import.meta.env.DEV) console.info('[asr] /api/asr not ok (', res.status, ')', await res.text().catch(() => ''));
                    return '';
                }
                const json = await res.json();
                return (json.text || '').trim();
            } catch (e) {
                if (import.meta.env.DEV) console.info('[asr] request failed', e);
                return '';
            }
        },
    };
}
