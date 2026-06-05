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

import { isOriginAllowed } from './_shared';

// Qwen-TTS uses the multimodal-generation endpoint (named voices: Kai, Cherry…)
// and returns the audio as a URL in output.audio.url.
const ENDPOINT = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';
const MAX_CHARS = 2000;

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

    const model = (process.env.TTS_MODEL || 'qwen3-tts-flash').trim();
    const voice = (process.env.TTS_VOICE || 'Kai').trim();
    const languageType = /[一-鿿]/.test(text) ? 'Chinese' : 'English';

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
                input: { text, voice, language_type: languageType },
            }),
        });
    } catch (e) {
        console.error('[TTS PROXY ERROR]', e);
        return new Response(JSON.stringify({ error: 'TTS upstream failed' }), { status: 502 });
    }

    // Qwen-TTS returns JSON with the audio at output.audio.url (24h validity).
    let json: any = null;
    try { json = await upstream.json(); } catch { /* not JSON */ }
    const url = json?.output?.audio?.url;
    if (upstream.ok && url) {
        const audio = await fetch(url);
        // The signed CDN URL can be expired/403 by the time we fetch it — don't
        // relay a non-audio error body as a 200, or the client decodes garbage.
        if (!audio.ok) {
            console.error('[TTS PROXY] audio url fetch failed', audio.status);
            return new Response(JSON.stringify({ error: 'TTS audio fetch failed' }), { status: 502 });
        }
        return new Response(audio.body, {
            status: 200,
            headers: {
                'Content-Type': audio.headers.get('content-type') || 'audio/mpeg',
                'Cache-Control': 'no-store',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }

    console.error('[TTS PROXY] no audio from upstream', upstream.status, json);
    return new Response(JSON.stringify({ error: 'TTS produced no audio', upstream: json }), { status: 502 });
}
