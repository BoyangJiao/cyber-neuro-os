/**
 * Catalog — the LLM-facing half of the contract.
 *
 * `describeCatalog()` is injected into Borvis's system prompt so the model knows
 * exactly which blocks it may emit and their shapes. The hard rule — reference
 * real project ids, never invent data — lives next to the spec so prompt and
 * validator can't drift far apart. `RENDER_WORKS_TOOL` is the OpenAI/DashScope
 * function-calling descriptor the model calls to attach a spec (wired in Phase 1).
 */

import { CONTENT_KINDS, WORK_FIELDS } from './spec';

const FIELD_ENUM = WORK_FIELDS.map((f) => `"${f}"`).join(', ');
const KIND_ENUM = CONTENT_KINDS.map((k) => `"${k}"`).join(', ');

/** Human/LLM-readable description of the generative-UI catalog. */
export function describeCatalog(): string {
    return [
        "You can attach a UI spec to your reply to SHOW (not just tell) the visitor the author's work.",
        'A spec is JSON: { "version": 1, "blocks": UIBlock[] }. Blocks render top-to-bottom,',
        'so ORDER them to match how you narrate. Allowed blocks:',
        '',
        '1. prose          — { "type": "prose", "text": string }',
        '   Your own framing words (1-2 short sentences). Markdown allowed, no HTML.',
        '2. projectHeader  — { "type": "projectHeader", "projectId": string, "emphasis"?: Field[] }',
        '   Compact inline title + meta for one project (NOT a clickable card). Good to',
        `   open a walkthrough. Field is one of [${FIELD_ENUM}].`,
        '3. projectMedia   — { "type": "projectMedia", "projectId": string }',
        "   The project's real hero image/video, inline.",
        '4. projectMetrics — { "type": "projectMetrics", "projectId": string }',
        "   The project's real core metrics as stat cards, inline.",
        '5. projectContent — { "type": "projectContent", "projectId": string, "kinds"?: Kind[], "limit"?: number }',
        "   The project's REAL content sections rendered inline (rich text, media,",
        `   before/after compare, tabs, stats). Kind is one of [${KIND_ENUM}]; omit "kinds"`,
        '   for any kind. "limit" caps how many sections (default 3, max 6).',
        '6. workCard       — { "type": "workCard", "projectId": string, "emphasis"?: Field[] }',
        '   One project as an ENTRY card (a link the visitor clicks). Use for "browse" intents.',
        '7. workGrid       — { "type": "workGrid", "projectIds": string[], "columns"?: 2 | 3 }',
        '   Several projects as a grid of entry cards.',
        '',
        'HOW TO COMPOSE (prefer showing the actual content over a bare link):',
        '- To walk through ONE project, build a small sequence, e.g. projectHeader →',
        '  projectMedia → projectMetrics → projectContent. Show the real thing inline so',
        '  the visitor does not have to click away.',
        '- Use workCard / workGrid only when the intent is to BROWSE or pick among projects.',
        '',
        'HARD RULES:',
        '- NEVER invent titles, links, tech stacks, metrics, images, or copy. All block',
        '  content is filled from real data by id; you only choose WHICH project, WHICH',
        '  sections, and the ORDER. Your only free text is the `prose` block.',
        '- Only reference projectIds that appear in the provided list.',
        '- Skip the spec entirely when no project is relevant — a normal spoken reply',
        '  is the default, the UI is the exception.',
    ].join('\n');
}

/**
 * OpenAI/DashScope-compatible function-calling descriptor for the render channel.
 * Parameters intentionally mirror the raw spec shape so the tool arguments can be
 * handed straight to `parseUISpec` for validation before rendering.
 */
export const RENDER_WORKS_TOOL = {
    type: 'function',
    function: {
        name: 'render_works',
        description:
            "Attach a generative UI spec to the reply when the visitor asks about the author's " +
            'work. Prefer SHOWING real content inline (projectHeader/projectMedia/projectMetrics/' +
            'projectContent) over a bare entry card. Reference real project ids only; never ' +
            'invent data. Omit the call when no project is relevant.',
        parameters: {
            type: 'object',
            properties: {
                blocks: {
                    type: 'array',
                    description: 'Ordered UI blocks to render, top-to-bottom.',
                    items: {
                        type: 'object',
                        properties: {
                            type: {
                                type: 'string',
                                enum: [
                                    'prose',
                                    'projectHeader',
                                    'projectMedia',
                                    'projectMetrics',
                                    'projectContent',
                                    'workCard',
                                    'workGrid',
                                ],
                            },
                            text: { type: 'string', description: 'prose only: framing text' },
                            projectId: {
                                type: 'string',
                                description: 'a real project id (projectHeader/Media/Metrics/Content/workCard)',
                            },
                            projectIds: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'workGrid only: real project ids',
                            },
                            emphasis: {
                                type: 'array',
                                items: { type: 'string', enum: [...WORK_FIELDS] },
                                description: 'projectHeader/workCard only: fields to emphasize',
                            },
                            kinds: {
                                type: 'array',
                                items: { type: 'string', enum: [...CONTENT_KINDS] },
                                description: 'projectContent only: which content kinds to include',
                            },
                            limit: { type: 'number', description: 'projectContent only: max sections (1-6)' },
                            columns: { type: 'number', enum: [2, 3], description: 'workGrid only' },
                        },
                        required: ['type'],
                    },
                },
            },
            required: ['blocks'],
        },
    },
} as const;
