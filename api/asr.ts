/**
 * Vercel Serverless Function — DashScope ASR proxy (Qwen3-ASR-Flash).
 *
 * Browser records mic audio → WAV → base64 data URI → POST here. We forward to
 * the OpenAI-compatible endpoint with the audio in the messages array and return
 * the transcript. Same key/proxy pattern as /api/chat + /api/tts.
 *
 * Env: DASHSCOPE_API_KEY (required), optional ASR_API_URL / ASR_MODEL / ALLOWED_ORIGINS.
 */
export const config = { runtime: 'edge' };

declare const process: any;

import { isOriginAllowed, MAX_AUDIO_CHARS } from './_shared';

export default async function handler(req: Request) {
    if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    if (!isOriginAllowed(req)) return new Response(JSON.stringify({ error: 'Origin not allowed' }), { status: 403 });

    const apiKey = ((process.env as any).DASHSCOPE_API_KEY || '').trim();
    if (!apiKey) return new Response(JSON.stringify({ error: 'ASR not configured' }), { status: 501 });

    let audio = '';
    try {
        const body = (await req.json()) as { audio?: string };
        audio = body.audio || '';
    } catch {
        return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400 });
    }
    if (!audio.startsWith('data:audio') || audio.length > MAX_AUDIO_CHARS) {
        return new Response(JSON.stringify({ error: 'Invalid or too-large audio' }), { status: 400 });
    }

    const url = (process.env.ASR_API_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions').trim();
    const model = (process.env.ASR_MODEL || 'qwen3-asr-flash').trim();

    let upstream: Response;
    try {
        upstream = await fetch(url, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: [{ type: 'input_audio', input_audio: { data: audio } }] }],
                stream: false,
                asr_options: { enable_itn: true },
            }),
        });
    } catch (e) {
        console.error('[ASR PROXY ERROR]', e);
        return new Response(JSON.stringify({ error: 'ASR upstream failed' }), { status: 502 });
    }

    const json: any = await upstream.json().catch(() => null);
    const text = json?.choices?.[0]?.message?.content;
    if (upstream.ok && typeof text === 'string') {
        return new Response(JSON.stringify({ text }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
    }
    console.error('[ASR PROXY] no transcript', upstream.status, json);
    return new Response(JSON.stringify({ error: 'ASR produced no text', upstream: json }), { status: 502 });
}
