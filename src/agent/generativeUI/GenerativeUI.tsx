/**
 * GenerativeUI — recursive dispatch renderer for a validated UISpec tree.
 *
 * Containers (stack/row/grid/section/card) compose layout; leaves render either
 * model-authored text (heading/text/callout/badge) or reference-bound real data
 * (media/metrics/techStack/link/content/workCard/workGrid). A reference that
 * doesn't resolve is skipped, never fabricated. Same `switch(type)` spirit as
 * ContentSlotRenderer, extended to a tree.
 */

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import clsx from 'clsx';
import { useProjectStore } from '../../store/useProjectStore';
import { urlFor } from '../../sanity/client';
import { ContentSlotRenderer } from '../../components/project/detail/renderers/ContentSlotRenderer';
import type { Project } from '../../data/projects';
import type { ProjectDetailData } from '../../data/projectDetails';
import type {
    CalloutNode,
    ContentNode,
    HeadingNode,
    LinkNode,
    RowRatio,
    TextNode,
    UINode,
    UISpec,
    WorkCardNode,
    WorkGridNode,
} from './spec';
import { WorkCard } from './components/WorkCard';
import { selectContentBlocks } from './detail';
import { useProjectDetails } from './useProjectDetails';

interface GenerativeUIProps {
    spec: UISpec;
    onOpenProject?: (project: Project) => void;
    className?: string;
}

interface RenderCtx {
    byId: Map<string, Project>;
    detailById: Map<string, ProjectDetailData>;
    loading: boolean;
    language: 'en' | 'zh';
    onOpenProject?: (p: Project) => void;
}

const GAP: Record<string, string> = { sm: 'gap-2', md: 'gap-4', lg: 'gap-6' };
// Container-query splits: a row only becomes columns once ITS OWN width allows it,
// so nested/narrow contexts stack instead of cramming (the genui-lab vs panel gap).
const ROW_COLS: Record<RowRatio, string> = {
    '50-50': '@[460px]:grid-cols-2',
    '40-60': '@[460px]:grid-cols-[2fr_3fr]',
    '60-40': '@[460px]:grid-cols-[3fr_2fr]',
    '33-67': '@[460px]:grid-cols-[1fr_2fr]',
    '67-33': '@[460px]:grid-cols-[2fr_1fr]',
};
const CALLOUT_TONE: Record<string, string> = {
    info: 'border-brand-primary/40 bg-brand-primary/5',
    success: 'border-status-success/40 bg-status-success/5',
    warn: 'border-status-warning/40 bg-status-warning/5',
};

const PROSE_COMPONENTS = {
    p: ({ children }: { children?: React.ReactNode }) => (
        <p className="text-sm leading-relaxed text-text-primary">{children}</p>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
        <strong className="font-semibold text-text-accent">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
        <em className="text-text-secondary">{children}</em>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => (
        <ul className="list-disc space-y-1 pl-5 text-sm text-text-primary">{children}</ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
        <ol className="list-decimal space-y-1 pl-5 text-sm text-text-primary">{children}</ol>
    ),
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
        const external = !!href && href.startsWith('http');
        return (
            <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer noopener' : undefined}
                className="text-brand-primary underline decoration-brand-primary/40 underline-offset-2 hover:decoration-brand-primary"
            >
                {children}
            </a>
        );
    },
};

const DetailPlaceholder = () => (
    <div className="h-28 w-full animate-pulse rounded-lg border border-brand-primary/15 bg-brand-primary/5" />
);

// ── Free-form leaves ────────────────────────────────────────────────────────
const TextLeaf = ({ node }: { node: TextNode }) => (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={PROSE_COMPONENTS}>
        {node.text}
    </ReactMarkdown>
);

const HeadingLeaf = ({ node }: { node: HeadingNode }) => {
    const cls =
        node.level === 1
            ? 'font-display text-xl font-bold text-text-accent'
            : node.level === 3
                ? 'font-display text-sm font-semibold uppercase tracking-wider text-brand-primary/80'
                : 'font-display text-base font-bold text-text-accent';
    return <div className={cls}>{node.text}</div>;
};

const CalloutLeaf = ({ node }: { node: CalloutNode }) => (
    <div className={clsx('rounded-md border-l-2 px-3 py-2 text-sm text-text-primary', CALLOUT_TONE[node.tone || 'info'])}>
        {node.text}
    </div>
);

