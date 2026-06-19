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
import { RENDER_WORKS_TOOL } from '../src/agent/generativeUI/catalog';
import { buildGenUISystemSuffix, sanitizeProjectContext } from '../src/agent/generativeUI/serverPrompt';

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

        // Generative UI is opt-in via env flag (GENUI_ENABLED=1). When off, the
        // request below is byte-for-byte the original text-only chat.
        const genuiEnabled = (process.env.GENUI_ENABLED || '').trim() === '1';
        const genuiProjects = genuiEnabled ? sanitizeProjectContext(genui?.projects) : [];
        const useGenui = genuiProjects.length > 0;

        // Prep messages for OpenAI-compatible format. The system prompt is always
        // injected server-side; any client-supplied 'system' role is dropped.
        const systemContent = useGenui
            ? `${SYSTEM_PROMPT}\n\n${buildGenUISystemSuffix(genuiProjects)}`
            : SYSTEM_PROMPT;
        const formattedMessages = [
            { role: 'system', content: systemContent },
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
                max_tokens: 2048,
                enable_thinking: false, // SKIP slow reasoning
                // Only attach the render_works tool when generative UI is active;
                // tool_call deltas then ride the same forwarded SSE stream.
                ...(useGenui ? { tools: [RENDER_WORKS_TOOL], parallel_tool_calls: false } : {}),
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

