/**
 * Shared guards for the DashScope proxy endpoints (chat / tts / asr).
 *
 * The `_`-prefix means Vercel does NOT treat this file as a routable function.
 * Centralising these here keeps the three edge handlers from drifting apart —
 * a single place to tighten the origin policy or the abuse caps.
 *
 * NOTE: the Vite dev proxy (vite.config.ts) mirrors the chat caps + system-role
 * filter inline (it runs on a Node request, not a web `Request`); keep them in sync.
 */

declare const process: any;

// ── Abuse caps (these endpoints spend real DashScope tokens) ────────────────
export const MAX_MESSAGES = 30;          // conversation turns per chat request
export const MAX_CONTENT_CHARS = 8000;   // per single message
export const MAX_TOTAL_CHARS = 16000;    // whole conversation
export const MAX_AUDIO_CHARS = 9_000_000; // ~6.5MB of base64 audio for ASR

// Owner-controlled Vercel preview deploys for THIS project, e.g.
// cyber-neuro-os-<hash>-<scope>.vercel.app (and the bare project alias).
// A bare `.vercel.app` allowlist would trust any stranger's free deploy.
const PREVIEW_HOST = /^cyber-neuro-os(-[a-z0-9-]+)?\.vercel\.app$/;

/**
 * Returns true if the request origin may call these endpoints.
 * Allows: same-origin, this project's own Vercel previews, ALLOWED_ORIGINS env
 * entries, and missing Origin (non-browser callers — the input caps are the
 * backstop). Blocks foreign browser origins (cross-site token-spend abuse).
 */
export function isOriginAllowed(req: Request): boolean {
    const origin = req.headers.get('origin');
    if (!origin) return true; // non-browser / same-origin server call

    try {
        const originHost = new URL(origin).host;
        if (originHost === new URL(req.url).host) return true;   // same-origin
        if (PREVIEW_HOST.test(originHost)) return true;          // own preview deploys

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

export interface ChatMsg { role: 'user' | 'assistant' | 'system'; content: string; }

/**
 * Validates chat payload shape + enforces size caps. Returns an error string
 * (caller maps to a 400) or null when the payload is acceptable.
 */
export function validateChatMessages(messages: unknown): string | null {
    if (!Array.isArray(messages) || messages.length === 0) return 'No messages provided';
    if (messages.length > MAX_MESSAGES) return `Too many messages (max ${MAX_MESSAGES})`;

    let totalChars = 0;
    for (const m of messages as ChatMsg[]) {
        if (!m || typeof m.content !== 'string' || !['user', 'assistant', 'system'].includes(m.role)) {
            return 'Malformed message';
        }
        if (m.content.length > MAX_CONTENT_CHARS) return `Message too long (max ${MAX_CONTENT_CHARS} chars)`;
        totalChars += m.content.length;
    }
    if (totalChars > MAX_TOTAL_CHARS) return `Conversation too long (max ${MAX_TOTAL_CHARS} chars)`;
    return null;
}

/** Drop any client-supplied `system` role — the system prompt is server-injected only. */
export function stripSystemMessages(messages: ChatMsg[]): ChatMsg[] {
    return messages.filter((m) => m.role !== 'system').map((m) => ({ role: m.role, content: m.content }));
}
