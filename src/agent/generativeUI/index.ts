/**
 * Generative UI — public surface.
 *
 * Borrows the json-render mental model (closed catalog → constrained spec →
 * validate-before-render) on top of our own components, with zero new deps.
 */

export { GenerativeUI } from './GenerativeUI';
export { WorkCard } from './components/WorkCard';
export { parseUISpec, type ParseResult } from './parseSpec';
export { describeCatalog, RENDER_WORKS_TOOL } from './catalog';
export {
    GENERATIVE_UI_SPEC_VERSION,
    WORK_FIELDS,
    CONTENT_KINDS,
    type UISpec,
    type UIBlock,
    type UIBlockType,
    type WorkField,
    type ContentKind,
    type ProseBlock,
    type WorkCardBlock,
    type WorkGridBlock,
    type ProjectHeaderBlock,
    type ProjectMediaBlock,
    type ProjectMetricsBlock,
    type ProjectContentBlock,
} from './spec';