const BadgeLeaf = ({ text }: { text: string }) => (
    <span className="inline-flex w-fit rounded bg-brand-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-brand-primary">
        {text}
    </span>
);

// ── Reference-bound leaves ──────────────────────────────────────────────────
const MediaLeaf = ({ detail }: { detail?: ProjectDetailData }) => {
    if (!detail) return null;
    const videoUrl = detail.heroVideoUrl || detail.heroVideoFile;
    if (videoUrl) {
        return (
            <div className="overflow-hidden rounded-lg border border-brand-primary/15">
                <video src={videoUrl} autoPlay loop muted playsInline preload="auto" className="h-auto w-full" />
            </div>
        );
    }
    if (detail.heroImage) {
        const url = urlFor(detail.heroImage).auto('format').width(1280).quality(90).url();
        return (
            <div className="overflow-hidden rounded-lg border border-brand-primary/15">
                <img src={url} alt={detail.title} className="h-auto w-full" />
            </div>
        );
    }
    return null;
};

const MetricsLeaf = ({ detail }: { detail?: ProjectDetailData }) => {
    const metrics = detail?.coreMetrics || [];
    if (!metrics.length) return null;
    return (
        <div className="grid grid-cols-1 gap-3 @[200px]:grid-cols-2 @[440px]:grid-cols-3">
            {metrics.map((m, i) => (
                <div key={i} className="rounded-lg border border-brand-primary/30 bg-black/30 p-3">
                    <div className="font-mono text-2xl font-bold text-brand-primary">
                        {m.value}
                        {m.unit && <span className="ml-0.5 text-sm text-brand-primary/70">{m.unit}</span>}
                    </div>
                    <div className="text-[11px] uppercase tracking-wider text-text-secondary">{m.label}</div>
                </div>
            ))}
        </div>
    );
};

const TechStackLeaf = ({ project }: { project?: Project }) => {
    if (!project?.techStack.length) return null;
    return (
        <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
                <span key={tech} className="rounded border border-text-muted/20 px-2 py-0.5 text-[10px] text-text-secondary">
                    {tech}
                </span>
            ))}
        </div>
    );
};

const LinkLeaf = ({ node, project, language }: { node: LinkNode; project?: Project; language: 'en' | 'zh' }) => {
    if (!project?.liveUrl) return null;
    const label = node.label || (language === 'zh' ? '访问 ↗' : 'Visit ↗');
    return (
        <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex w-fit items-center rounded border border-brand-primary/40 px-3 py-1 text-xs text-brand-primary transition-colors hover:bg-brand-primary/10"
        >
            {label}
        </a>
    );
};

const ContentLeaf = ({ node, detail }: { node: ContentNode; detail?: ProjectDetailData }) => {
    const blocks = selectContentBlocks(detail, { kinds: node.kinds, limit: node.limit });
    if (!blocks.length) return null;
    return <ContentSlotRenderer blocks={blocks} />;
};

const WorkCardLeaf = ({ node, ctx }: { node: WorkCardNode; ctx: RenderCtx }) => {
    const project = ctx.byId.get(node.projectId);
    if (!project) return null;
    return <WorkCard project={project} emphasis={node.emphasis} language={ctx.language} onOpen={ctx.onOpenProject} />;
};

const WorkGridLeaf = ({ node, ctx }: { node: WorkGridNode; ctx: RenderCtx }) => {
    const resolved = node.projectIds
        .map((id) => ctx.byId.get(id))
        .filter((p): p is Project => p !== undefined);
    if (!resolved.length) return null;
    const cols = node.columns === 3
        ? '@[360px]:grid-cols-2 @[560px]:grid-cols-3'
        : '@[360px]:grid-cols-2';
    return (
        <div className={clsx('grid grid-cols-1 gap-3', cols)}>
            {resolved.map((p) => (
                <WorkCard key={p.id} project={p} language={ctx.language} onOpen={ctx.onOpenProject} />
            ))}
        </div>
    );
};

