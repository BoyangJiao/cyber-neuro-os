/**
 * detail — pure helpers for binding generative-UI blocks to a project's real
 * CMS detail data (`ProjectDetailData`). No React/DOM here.
 *
 * The model only references a project + which kinds/how many content sections it
 * wants; these helpers pull the ACTUAL content blocks out of the project's
 * `contentModules` so the renderer can show real content (never model-authored).
 */

import type { ContentBlock, LayoutModule, ProjectDetailData } from '../../data/projectDetails';
import type { ContentKind } from './spec';

const KIND_TO_TYPE: Record<ContentKind, ContentBlock['_type']> = {
    text: 'richTextBlock',
    media: 'mediaBlock',
    stats: 'statsBlock',
    compare: 'compareBlock',
    tabs: 'tabBlock',
};

/** Flatten a detail's layout modules into a single ordered list of content blocks. */
export function flattenContentBlocks(detail: ProjectDetailData | undefined): ContentBlock[] {
    if (!detail?.contentModules) return [];
    const out: ContentBlock[] = [];
    for (const m of detail.contentModules as LayoutModule[]) {
        if (m._type === 'layoutFullWidth') out.push(...(m.content || []));
        else if (m._type === 'layoutSplit') out.push(...(m.leftSlot || []), ...(m.rightSlot || []));
        else if (m._type === 'layoutGrid') out.push(...(m.items || []));
    }
    return out;
}

/** Select real content blocks for a `projectContent` block (filter by kind, cap count). */
export function selectContentBlocks(
    detail: ProjectDetailData | undefined,
    opts: { kinds?: ContentKind[]; limit?: number } = {},
): ContentBlock[] {
    let blocks = flattenContentBlocks(detail);
    if (opts.kinds?.length) {
        const allowed = new Set(opts.kinds.map((k) => KIND_TO_TYPE[k]));
        blocks = blocks.filter((b) => allowed.has(b._type));
    }
    const limit = Math.max(1, Math.min(opts.limit ?? 3, 6));
    return blocks.slice(0, limit);
}
