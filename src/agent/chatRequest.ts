/**
 * Shared builder for the DashScope upstream chat request.
 *
 * The production edge function (api/chat.ts) and the local dev proxy
 * (vite.config.ts) must send byte-identical payloads — system-prompt injection,
 * model routing, and generative-UI tool attachment all have to match, or dev
 * gives false confidence about what prod will do. This is the single source of
 * truth for that payload so the two can never drift.
 *
 * Pure: the caller supplies already-validated messages and an env accessor
 * (process.env on the edge, the loadEnv record in Vite). No I/O here.
 */
import { SYSTEM_PROMPT } from '../data/agentSystemPrompt';
import { RENDER_WORKS_TOOL } from './generativeUI/catalog';
import { buildGenUISystemSuffix, sanitizeProjectContext } from './generativeUI/serverPrompt';
import { routeChat } from './modelRouting';

type EnvLike = Record<string, string | undefined>;
interface ChatMsgLike { role: string; content: string }

export interface UpstreamChatRequest {
    apiUrl: string;
    chatModel: string;
    /** True when the render_works tool is attached (work-related turn). */
    useTools: boolean;
    /** OpenAI-compatible request body, ready for JSON.stringify. */
    body: Record<string, unknown>;
}

export function buildChatUpstreamRequest(opts: {
    messages: ChatMsgLike[];
    /** Raw client-supplied genui.projects (unsanitised). */
    genuiProjects: unknown;
    env: EnvLike;
}): UpstreamChatRequest {
    const { messages, genuiProjects: genuiRaw, env } = opts;

    // Generative UI is opt-in via env flag (GENUI_ENABLED=1). When off, the
    // request below is byte-for-byte the original text-only chat.
    const genuiEnabled = (env.GENUI_ENABLED || '').trim() === '1';
    const genuiProjects = genuiEnabled ? sanitizeProjectContext(genuiRaw) : [];

    // Model routing: casual chat stays on the fast model; work-related or complex
    // turns go to the strong model. render_works is attached only for work turns
    // (the fast model won't call tools reliably; casual turns shouldn't pay the cost).
    const latestUserText = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    const route = routeChat({ text: latestUserText, projectTitles: genuiProjects.map((p) => p.title) });
    const useTools = genuiProjects.length > 0 && route.isWorkRelated;

    // System prompt is always injected server-side; any client 'system' role is dropped.
    const systemContent = useTools
        ? `${SYSTEM_PROMPT}\n\n${buildGenUISystemSuffix(genuiProjects)}`
        : SYSTEM_PROMPT;
    const formattedMessages = [
        { role: 'system', content: systemContent },
        ...messages.filter((m) => m.role !== 'system').map((m) => ({ role: m.role, content: m.content })),
    ];

    // Endpoint + model are env-configurable (defaults = Coding Plan global endpoint).
    const apiUrl = (env.CHAT_API_URL || 'https://coding.dashscope.aliyuncs.com/v1/chat/completions').trim();
    const baseModel = (env.CHAT_MODEL || 'qwen3.5-plus').trim();
    const strongModel = (env.CHAT_MODEL_STRONG || '').trim() || baseModel;
    const chatModel = route.needsStrong ? strongModel : baseModel;

    return {
        apiUrl,
        chatModel,
        useTools,
        body: {
            model: chatModel,
            messages: formattedMessages,
            stream: true,
            temperature: 0.5,
            max_tokens: 2048,
            enable_thinking: false, // SKIP slow reasoning
            ...(useTools ? { tools: [RENDER_WORKS_TOOL], parallel_tool_calls: false } : {}),
        },
    };
}
