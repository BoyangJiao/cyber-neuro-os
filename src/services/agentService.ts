/**
 * Agent Service — LLM Communication Layer
 *
 * Handles streaming chat with the Vercel Serverless proxy.
 * Falls back to mock responses when running locally without API.
 */

import type { AgentMessage } from '../store/useAgentStore';
import { parseUISpec } from '../agent/generativeUI/parseSpec';
import type { UISpec } from '../agent/generativeUI/spec';

interface StreamChatOptions {
    messages: AgentMessage[];
    onToken: (token: string) => void;
    onDone: () => void;
    onError: (error: string) => void;
    /** Fired once if the reply opens with a [[emo:X]] tag (stripped from onToken). */
    onEmotion?: (emotion: string) => void;
    /**
     * Fired once at end-of-stream if the model attached a valid render_works UI
     * spec (generative UI). Requires `genuiProjects` to be sent and the server
     * flag GENUI_ENABLED=1; otherwise never fires.
     */
    onSpec?: (spec: UISpec) => void;
    /** Compact list of real projects (id + light facts) the model may reference (genui). */
    genuiProjects?: {
        id: string;
        title: string;
        description?: string;
        techStack?: string[];
        timeline?: string;
        status?: string;
        liveUrl?: string;
        projectType?: string | string[];
    }[];
}

/**
 * Removes `[[emo:X]]` emotion tags from a token stream — wherever they appear
 * (the model sometimes re-tags mid-reply) — emitting each emotion via onEmotion
 * and forwarding the cleaned text. Streaming-safe: a tag split across chunks is
 * held back until complete so it can never be spoken or shown.
 */
function makeEmotionStripper(onToken: (t: string) => void, onEmotion?: (e: string) => void) {
    const FULL = /\[\[emo:(neutral|happy|sad|surprised|angry|curious)\]\]/gi;
    // A trailing fragment that could still grow into a tag (so we hold it back).
    const PARTIAL = /\[(\[(e(m(o(:\w*\]?)?)?)?)?)?$/;
    let buf = '';
    const pump = (flush: boolean) => {
        buf = buf.replace(FULL, (_m, e) => { onEmotion?.(e.toLowerCase()); return ''; });
        if (flush) { if (buf) onToken(buf); buf = ''; return; }
        const m = buf.match(PARTIAL);
        const cut = m ? m.index! : buf.length;
        if (cut > 0) { onToken(buf.slice(0, cut)); buf = buf.slice(cut); }
    };
    return {
        feed: (chunk: string) => { buf += chunk; pump(false); },
        flush: () => pump(true),
    };
}

// ============================================================
// Real API — DashScope (Qwen) via Vercel Serverless (/api/chat)
// ============================================================

/**
 * Outcome of a real API attempt:
 * - 'ok'       → streamed successfully (or surfaced a real API error via onError)
 * - 'unavailable' → the endpoint isn't reachable / isn't configured; caller should
 *                   fall back to the local mock (dev without DASHSCOPE_API_KEY).
 */
type RealResult = 'ok' | 'unavailable';

const realStreamChat = async ({ messages, onToken, onDone, onError, onEmotion, onSpec, genuiProjects }: StreamChatOptions): Promise<RealResult> => {
    const emo = makeEmotionStripper(onToken, onEmotion);
    let response: Response;
    try {
        response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: messages.map(m => ({
                    role: m.role,
                    content: m.content,
                })),
                // Only sent when the caller opted into generative UI. The server
                // ignores it unless GENUI_ENABLED=1.
                ...(genuiProjects?.length ? { genui: { projects: genuiProjects } } : {}),
            }),
        });
    } catch {
        // Network-level failure (no dev server / offline) → let caller use the mock.
        return 'unavailable';
    }

    try {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            // 500 with "not configured" means no API key locally → mock is the right UX.
            if (response.status === 500 && /not configured|not set/i.test(errorData.error || '')) {
                return 'unavailable';
            }
            onError(errorData.error || `API error: ${response.status}`);
            return 'ok';
        }

        const reader = response.body?.getReader();
        if (!reader) {
            onError('No response stream available');
            return 'ok';
        }

        const decoder = new TextDecoder();
        let buffer = '';
        // Accumulate render_works tool-call argument deltas (generative UI). Stays
        // empty for plain text-only replies, so the spec path is purely additive.
        let toolName = '';
        let toolArgs = '';

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
                        const delta = parsed?.choices?.[0]?.delta;
                        // Extract text from Standard OpenAI/DashScope SSE response
                        const text = delta?.content;
                        if (text) {
                            emo.feed(text);
                        }
                        // Tool-call arguments arrive as deltas across chunks.
                        const tc = delta?.tool_calls?.[0];
                        if (tc) {
                            if (tc.function?.name) toolName = tc.function.name;
                            if (tc.function?.arguments) toolArgs += tc.function.arguments;
                        }
                    } catch {
                        // Skip unparseable chunks
                    }
                }
            }
        }

        emo.flush();

        // If the model attached a render_works spec, validate it before surfacing.
        if (onSpec && toolName === 'render_works' && toolArgs.trim()) {
            try {
                const result = parseUISpec(JSON.parse(toolArgs));
                if (result.ok) onSpec(result.spec);
            } catch {
                // Malformed tool args → no spec; the spoken reply still stands.
            }
        }

        onDone();
        return 'ok';
    } catch (error) {
        // Failure mid-stream (already connected) is a real error, not "unavailable".
        onError(error instanceof Error ? error.message : 'Network error');
        return 'ok';
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
 * Tries real /api/chat first; falls back to mock if unavailable.
 */
export const streamChat = async (options: StreamChatOptions) => {
    const result = await realStreamChat(options);
    if (result === 'unavailable') {
        // Only fall back to mock when the endpoint is truly unreachable/unconfigured
        // (e.g. local dev without DASHSCOPE_API_KEY). Real API errors are surfaced
        // to the user via onError instead of being silently mocked.
        if (import.meta.env.DEV) console.info('[NEXUS] Real API unavailable, falling back to mock');
        return mockStreamChat(options);
    }
};
