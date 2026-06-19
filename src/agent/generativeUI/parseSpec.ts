/**
 * parseUISpec — runtime validator for untrusted model output.
 *
 * The model's JSON is never trusted: this whitelists block types, type-checks
 * every field, caps array sizes, and drops anything malformed. Unknown block types
 * and bad fields are discarded rather than rendered. The parse fails only when
 * nothing renderable survives, so a partially-broken spec still shows its good parts.
 */

import {
    CONTENT_KINDS,
    GENERATIVE_UI_SPEC_VERSION,
    WORK_FIELDS,
    type ContentKind,
    type UIBlock,
    type UISpec,
    type WorkField,
} from './spec';

/** Hard caps so a runaway/abusive spec can't flood the UI. */
const MAX_BLOCKS = 12;
const MAX_GRID_ITEMS = 12;
const MAX_PROSE_CHARS = 1200;
const MAX_ID_CHARS = 200;
const MAX_CONTENT_ITEMS = 6;

export type ParseResult =
    | { ok: true; spec: UISpec }
    | { ok: false; error: string };

const isObj = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null && !Array.isArray(v);

const cleanId = (v: unknown): string | null => {
    if (typeof v !== 'string') return null;
    const s = v.trim();
    if (!s || s.length > MAX_ID_CHARS) return null;
    return s;
};

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

function parseBlock(raw: unknown): UIBlock | null {
    if (!isObj(raw)) return null;

    switch (raw.type) {
        case 'prose': {
            if (typeof raw.text !== 'string') return null;
            const text = raw.text.slice(0, MAX_PROSE_CHARS);
            if (!text.trim()) return null;
            return { type: 'prose', text };
        }
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
        case 'projectHeader': {
            const projectId = cleanId(raw.projectId);
            if (!projectId) return null;
            const emphasis = cleanEmphasis(raw.emphasis);
            return emphasis
                ? { type: 'projectHeader', projectId, emphasis }
                : { type: 'projectHeader', projectId };
        }
        case 'projectMedia': {
            const projectId = cleanId(raw.projectId);
            if (!projectId) return null;
            return { type: 'projectMedia', projectId };
        }
        case 'projectMetrics': {
            const projectId = cleanId(raw.projectId);
            if (!projectId) return null;
            return { type: 'projectMetrics', projectId };
        }
        case 'projectContent': {
            const projectId = cleanId(raw.projectId);
            if (!projectId) return null;
            const kinds = cleanKinds(raw.kinds);
            const limit = cleanLimit(raw.limit);
            const block: UIBlock = { type: 'projectContent', projectId };
            if (kinds) block.kinds = kinds;
            if (limit !== undefined) block.limit = limit;
            return block;
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

    const blocks = data.blocks
        .map(parseBlock)
        .filter((b): b is UIBlock => b !== null)
        .slice(0, MAX_BLOCKS);

    if (!blocks.length) return { ok: false, error: 'no renderable blocks in spec' };

    return { ok: true, spec: { version: GENERATIVE_UI_SPEC_VERSION, blocks } };
}
