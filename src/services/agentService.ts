/**
 * Agent Service — LLM Communication Layer
 *
 * Handles streaming chat with the Vercel Serverless proxy.
 * Falls back to mock responses when running locally without API.
 */

import type { AgentMessage } from '../store/useAgentStore';

interface StreamChatOptions {
    messages: AgentMessage[];
    onToken: (token: string) => void;
    onDone: () => void;
    onError: (error: string) => void;
}

// ============================================================
// Real API — Gemini via Vercel Serverless
// ============================================================

const realStreamChat = async ({ messages, onToken, onDone, onError }: StreamChatOptions) => {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: messages.map(m => ({
                    role: m.role,
                    content: m.content,
                })),
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            onError(errorData.error || `API error: ${response.status}`);
            return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
            onError('No response stream available');
            return;
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Parse SSE events from the buffer
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep incomplete line in buffer

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6).trim();
                    if (!data || data === '[DONE]') continue;

                    try {
                        const parsed = JSON.parse(data);
                        // Extract text from Gemini SSE response
                        const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (text) {
                            onToken(text);
                        }
                    } catch {
                        // Skip unparseable chunks
                    }
                }
            }
        }

        onDone();
    } catch (error) {
        onError(error instanceof Error ? error.message : 'Network error');
    }
};

// ============================================================
// Mock — For local development without API
// ============================================================

const mockStreamChat = async ({ messages, onToken, onDone, onError }: StreamChatOptions) => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) {
        onError('No message to process');
        return;
    }

    const hasChineseChars = /[\u4e00-\u9fff]/.test(lastMessage.content);

    const mockResponses: Record<string, string[]> = {
        en: [
            "That's a great question. This portfolio showcases a range of UX and product design work, with a focus on creating intuitive cross-cultural digital experiences. Would you like me to highlight a specific project?",
            "The design system behind this site follows a cyberpunk \"Neural OS\" aesthetic — layered transparency, monospace typography, and neon accent colors. Every component is purpose-built for this theme.",
            "I'd recommend exploring the project detail pages. Each one includes before/after comparisons, design process breakdowns, and interactive media showcases.",
        ],
        zh: [
            "这是个好问题。这个作品集展示了一系列 UX 和产品设计作品，专注于创造直觉性的跨文化数字体验。你想让我重点介绍某个项目吗？",
            "这个网站背后的设计系统采用了赛博朋克「Neural OS」美学——层叠透明、等宽字体和霓虹强调色。每个组件都是为这个主题量身定制的。",
            "我建议你探索一下项目详情页。每个页面都包含前后对比、设计过程分解和交互媒体展示。",
        ],
    };

    const lang = hasChineseChars ? 'zh' : 'en';
    const responses = mockResponses[lang];
    const response = responses[Math.floor(Math.random() * responses.length)];

    try {
        for (const char of response) {
            await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 30));
            onToken(char);
        }
        onDone();
    } catch {
        onError('Stream interrupted');
    }
};

// ============================================================
// Public API
// ============================================================

/**
 * Send a chat message and receive streaming response.
 * Tries the real API endpoint first; falls back to mock if /api/chat returns 404.
 */
export const streamChat = async (options: StreamChatOptions) => {
    try {
        // Quick check: is the API available? (only on deployed Vercel)
        const probe = await fetch('/api/chat', { method: 'HEAD' }).catch(() => null);

        if (probe && probe.status !== 404) {
            return realStreamChat(options);
        }
    } catch {
        // API not available, fall through to mock
    }

    // Fallback to mock for local development
    console.info('[NEXUS] API not available, using mock responses');
    return mockStreamChat(options);
};
