/**
 * Generative UI — Spec contract
 *
 * The closed set of UI that Borvis is allowed to emit when showing the author's
 * work. The model never supplies display data for data-bound blocks; it only
 * references real entities (a `projectId`) and intent (which fields to emphasize),
 * and the renderer resolves the real values from the project store. `prose` is the
 * single block carrying model-authored text — the agent's own framing words —
 * rendered as a markdown subset with no raw HTML.
 *
 * This mirrors the json-render mental model (closed catalog → constrained spec →
 * validate-before-render) without taking on the dependency; the dispatch renderer
 * follows the same `switch(_type)` pattern as `ContentSlotRenderer`.
 */

export const GENERATIVE_UI_SPEC_VERSION = 1 as const;

/** Fields a WorkCard may visually emphasize. */
export type WorkField = 'techStack' | 'timeline' | 'status' | 'liveUrl';

export const WORK_FIELDS: readonly WorkField[] = ['techStack', 'timeline', 'status', 'liveUrl'];

/** Agent-authored framing text. Markdown subset, rendered without raw HTML. */
export interface ProseBlock {
    type: 'prose';
    text: string;
}

/** One real project rendered as a card. `projectId` references `Project.id`. */
export interface WorkCardBlock {
    type: 'workCard';
    projectId: string;
    emphasis?: WorkField[];
}

/** Several real projects rendered as a grid. */
export interface WorkGridBlock {
    type: 'workGrid';
    projectIds: string[];
    columns?: 2 | 3;
}

export type UIBlock = ProseBlock | WorkCardBlock | WorkGridBlock;
export type UIBlockType = UIBlock['type'];

export interface UISpec {
    version: typeof GENERATIVE_UI_SPEC_VERSION;
    blocks: UIBlock[];
}
