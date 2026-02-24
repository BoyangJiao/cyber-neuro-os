/**
 * Vercel Serverless Function — Gemini API Proxy
 *
 * Receives chat messages from the frontend and streams
 * responses from Google Gemini Flash API.
 * 
 * Environment variable required: GEMINI_API_KEY
 */

export const config = {
    runtime: 'edge',
};

import { SYSTEM_PROMPT } from '../src/data/agentSystemPrompt';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface RequestBody {
    messages: ChatMessage[];
}

export default async function handler(req: Request) {
    // Only allow POST
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { messages } = (await req.json()) as RequestBody;

        if (!messages || messages.length === 0) {
            return new Response(JSON.stringify({ error: 'No messages provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Convert chat messages to Gemini format
        const geminiContents = messages
            .filter(m => m.role === 'user' || m.role === 'assistant')
            .map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
            }));

        // System instruction (kept separate in Gemini API)
        const systemInstruction = {
            parts: [{
                text: SYSTEM_PROMPT
            }],
        };

        // Call Gemini API with streaming
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

        const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: geminiContents,
                systemInstruction,
                generationConfig: {
                    maxOutputTokens: 1024,
                    temperature: 0.7,
                    topP: 0.9,
                },
            }),
        });

        if (!geminiResponse.ok) {
            const errorText = await geminiResponse.text();
            console.error('[NEXUS API] Gemini error:', errorText);
            return new Response(JSON.stringify({ error: 'LLM request failed', details: errorText }), {
                status: geminiResponse.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Stream the SSE response back to the client
        return new Response(geminiResponse.body, {
            status: 200,
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('[NEXUS API] Error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
