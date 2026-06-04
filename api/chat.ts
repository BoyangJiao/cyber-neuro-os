/**
 * Vercel Serverless Function — Alibaba DashScope API Proxy
 * 
 * Proxies chat requests to DashScope's OpenAI-compatible endpoint.
 * Environment variable required: DASHSCOPE_API_KEY
 */

export const config = {
    runtime: 'edge',
};

import { SYSTEM_PROMPT } from '../src/data/agentSystemPrompt';

declare const process: any;

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface RequestBody {
    messages: ChatMessage[];
}

// ── Abuse guards ────────────────────────────────────────────────────────────
// This endpoint spends real money (DashScope tokens). Without these, anyone can
// POST and drain the budget. Keep them cheap and conservative.
const MAX_MESSAGES = 30;          // conversation turns per request
const MAX_CONTENT_CHARS = 8000;   // per single message
const MAX_TOTAL_CHARS = 16000;    // whole conversation

/**
 * Returns true if the request origin is allowed to call this endpoint.
 * Allows: same-origin, ALLOWED_ORIGINS env entries, *.vercel.app previews, and
 * missing Origin (non-browser callers — the input caps remain the backstop).
 * Blocks only explicit foreign browser origins (prevents cross-site embedding abuse).
 */
function isOriginAllowed(req: Request): boolean {
    const origin = req.headers.get('origin');
    if (!origin) return true; // non-browser / same-origin server call

    try {
        const originHost = new URL(origin).host;
        if (originHost === new URL(req.url).host) return true;        // same-origin
        if (originHost.endsWith('.vercel.app')) return true;          // preview deploys

        const allowed = (process.env.ALLOWED_ORIGINS || '')
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean);
        return allowed.some((a: string) => {
            try { return new URL(a).host === originHost; } catch { return a === originHost; }
        });
    } catch {
        return false;
    }
}

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (!isOriginAllowed(req)) {
        return new Response(JSON.stringify({ error: 'Origin not allowed' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const apiKey = ((process.env as any).DASHSCOPE_API_KEY || '').trim();
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'DASHSCOPE_API_KEY not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { messages } = (await req.json()) as RequestBody;

        if (!Array.isArray(messages) || messages.length === 0) {
            return new Response(JSON.stringify({ error: 'No messages provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Validate shape + enforce size caps to prevent token-budget abuse.
        if (messages.length > MAX_MESSAGES) {
            return new Response(JSON.stringify({ error: `Too many messages (max ${MAX_MESSAGES})` }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        let totalChars = 0;
        for (const m of messages) {
            if (!m || typeof m.content !== 'string' || !['user', 'assistant', 'system'].includes(m.role)) {
                return new Response(JSON.stringify({ error: 'Malformed message' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            if (m.content.length > MAX_CONTENT_CHARS) {
                return new Response(JSON.stringify({ error: `Message too long (max ${MAX_CONTENT_CHARS} chars)` }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            totalChars += m.content.length;
        }
        if (totalChars > MAX_TOTAL_CHARS) {
            return new Response(JSON.stringify({ error: `Conversation too long (max ${MAX_TOTAL_CHARS} chars)` }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Prep messages for OpenAI-compatible format. The system prompt is always
        // injected server-side; any client-supplied 'system' role is dropped.
        const formattedMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages
                .filter(m => m.role !== 'system')
                .map(m => ({ role: m.role, content: m.content })),
        ];

        // Endpoint + model are env-configurable. Defaults target the Coding Plan
        // global endpoint (production); a standard Bailian key should set
        // CHAT_API_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
        // and CHAT_MODEL=qwen-plus in its env.
        const apiUrl = ((process.env as any).CHAT_API_URL || 'https://coding.dashscope.aliyuncs.com/v1/chat/completions').trim();
        const chatModel = ((process.env as any).CHAT_MODEL || 'qwen3.5-plus').trim();

        const dsResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: chatModel,
                messages: formattedMessages,
                stream: true,
                temperature: 0.5,
                max_tokens: 1500,
                enable_thinking: false, // SKIP slow reasoning
            }),
        });

        if (!dsResponse.ok) {
            const errorText = await dsResponse.text();
            console.error('[DASHSCOPE API ERROR]', errorText);
            return new Response(JSON.stringify({ error: 'LLM request failed', details: errorText }), {
                status: dsResponse.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Forward the stream
        return new Response(dsResponse.body, {
            status: 200,
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('[DASHSCOPE API PROXY ERROR]', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

