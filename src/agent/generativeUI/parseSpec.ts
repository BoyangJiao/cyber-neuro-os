/**
 * parseUISpec — runtime validator for untrusted model output (recursive).
 *
 * The model's JSON is never trusted: this walks the node tree, whitelists node
 * types, type-checks every field, caps depth / breadth / total nodes / text length,
 * and drops anything malformed. Containers with no valid children collapse away.
 * The parse fails only when nothing renderable survives, so a partially-broken
 * spec still shows its good parts.
 */

import {
    CALLOUT_TONES,
    CONTENT_KINDS,
    GENERATIVE_UI_SPEC_VERSION,
    ROW_RATIOS,
    WORK_FIELDS,
    type CalloutTone,
    type ContentKind,
    type Gap,
    type RowRatio,
    type UINode,
    type UISpec,
    type WorkField,
} from './spec';

/** Hard caps so a runaway/abusive spec can't flood or hang the UI. */
const MAX_TOTAL_NODES = 80;
const MAX_DEPTH = 5;
const MAX_CHILDREN = 12;
const MAX_GRID_ITEMS = 12;
const MAX_TEXT_CHARS = 1200;
const MAX_HEADING_CHARS = 160;
const MAX_LABEL_CHARS = 80;
const MAX_ID_CHARS = 200;
const MAX_CONTENT_ITEMS = 6;

export type ParseResult =
    | { ok: true; spec: UISpec }
    | { ok: false; error: string };

const isObj = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null && !Array.isArray(v);

const cleanStr = (v: unknown, max: number): string | null => {
    if (typeof v !== 'string') return null;
    const s = v.trim();
    if (!s) return null;
    return s.slice(0, max);
};

const cleanId = (v: unknown): string | null => {
    if (typeof v !== 'string') return null;
    const s = v.trim();
    if (!s || s.length > MAX_ID_CHARS) return null;
    return s;
};

const cleanGap = (v: unknown): Gap | undefined =>
    v === 'sm' || v === 'md' || v === 'lg' ? v : undefined;

const cleanRatio = (v: unknown): RowRatio | undefined =>
    ROW_RATIOS.includes(v as RowRatio) ? (v as RowRatio) : undefined;

const cleanTone = (v: unknown): CalloutTone | undefined =>
    CALLOUT_TONES.includes(v as CalloutTone) ? (v as CalloutTone) : undefined;

const cleanEmphasis = (v: unknown): WorkField[] | undefined => {
    if (!Array.isArray(v)) return undefined;
    const out = v.filter((f): f is WorkField => WORK_FIELDS.includes(f as WorkField));
    return out.length ? Array.from(new Set(out)) : undefined;
};

const cleanKinds = (v: unknown): ContentKind[] | undefined => {
    if (!Array.isArray(v)) return undefined;
    const out = v.filter((k): k is ContentKind => CONTENT_KINDS.includes(k as ContentKind));
    return out.length ? Array.from(new Set(out)) : undefined;
};

const cleanLimit = (v: unknown): number | undefined => {
    if (typeof v !== 'number' || !Number.isFinite(v)) return undefined;
    const n = Math.floor(v);
    if (n < 1) return 1;
    return n > MAX_CONTENT_ITEMS ? MAX_CONTENT_ITEMS : n;
};

interface Budget { left: number; }

function parseChildren(raw: unknown, depth: number, budget: Budget): UINode[] {
    if (!Array.isArray(raw)) return [];
    const out: UINode[] = [];
    for (const child of raw) {
        if (out.length >= MAX_CHILDREN || budget.left <= 0) break;
        const node = parseNode(child, depth + 1, budget);
        if (node) out.push(node);
    }
    return out;
}

