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
        '## Generative UI',
        describeCatalog(),
        '',
        'Available projects (id — title):',
        list,
        '',
        'Always speak your normal short reply as usual; a UI spec via the render_works',
        'tool is IN ADDITION to speaking, never a replacement for it.',
    ].join('\n');
}
