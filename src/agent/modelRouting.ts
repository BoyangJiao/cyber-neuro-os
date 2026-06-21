/**
 * modelRouting — pick the cheapest model that fits the turn.
 *
 * Pure (no React/DOM), imported by BOTH `api/chat.ts` and the Vite dev proxy
 * (`vite.config.ts`) so dev and prod route identically. The heuristic is latency-
 * free (no extra model call): it reads only the latest user turn.
 *
 *   casual chit-chat            → fast model (e.g. qwen-turbo)
 *   about Boyang's work         → strong model + render_works tool (qwen-plus)
 *   otherwise substantive/long  → strong model, no tools
 *
 * "Work-related" doubles as the gate for attaching render_works: the weak fast
 * model won't reliably call tools anyway, and casual turns shouldn't pay for it.
 */

export interface RouteInput {
    /** The latest user message text — what we route on. */
    text: string;
    /** Real project titles in play, to catch by-name mentions ("跟我说说万里汇"). */
    projectTitles?: string[];
}

export interface RouteDecision {
    isWorkRelated: boolean;
    isComplex: boolean;
    /** Route to the strong model when the turn is work-related OR complex. */
    needsStrong: boolean;
}

// CJK keywords are matched by substring; ASCII keywords on word-ish boundaries.
const WORK_CJK = [
    '作品', '作品集', '项目', '案例', '设计', '设计系统', '经历', '做过', '参与',
    '负责', '展示', '看看', '演示', '成果', '支付', '钱包', '万里汇', '蚂蚁', '支付宝',
];
const WORK_EN = [
    'work', 'works', 'project', 'projects', 'portfolio', 'built', 'build', 'design',
    'designed', 'case study', 'show me', 'demo', 'worldfirst', 'alipay', 'vodapay',
    'design system',
];

const DEPTH_CJK = [
    '详细', '具体', '为什么', '怎么', '如何', '对比', '比较', '区别', '解释', '讲讲',
    '深入', '原理', '思路', '方法论', '细节', '展开',
];
const DEPTH_EN = [
    'why', 'how', 'compare', 'difference', 'explain', 'detail', 'details', 'deep',
    'elaborate', 'walk me through', 'tell me more',
];

function hasCjk(text: string, list: readonly string[]): boolean {
    return list.some((k) => text.includes(k));
}

function hasEn(lower: string, list: readonly string[]): boolean {
    return list.some((k) => {
        const esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`(^|[^a-z])${esc}([^a-z]|$)`).test(lower);
    });
}

/** Decide which model tier (and whether to offer the render tool) a turn needs. */
export function routeChat({ text, projectTitles = [] }: RouteInput): RouteDecision {
    const raw = (text || '').slice(0, 2000);
    const lower = raw.toLowerCase();

    const titleHit = projectTitles.some((t) => t && t.length >= 2 && raw.includes(t));
    const isWorkRelated = titleHit || hasCjk(raw, WORK_CJK) || hasEn(lower, WORK_EN);

    const longTurn = raw.trim().length > 70;
    const multiQ = (raw.match(/[?？]/g) || []).length >= 2;
    const depth = hasCjk(raw, DEPTH_CJK) || hasEn(lower, DEPTH_EN);
    const isComplex = longTurn || multiQ || depth;

    return { isWorkRelated, isComplex, needsStrong: isWorkRelated || isComplex };
}