function parseNode(raw: unknown, depth: number, budget: Budget): UINode | null {
    if (!isObj(raw) || depth > MAX_DEPTH || budget.left <= 0) return null;
    budget.left -= 1;

    switch (raw.type) {
        // ── Containers ──────────────────────────────────────────────────────
        case 'stack': {
            const children = parseChildren(raw.children, depth, budget);
            if (!children.length) return null;
            const gap = cleanGap(raw.gap);
            return gap ? { type: 'stack', gap, children } : { type: 'stack', children };
        }
        case 'row': {
            const children = parseChildren(raw.children, depth, budget);
            if (!children.length) return null;
            const ratio = cleanRatio(raw.ratio);
            return ratio ? { type: 'row', ratio, children } : { type: 'row', children };
        }
        case 'grid': {
            const children = parseChildren(raw.children, depth, budget);
            if (!children.length) return null;
            const columns: 2 | 3 = raw.columns === 3 ? 3 : 2;
            return { type: 'grid', columns, children };
        }
        case 'section': {
            const children = parseChildren(raw.children, depth, budget);
            if (!children.length) return null;
            const title = cleanStr(raw.title, MAX_HEADING_CHARS);
            return title ? { type: 'section', title, children } : { type: 'section', children };
        }
        case 'card': {
            const children = parseChildren(raw.children, depth, budget);
            if (!children.length) return null;
            return raw.accent === true
                ? { type: 'card', accent: true, children }
                : { type: 'card', children };
        }

        // ── Free-form leaves ────────────────────────────────────────────────
        case 'prose': // legacy alias
        case 'text': {
            const text = cleanStr(raw.text, MAX_TEXT_CHARS);
            if (!text) return null;
            return { type: 'text', text };
        }
        case 'heading': {
            const text = cleanStr(raw.text, MAX_HEADING_CHARS);
            if (!text) return null;
            const level: 1 | 2 | 3 = raw.level === 1 ? 1 : raw.level === 3 ? 3 : 2;
            return { type: 'heading', text, level };
        }
        case 'callout': {
            const text = cleanStr(raw.text, MAX_TEXT_CHARS);
            if (!text) return null;
            const tone = cleanTone(raw.tone);
            return tone ? { type: 'callout', text, tone } : { type: 'callout', text };
        }
        case 'badge': {
            const text = cleanStr(raw.text, MAX_LABEL_CHARS);
            if (!text) return null;
            return { type: 'badge', text };
        }

        // ── Reference-bound leaves (hard facts) ─────────────────────────────
        case 'media': {
            const projectId = cleanId(raw.projectId);
            return projectId ? { type: 'media', projectId } : null;
        }
        case 'metrics': {
            const projectId = cleanId(raw.projectId);
            return projectId ? { type: 'metrics', projectId } : null;
        }
        case 'techStack': {
            const projectId = cleanId(raw.projectId);
            return projectId ? { type: 'techStack', projectId } : null;
        }
        case 'link': {
            const projectId = cleanId(raw.projectId);
            if (!projectId) return null;
            const label = cleanStr(raw.label, MAX_LABEL_CHARS);
            return label ? { type: 'link', projectId, label } : { type: 'link', projectId };
        }
        case 'content': {
            const projectId = cleanId(raw.projectId);
            if (!projectId) return null;
            const kinds = cleanKinds(raw.kinds);
            const limit = cleanLimit(raw.limit);
            const node: UINode = { type: 'content', projectId };
            if (kinds) node.kinds = kinds;
            if (limit !== undefined) node.limit = limit;
            return node;
        }
        case 'projectHeader': // legacy alias → workCard
        case 'workCard': {
            const projectId = cleanId(raw.projectId);
            if (!projectId) return null;
            const emphasis = cleanEmphasis(raw.emphasis);
            return emphasis
                ? { type: 'workCard', projectId, emphasis }
                : { type: 'workCard', projectId };
        }
        case 'workGrid': {
            if (!Array.isArray(raw.projectIds)) return null;
            const projectIds = raw.projectIds
                .map(cleanId)
                .filter((s): s is string => s !== null)
                .slice(0, MAX_GRID_ITEMS);
            if (!projectIds.length) return null;
            const columns: 2 | 3 = raw.columns === 3 ? 3 : 2;
            return { type: 'workGrid', projectIds, columns };
        }

        default:
            return null;
    }
}

/**
 * Validate raw JSON (string or already-parsed) into a UISpec. Returns a
 * discriminated result so callers handle the failure path explicitly.
 */
export function parseUISpec(raw: unknown): ParseResult {
    let data = raw;
    if (typeof raw === 'string') {
        try {
            data = JSON.parse(raw);
        } catch {
            return { ok: false, error: 'spec is not valid JSON' };
        }
    }

    if (!isObj(data)) return { ok: false, error: 'spec must be an object' };
    if (!Array.isArray(data.blocks)) return { ok: false, error: 'spec.blocks must be an array' };

    const budget: Budget = { left: MAX_TOTAL_NODES };
    const blocks: UINode[] = [];
    for (const block of data.blocks) {
        if (budget.left <= 0) break;
        const node = parseNode(block, 0, budget);
        if (node) blocks.push(node);
    }

    if (!blocks.length) return { ok: false, error: 'no renderable blocks in spec' };

    return { ok: true, spec: { version: GENERATIVE_UI_SPEC_VERSION, blocks } };
}
