/**
 * serverPrompt — the server-side half of the generative-UI wiring.
 *
 * Pure (no React/DOM), so it is safe to import from BOTH the Vercel edge function
 * (`api/chat.ts`) and the Vite dev proxy (`vite.config.ts`). Keeping the prompt
 * augmentation + project-context sanitizer here means prod and dev can't drift.
 *
 * The client sends only a compact {id, title} list of REAL projects; the model is
 * told it may reference those ids. It can't fabricate data: the client renders
 * each card from its own store by id, and `parseUISpec` is the backstop.
 */

import { describeCatalog } from './catalog';

export interface ProjectRef {
    id: string;
    title: string;
}

const MAX_PROJECTS = 60;
const MAX_FIELD_CHARS = 120;

/** Coerce untrusted request input into a bounded {id, title}[] (drops junk). */
export function sanitizeProjectContext(raw: unknown): ProjectRef[] {
    if (!Array.isArray(raw)) return [];
    const out: ProjectRef[] = [];
    for (const item of raw) {
        if (!item || typeof item !== 'object') continue;
        const rawId = (item as Record<string, unknown>).id;
        const rawTitle = (item as Record<string, unknown>).title;
        const id = typeof rawId === 'string' ? rawId.trim().slice(0, MAX_FIELD_CHARS) : '';
        const title = typeof rawTitle === 'string' ? rawTitle.trim().slice(0, MAX_FIELD_CHARS) : '';
        if (id) out.push({ id, title });
        if (out.length >= MAX_PROJECTS) break;
    }
    return out;
}

/** System-prompt suffix appended only when generative UI is active for a request. */
export function buildGenUISystemSuffix(projects: ProjectRef[]): string {
    const list = projects.map((p) => `- ${p.id} — ${p.title}`).join('\n');
    return [
        '## Showing the work (your visual channel — USE IT)',
        'Besides speaking, you have a SECOND channel: the render_works tool. Calling it',
        "paints real UI — cards and grids of Boyang's actual projects — right beside your",
        'spoken reply. It is rendered, not spoken, so it never conflicts with the',
        'plain-speech rule. Showing beats telling.',
        '',
        'WHEN to call render_works:',
        "- The visitor asks about Boyang's work, a specific project, \"show me\", \"what has",
        '  he built", his portfolio, or anything you would answer by pointing at a project.',
        '- In that case you MUST call render_works AND speak your usual in-character line.',
        'WHEN NOT to: greetings, "who are you", or off-topic chit-chat — just speak.',
        '',
        describeCatalog(),
        '',
        'Available projects (id — title):',
        list,
        '',
        'Two channels, one reply: speak your in-character line as always, and — whenever',
        'work is the topic — ALSO call render_works to show it. The tool is in addition to',
        'speaking, never a replacement; never describe a card in words instead of rendering it.',
    ].join('\n');
}
