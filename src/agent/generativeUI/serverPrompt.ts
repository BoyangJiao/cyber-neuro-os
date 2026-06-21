/**
 * serverPrompt — the server-side half of the generative-UI wiring.
 *
 * Pure (no React/DOM), so it is safe to import from BOTH the Vercel edge function
 * (`api/chat.ts`) and the Vite dev proxy (`vite.config.ts`). Keeping the prompt
 * augmentation + project-context sanitizer here means prod and dev can't drift.
 *
 * The client sends a compact list of REAL projects (id + light facts). The model is
 * told it may reference those ids and narrate from those facts; hard data (metrics,
 * media, full content) is filled by the renderer from the store/CMS, never by the
 * model. `parseUISpec` is the backstop.
 */

import { describeCatalog } from './catalog';

export interface ProjectRef {
    id: string;
    title: string;
    description?: string;
    techStack?: string[];
    timeline?: string;
    status?: string;
    liveUrl?: string;
    projectType?: string;
}

const MAX_PROJECTS = 60;
const MAX_FIELD_CHARS = 120;
const MAX_DESC_CHARS = 240;
const MAX_TECH = 12;

const str = (v: unknown, max: number): string =>
    typeof v === 'string' ? v.trim().slice(0, max) : '';

/** Coerce untrusted request input into a bounded ProjectRef[] (drops junk). */
export function sanitizeProjectContext(raw: unknown): ProjectRef[] {
    if (!Array.isArray(raw)) return [];
    const out: ProjectRef[] = [];
    for (const item of raw) {
        if (!item || typeof item !== 'object') continue;
        const r = item as Record<string, unknown>;
        const id = str(r.id, MAX_FIELD_CHARS);
        if (!id) continue;
        const ref: ProjectRef = { id, title: str(r.title, MAX_FIELD_CHARS) };
        const description = str(r.description, MAX_DESC_CHARS);
        if (description) ref.description = description;
        if (Array.isArray(r.techStack)) {
            const tech = r.techStack
                .map((t) => str(t, 40))
                .filter(Boolean)
                .slice(0, MAX_TECH);
            if (tech.length) ref.techStack = tech;
        }
        const timeline = str(r.timeline, MAX_FIELD_CHARS);
        if (timeline) ref.timeline = timeline;
        const status = str(r.status, MAX_FIELD_CHARS);
        if (status) ref.status = status;
        const liveUrl = str(r.liveUrl, MAX_FIELD_CHARS);
        if (liveUrl) ref.liveUrl = liveUrl;
        const projectType = str(
            Array.isArray(r.projectType) ? r.projectType.join(', ') : r.projectType,
            MAX_FIELD_CHARS,
        );
        if (projectType) ref.projectType = projectType;
        out.push(ref);
        if (out.length >= MAX_PROJECTS) break;
    }
    return out;
}

function formatProject(p: ProjectRef): string {
    const lines = [`- id: ${p.id}  ·  title: ${p.title}`];
    if (p.description) lines.push(`  desc: ${p.description}`);
    if (p.techStack?.length) lines.push(`  tech: ${p.techStack.join(', ')}`);
    const meta = [
        p.projectType && `type: ${p.projectType}`,
        p.timeline && `timeline: ${p.timeline}`,
        p.status && `status: ${p.status}`,
        p.liveUrl && 'has-live-url',
    ].filter(Boolean);
    if (meta.length) lines.push(`  ${meta.join('  ·  ')}`);
    return lines.join('\n');
}

/** System-prompt suffix appended only when generative UI is active for a request. */
export function buildGenUISystemSuffix(projects: ProjectRef[]): string {
    const list = projects.map(formatProject).join('\n');
    return [
        '## Showing the work (your visual channel — USE IT)',
        'Besides speaking, you can call the render_works tool to compose a bespoke UI beside',
        "your reply — a tree of layout containers, your own narration, and the project's REAL",
        'data (media, metrics, content). It is rendered, not spoken, so it never conflicts with',
        'the plain-speech rule. SHOW the work; do not just link to it.',
        '',
        'WHEN to call render_works:',
        "- The visitor asks about Boyang's work, a project, \"show me\", \"what has he built\", his",
        '  portfolio, or anything you would answer by pointing at a project → call it AND speak.',
        'WHEN NOT to: greetings, "who are you", off-topic — just speak.',
        '',
        describeCatalog(),
        '',
        'Real projects you may reference (facts below are REAL — narrate from them, and use the',
        'bound nodes to render the heavy data):',
        list,
        '',
        'Two channels, one reply: speak a fuller in-character intro (a few sentences is fine —',
        'enough to set up what the UI shows), and compose a generative UI that matches what you',
        'are saying. Never describe a metric/screenshot in words when a bound node can show it.',
    ].join('\n');
}