// ── Recursive node dispatch ─────────────────────────────────────────────────
function renderNode(node: UINode, key: React.Key, ctx: RenderCtx): React.ReactNode {
    switch (node.type) {
        case 'stack':
            return (
                <div key={key} className={clsx('@container flex flex-col', GAP[node.gap || 'md'])}>
                    {node.children.map((c, i) => renderNode(c, i, ctx))}
                </div>
            );
        case 'row':
            return (
                <div key={key} className={clsx('grid grid-cols-1 items-start', ROW_COLS[node.ratio || '50-50'], GAP.md)}>
                    {node.children.map((c, i) => (
                        <div key={i} className="@container min-w-0">{renderNode(c, 'c', ctx)}</div>
                    ))}
                </div>
            );
        case 'grid':
            return (
                <div
                    key={key}
                    className={clsx('grid grid-cols-1', node.columns === 3 ? '@[360px]:grid-cols-2 @[560px]:grid-cols-3' : '@[360px]:grid-cols-2', GAP.md)}
                >
                    {node.children.map((c, i) => (
                        <div key={i} className="@container min-w-0">{renderNode(c, 'c', ctx)}</div>
                    ))}
                </div>
            );
        case 'section':
            return (
                <div key={key} className="@container flex flex-col gap-3 border-t border-brand-primary/15 pt-3">
                    {node.title && (
                        <div className="text-[11px] uppercase tracking-[0.25em] text-brand-primary/50">{node.title}</div>
                    )}
                    {node.children.map((c, i) => renderNode(c, i, ctx))}
                </div>
            );
        case 'card':
            return (
                <div
                    key={key}
                    className={clsx(
                        '@container flex flex-col gap-3 rounded-lg border p-4',
                        node.accent ? 'border-brand-primary/40 bg-brand-primary/5' : 'border-white/10 bg-black/20',
                    )}
                >
                    {node.children.map((c, i) => renderNode(c, i, ctx))}
                </div>
            );

        case 'text':
            return <TextLeaf key={key} node={node} />;
        case 'heading':
            return <HeadingLeaf key={key} node={node} />;
        case 'callout':
            return <CalloutLeaf key={key} node={node} />;
        case 'badge':
            return <BadgeLeaf key={key} text={node.text} />;

        case 'media': {
            const detail = ctx.detailById.get(node.projectId);
            if (!detail) return ctx.loading ? <DetailPlaceholder key={key} /> : null;
            return <MediaLeaf key={key} detail={detail} />;
        }
        case 'metrics': {
            const detail = ctx.detailById.get(node.projectId);
            if (!detail) return ctx.loading ? <DetailPlaceholder key={key} /> : null;
            return <MetricsLeaf key={key} detail={detail} />;
        }
        case 'techStack':
            return <TechStackLeaf key={key} project={ctx.byId.get(node.projectId)} />;
        case 'link':
            return <LinkLeaf key={key} node={node} project={ctx.byId.get(node.projectId)} language={ctx.language} />;
        case 'content': {
            const detail = ctx.detailById.get(node.projectId);
            if (!detail) return ctx.loading ? <DetailPlaceholder key={key} /> : null;
            return <ContentLeaf key={key} node={node} detail={detail} />;
        }
        case 'workCard':
            return <WorkCardLeaf key={key} node={node} ctx={ctx} />;
        case 'workGrid':
            return <WorkGridLeaf key={key} node={node} ctx={ctx} />;

        default:
            return null;
    }
}

function collectDetailIds(nodes: UINode[], acc: Set<string>): void {
    for (const n of nodes) {
        if (n.type === 'media' || n.type === 'metrics' || n.type === 'content') acc.add(n.projectId);
        if ('children' in n && Array.isArray(n.children)) collectDetailIds(n.children, acc);
    }
}

export function GenerativeUI({ spec, onOpenProject, className }: GenerativeUIProps) {
    const projects = useProjectStore((s) => s.projects);
    const language = useProjectStore((s) => s.language);
    const byId = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);

    const detailIds = useMemo(() => {
        const ids = new Set<string>();
        collectDetailIds(spec.blocks, ids);
        return Array.from(ids);
    }, [spec]);
    const { detailById, loading } = useProjectDetails(detailIds, language);

    const ctx: RenderCtx = { byId, detailById, loading, language, onOpenProject };

    return (
        <div className={clsx('@container flex flex-col gap-4', className)}>
            {spec.blocks.map((block, i) => renderNode(block, i, ctx))}
        </div>
    );
}
