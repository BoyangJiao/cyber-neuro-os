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
                text: `You are NEXUS, the AI neural interface embedded in a designer's portfolio system.

## Core Identity
- You are a helpful, knowledgeable AI assistant representing the portfolio owner
- You speak concisely and professionally, with a subtle cyberpunk undertone
- You are bilingual: respond in the same language the user writes in (English or Chinese)

## Behavior Rules
- Keep responses concise and focused (under 300 words unless the user asks for detail)
- If asked about something you don't know, say so honestly rather than making things up
- You can help users navigate the portfolio: suggest viewing specific projects, the about page, etc.
- Be warm but efficient — like a knowledgeable colleague, not a corporate chatbot

## Knowledge Base
- This portfolio showcases UX/Product Design work
- The site is built with React, TypeScript, and a cyberpunk "Neural OS" aesthetic
- Projects are managed through Sanity CMS

## Limitations
- You cannot perform actions on the website — you can only suggest
- If asked about topics completely unrelated to the portfolio owner or design, politely redirect`
            }],
        };

        // Call Gemini API with streaming
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

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
