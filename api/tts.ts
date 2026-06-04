/**
 * Vercel Serverless Function — DashScope TTS proxy.
 *
 * Proxies text → speech via DashScope's HTTP SpeechSynthesizer endpoint (the
 * CosyVoice realtime API is WebSocket-only; this HTTP endpoint suits whole-reply
 * synthesis). Returns raw audio bytes the browser decodes for amplitude lip-sync.
 * On any upstream issue it returns a non-2xx so the client falls back to browser TTS.
 *
 * Env: DASHSCOPE_API_KEY (required), optional TTS_MODEL / TTS_FORMAT / ALLOWED_ORIGINS.
 */
export const config = { runtime: 'edge' };

declare const process: any;

const ENDPOINT = 'https://dashscope.aliyuncs.com/api/v1/services/audio/tts/SpeechSynthesizer';
const MAX_CHARS = 2000;

function isOriginAllowed(req: Request): boolean {
    const origin = req.headers.get('origin');
    if (!origin) return true;
    try {
        const host = new URL(origin).host;
        if (host === new URL(req.url).host) return true;
        if (host.endsWith('.vercel.app')) return true;
        const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map((s: string) => s.trim()).filter(Boolean);
        return allowed.some((a: string) => { try { return new URL(a).host === host; } catch { return a === host; } });
    } catch { return false; }
}

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }
    if (!isOriginAllowed(req)) {
        return new Response(JSON.stringify({ error: 'Origin not allowed' }), { status: 403 });
    }

    const apiKey = ((process.env as any).DASHSCOPE_API_KEY || '').trim();
    if (!apiKey) {
        // No key → tell the client to use its browser-TTS fallback.
        return new Response(JSON.stringify({ error: 'TTS not configured' }), { status: 501 });
    }

    let text = '';
    try {
        const body = (await req.json()) as { text?: string };
        text = (body.text || '').slice(0, MAX_CHARS);
    } catch {
        return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 });
    }
    if (!text.trim()) return new Response(JSON.stringify({ error: 'No text' }), { status: 400 });

    // sambert voices are per-model (zhichu = female zh, etc.). Override via env.
    const model = (process.env.TTS_MODEL || 'sambert-zhichu-v1').trim();
    const format = (process.env.TTS_FORMAT || 'mp3').trim();

    let upstream: Response;
    try {
        upstream = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                input: { text },
                parameters: { text_type: 'PlainText', format, sample_rate: 48000 },
            }),
        });
    } catch (e) {
        console.error('[TTS PROXY ERROR]', e);
        return new Response(JSON.stringify({ error: 'TTS upstream failed' }), { status: 502 });
    }

    const ct = upstream.headers.get('content-type') || '';
    // Success path: sambert returns the audio bytes directly.
    if (upstream.ok && ct.includes('audio')) {
        return new Response(upstream.body, {
            status: 200,
            headers: {
                'Content-Type': ct,
                'Cache-Control': 'no-store',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }

    // Some models answer with JSON { output: { audio: { url } } } — fetch & relay.
    try {
        const json: any = await upstream.json();
        const url = json?.output?.audio?.url;
        if (url) {
            const audio = await fetch(url);
            return new Response(audio.body, {
                status: 200,
                headers: {
                    'Content-Type': audio.headers.get('content-type') || 'audio/mpeg',
                    'Cache-Control': 'no-store',
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }
        console.error('[TTS PROXY] unexpected response', json);
    } catch { /* not JSON */ }

    return new Response(JSON.stringify({ error: 'TTS produced no audio' }), { status: 502 });
}
