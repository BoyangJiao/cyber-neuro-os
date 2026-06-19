/**
 * Generative UI — Spec contract (v3, compositional)
 *
 * A spec is a TREE the model composes from atomic nodes, so every answer can have
 * a bespoke layout instead of one fixed template. Two families of nodes:
 *
 *   • Containers (stack / row / grid / section / card) — the model arranges these
 *     freely and nests them to design the layout. This free composition is what
 *     makes the result feel "generated", not templated.
 *   • Leaves — either FREE-FORM (heading / text / callout / badge: the model's own
 *     narration + framing words) or REFERENCE-BOUND (media / metrics / techStack /
 *     link / content / workCard / workGrid: HARD FACTS that resolve from real data,
 *     never authored by the model).
 *
 * The boundary is deliberate: the model may compose and narrate freely, but figures,
 * dates, links, tech names and real screenshots come from the project store / CMS —
 * so a live portfolio never shows fabricated facts. Mirrors json-render's mental
 * model (closed catalog → constrained spec → validate-before-render), zero new deps.
 */

export const GENERATIVE_UI_SPEC_VERSION = 1 as const;

/** Fields a workCard/projectHeader may visually emphasize. */
export type WorkField = 'techStack' | 'timeline' | 'status' | 'liveUrl';
export const WORK_FIELDS: readonly WorkField[] = ['techStack', 'timeline', 'status', 'liveUrl'];

/** Kinds of real project content a `content` node may pull in. */
export type ContentKind = 'text' | 'media' | 'stats' | 'compare' | 'tabs';
export const CONTENT_KINDS: readonly ContentKind[] = ['text', 'media', 'stats', 'compare', 'tabs'];

export type Gap = 'sm' | 'md' | 'lg';
export type RowRatio = '50-50' | '40-60' | '60-40' | '33-67' | '67-33';
export const ROW_RATIOS: readonly RowRatio[] = ['50-50', '40-60', '60-40', '33-67', '67-33'];
export type CalloutTone = 'info' | 'success' | 'warn';
export const CALLOUT_TONES: readonly CalloutTone[] = ['info', 'success', 'warn'];

// ── Containers (free composition) ───────────────────────────────────────────
export interface StackNode { type: 'stack'; gap?: Gap; children: UINode[]; }
export interface RowNode { type: 'row'; ratio?: RowRatio; children: UINode[]; }
export interface GridNode { type: 'grid'; columns?: 2 | 3; children: UINode[]; }
export interface SectionNode { type: 'section'; title?: string; children: UINode[]; }
export interface CardNode { type: 'card'; accent?: boolean; children: UINode[]; }

export type ContainerNode = StackNode | RowNode | GridNode | SectionNode | CardNode;
export const CONTAINER_TYPES: readonly ContainerNode['type'][] = ['stack', 'row', 'grid', 'section', 'card'];

// ── Free-form leaves (model-authored narration / framing) ───────────────────
export interface HeadingNode { type: 'heading'; text: string; level?: 1 | 2 | 3; }
export interface TextNode { type: 'text'; text: string; }
export interface CalloutNode { type: 'callout'; text: string; tone?: CalloutTone; }
export interface BadgeNode { type: 'badge'; text: string; }

// ── Reference-bound leaves (HARD FACTS resolved from real data) ──────────────
export interface MediaNode { type: 'media'; projectId: string; }
export interface MetricsNode { type: 'metrics'; projectId: string; }
export interface TechStackNode { type: 'techStack'; projectId: string; }
export interface LinkNode { type: 'link'; projectId: string; label?: string; }
export interface ContentNode { type: 'content'; projectId: string; kinds?: ContentKind[]; limit?: number; }
export interface WorkCardNode { type: 'workCard'; projectId: string; emphasis?: WorkField[]; }
export interface WorkGridNode { type: 'workGrid'; projectIds: string[]; columns?: 2 | 3; }

export type LeafNode =
    | HeadingNode
    | TextNode
    | CalloutNode
    | BadgeNode
    | MediaNode
    | MetricsNode
    | TechStackNode
    | LinkNode
    | ContentNode
    | WorkCardNode
    | WorkGridNode;

export type UINode = ContainerNode | LeafNode;

/** projectId-bearing leaf types — used to gather which details to fetch. */
export const PROJECT_REF_TYPES: readonly string[] = ['media', 'metrics', 'content'];

export interface UISpec {
    version: typeof GENERATIVE_UI_SPEC_VERSION;
    blocks: UINode[];
}

// Back-compat aliases (older call sites refer to UIBlock).
export type UIBlock = UINode;
export type UIBlockType = UINode['type'];
