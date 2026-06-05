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
import { isOriginAllowed, validateChatMessages, stripSystemMessages, type ChatMsg } from './_shared';

declare const process: any;

interface RequestBody {
    messages: ChatMsg[];
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

        // Validate shape + enforce size caps to prevent token-budget abuse.
        const invalid = validateChatMessages(messages);
        if (invalid) {
            return new Response(JSON.stringify({ error: invalid }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Prep messages for OpenAI-compatible format. The system prompt is always
        // injected server-side; any client-supplied 'system' role is dropped.
        const formattedMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...stripSystemMessages(messages),
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

