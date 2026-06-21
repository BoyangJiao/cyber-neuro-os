/**
 * Vercel Serverless Function — Alibaba DashScope API Proxy
 * 
 * Proxies chat requests to DashScope's OpenAI-compatible endpoint.
 * Environment variable required: DASHSCOPE_API_KEY
 */

export const config = {
    runtime: 'edge',
};

import { isOriginAllowed, validateChatMessages, type ChatMsg } from './_shared';
import { buildChatUpstreamRequest } from '../src/agent/chatRequest';

declare const process: any;

interface RequestBody {
    messages: ChatMsg[];
    /** Optional compact list of real projects, used only when generative UI is enabled. */
    genui?: { projects?: unknown };
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
        const { messages, genui } = (await req.json()) as RequestBody;

        // Validate shape + enforce size caps to prevent token-budget abuse.
        const invalid = validateChatMessages(messages);
        if (invalid) {
            return new Response(JSON.stringify({ error: invalid }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Build the upstream payload (system-prompt injection, model routing,
        // generative-UI tool attachment). Shared with the dev proxy so the two
        // never drift. Defaults target the Coding Plan global endpoint; a standard
        // Bailian key should set CHAT_API_URL / CHAT_MODEL in its env.
        const { apiUrl, body } = buildChatUpstreamRequest({
            messages,
            genuiProjects: genui?.projects,
            env: process.env,
        });

        const dsResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(body),
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

