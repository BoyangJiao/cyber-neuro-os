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

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const apiKey = (process.env as any).DASHSCOPE_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'DASHSCOPE_API_KEY not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { messages } = (await req.json()) as RequestBody;

        if (!messages) {
            return new Response(JSON.stringify({ error: 'No messages provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Prep messages for OpenAI-compatible format
        const formattedMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map(m => ({
                role: m.role,
                content: m.content,
            })),
        ];

        // DashScope OpenAI Compatible Endpoint
        const apiUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

        const dsResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'qwen-coder-plus', // High performance coding model
                messages: formattedMessages,
                stream: true,
                temperature: 0.7,
                max_tokens: 1536,
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

