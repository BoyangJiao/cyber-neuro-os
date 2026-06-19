/**
 * Catalog — the LLM-facing half of the contract.
 *
 * `describeCatalog()` is injected into Borvis's system prompt so the model knows
 * exactly which blocks it may emit and their shapes. The hard rule — reference
 * real project ids, never invent data — lives next to the spec so prompt and
 * validator can't drift far apart. `RENDER_WORKS_TOOL` is the OpenAI/DashScope
 * function-calling descriptor the model calls to attach a spec (wired in Phase 1).
 */

import { WORK_FIELDS } from './spec';

const FIELD_ENUM = WORK_FIELDS.map((f) => `"${f}"`).join(', ');

/** Human/LLM-readable description of the generative-UI catalog. */
export function describeCatalog(): string {
    return [
        "You can attach a UI spec to your reply to SHOW (not just tell) the visitor the author's work.",
        'A spec is JSON: { "version": 1, "blocks": UIBlock[] }. Allowed blocks:',
        '',
        '1. prose    — { "type": "prose", "text": string }',
        '   Your own framing words (1-3 short sentences). Markdown allowed, no HTML.',
        '2. workCard — { "type": "workCard", "projectId": string, "emphasis"?: Field[] }',
        '   Renders one real project as a card. projectId MUST be an id from the',
        `   provided project list. Field is one of [${FIELD_ENUM}].`,
        '3. workGrid — { "type": "workGrid", "projectIds": string[], "columns"?: 2 | 3 }',
        '   Renders several real projects as a grid.',
        '',
        'HARD RULES:',
        '- NEVER invent project titles, links, tech stacks or metrics. Card content is',
        '  filled from real data by id; you only choose WHICH projects and HOW to frame them.',
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
            "Attach a generative UI spec (cards/grids of the author's real projects) to the " +
            'reply when the visitor asks about the work. Reference real project ids only; ' +
            'never invent data. Omit the call when no project is relevant.',
        parameters: {
            type: 'object',
            properties: {
                blocks: {
                    type: 'array',
                    description: 'Ordered UI blocks to render.',
                    items: {
                        type: 'object',
                        properties: {
                            type: { type: 'string', enum: ['prose', 'workCard', 'workGrid'] },
                            text: { type: 'string', description: 'prose only: framing text' },
                            projectId: { type: 'string', description: 'workCard only: a real project id' },
                            projectIds: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'workGrid only: real project ids',
                            },
                            emphasis: {
                                type: 'array',
                                items: { type: 'string', enum: [...WORK_FIELDS] },
                                description: 'workCard only: fields to emphasize',
                            },
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
