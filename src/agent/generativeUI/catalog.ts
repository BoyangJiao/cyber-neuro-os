/**
 * Catalog — the LLM-facing half of the contract (v3, compositional).
 *
 * `describeCatalog()` is injected into Borvis's system prompt so the model knows
 * which nodes it may compose and the hard-fact boundary. `RENDER_WORKS_TOOL` is the
 * DashScope/OpenAI function-calling descriptor. The tool schema is deliberately
 * LOOSE about nesting (children: array of objects) — recursive JSON-schema is
 * unreliable across providers — while `parseUISpec` does the strict recursive
 * validation. The prose here is what actually teaches the model how to nest.
 */

import { CONTENT_KINDS, ROW_RATIOS, WORK_FIELDS } from './spec';

const FIELD_ENUM = WORK_FIELDS.map((f) => `"${f}"`).join(', ');
const KIND_ENUM = CONTENT_KINDS.map((k) => `"${k}"`).join(', ');
const RATIO_ENUM = ROW_RATIOS.map((r) => `"${r}"`).join(', ');

/** Human/LLM-readable description of the generative-UI catalog. */
export function describeCatalog(): string {
    return [
        "You can attach a generative UI to your reply to SHOW the author's work, not just",
        'describe it. The UI is a TREE you compose from nodes: { "version": 1, "blocks": Node[] }.',
        'Design a BESPOKE layout for each answer — vary structure, use columns and grids,',
        'mix narration with real data. Avoid always emitting the same shape.',
        '',
        'CONTAINERS (compose layout freely; they hold a "children" array of nodes):',
        '- stack   — { "type":"stack", "gap"?:"sm"|"md"|"lg", "children":Node[] }   vertical flow',
        `- row     — { "type":"row", "ratio"?:${RATIO_ENUM}, "children":Node[] }   side-by-side columns`,
        '- grid    — { "type":"grid", "columns"?:2|3, "children":Node[] }   equal cells',
        '- section — { "type":"section", "title"?:string, "children":Node[] }   titled block',
        '- card    — { "type":"card", "accent"?:boolean, "children":Node[] }   framed panel',
        '',
        'FREE-FORM LEAVES (your OWN words — narrate richly and frame the visuals):',
        '- text    — { "type":"text", "text":string }       a paragraph (markdown, no HTML)',
        '- heading — { "type":"heading", "text":string, "level"?:1|2|3 }',
        '- callout — { "type":"callout", "text":string, "tone"?:"info"|"success"|"warn" }',
        '- badge   — { "type":"badge", "text":string }      a short pill label',
        '',
        'REFERENCE-BOUND LEAVES (HARD FACTS — filled from REAL data, never written by you):',
        '- media     — { "type":"media", "projectId":string }      real hero image/video',
        '- metrics   — { "type":"metrics", "projectId":string }    real core metrics',
        '- techStack — { "type":"techStack", "projectId":string }  real tech tags',
        '- link      — { "type":"link", "projectId":string, "label"?:string }  real live URL',
        '- content   — { "type":"content", "projectId":string, "kinds"?:Kind[], "limit"?:number }',
        `              real CMS sections (Kind ∈ [${KIND_ENUM}]; limit 1-6, default 3)`,
        '- workCard  — { "type":"workCard", "projectId":string, "emphasis"?:Field[] }  entry card',
        `              (Field ∈ [${FIELD_ENUM}])`,
        '- workGrid  — { "type":"workGrid", "projectIds":string[], "columns"?:2|3 }  grid of entry cards',
        '',
        'HOW TO COMPOSE (make it feel designed, not templated):',
        '- A good walkthrough nests: e.g. a section → a row [ media | stack[heading, text, techStack] ]',
        '  → a grid of metrics → a content block → a closing callout. Reorder per the question.',
        '- Narrate generously in text/heading/callout so your spoken reply and the UI match.',
        '- Use media/metrics/content to show the REAL thing inline instead of a bare link.',
        '',
        'HARD RULES (the one line you must not cross):',
        '- You may write framing/description freely, BUT never state a fabricated FACT:',
        '  specific metrics, dates, links, exact tech names, or screenshots come from the',
        '  bound nodes (metrics/link/techStack/media/content), NOT from your text. If you',
        '  want to show a number, a logo-stack, a link or a screenshot, use the bound node.',
        '- Only reference projectIds from the provided list.',
        '- Skip the UI entirely when no project is relevant — speaking is the default.',
    ].join('\n');
}

/**
 * DashScope/OpenAI-compatible function-calling descriptor. The item schema lists
 * every field a node may carry and keeps `children` loose (array of objects) so the
 * model can nest; `parseUISpec` enforces the real shapes, caps and the fact boundary.
 */
export const RENDER_WORKS_TOOL = {
    type: 'function',
    function: {
        name: 'render_works',
        description:
            "Attach a composed generative UI (a tree of layout containers, your own narration, " +
            "and real-data nodes) to your reply when the visitor asks about the author's work. " +
            'Design a bespoke layout. Facts (metrics/links/tech/media/content) come from real ' +
            'data via the bound nodes — never invent them. Omit the call when no project is relevant.',
        parameters: {
            type: 'object',
            properties: {
                blocks: {
                    type: 'array',
                    description: 'Top-level UI nodes, rendered in order. Containers nest via "children".',
                    items: {
                        type: 'object',
                        properties: {
                            type: {
                                type: 'string',
                                enum: [
                                    'stack', 'row', 'grid', 'section', 'card',
                                    'text', 'heading', 'callout', 'badge',
                                    'media', 'metrics', 'techStack', 'link', 'content',
                                    'workCard', 'workGrid',
                                ],
                            },
                            children: {
                                type: 'array',
                                description: 'containers only: nested nodes (same shape)',
                                items: { type: 'object' },
                            },
                            text: { type: 'string', description: 'text/heading/callout/badge' },
                            level: { type: 'number', enum: [1, 2, 3], description: 'heading only' },
                            tone: { type: 'string', enum: ['info', 'success', 'warn'], description: 'callout only' },
                            title: { type: 'string', description: 'section only' },
                            gap: { type: 'string', enum: ['sm', 'md', 'lg'], description: 'stack only' },
                            ratio: { type: 'string', enum: [...ROW_RATIOS], description: 'row only' },
                            columns: { type: 'number', enum: [2, 3], description: 'grid/workGrid only' },
                            accent: { type: 'boolean', description: 'card only' },
                            projectId: { type: 'string', description: 'real project id (bound leaves)' },
                            projectIds: { type: 'array', items: { type: 'string' }, description: 'workGrid only' },
                            label: { type: 'string', description: 'link only' },
                            emphasis: { type: 'array', items: { type: 'string', enum: [...WORK_FIELDS] }, description: 'workCard only' },
                            kinds: { type: 'array', items: { type: 'string', enum: [...CONTENT_KINDS] }, description: 'content only' },
                            limit: { type: 'number', description: 'content only: 1-6' },
                        },
                        required: ['type'],
                    },
                },
            },
            required: ['blocks'],
        },
    },
} as const;
