/**
 * GenerativeUI — dispatch renderer for a validated UISpec.
 *
 * Same `switch(type)` shape as ContentSlotRenderer. Data-bound blocks resolve
 * their `projectId`(s) against the live project store; a reference that doesn't
 * resolve is skipped (never fabricated). `prose` renders as a markdown subset with
 * no raw HTML.
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
    ProjectContentBlock,
    ProjectHeaderBlock,
    ProseBlock,
    UIBlock,
    UISpec,
    WorkCardBlock,
    WorkGridBlock,
} from './spec';
import { WorkCard } from './components/WorkCard';
import { selectContentBlocks } from './detail';
import { useProjectDetails } from './useProjectDetails';

interface GenerativeUIProps {
    spec: UISpec;
    /** Open a project detail; wired by the host (lab navigates, Borvis exits + navigates). */
    onOpenProject?: (project: Project) => void;
    className?: string;
}

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

const ProseRenderer = ({ block }: { block: ProseBlock }) => (
    <div className="space-y-2">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={PROSE_COMPONENTS}>
            {block.text}
        </ReactMarkdown>
    </div>
);

const WorkCardRenderer = ({
    block,
    byId,
    language,
    onOpenProject,
}: {
    block: WorkCardBlock;
    byId: Map<string, Project>;
    language: 'en' | 'zh';
    onOpenProject?: (p: Project) => void;
}) => {
    const project = byId.get(block.projectId);
    if (!project) return null;
    return (
        <WorkCard
            project={project}
            emphasis={block.emphasis}
            language={language}
            onOpen={onOpenProject}
        />
    );
};

const WorkGridRenderer = ({
    block,
    byId,
    language,
    onOpenProject,
}: {
    block: WorkGridBlock;
    byId: Map<string, Project>;
    language: 'en' | 'zh';
    onOpenProject?: (p: Project) => void;
}) => {
    const resolved = block.projectIds
        .map((id) => byId.get(id))
        .filter((p): p is Project => p !== undefined);
    if (!resolved.length) return null;

    const cols = block.columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2';
    return (
        <div className={clsx('grid grid-cols-1 gap-3', cols)}>
            {resolved.map((project) => (
                <WorkCard
                    key={project.id}
                    project={project}
                    language={language}
                    onOpen={onOpenProject}
                />
            ))}
        </div>
    );
};

const DetailPlaceholder = () => (
    <div className="h-28 w-full animate-pulse rounded-lg border border-brand-primary/15 bg-brand-primary/5" />
);

const ProjectHeaderRenderer = ({
    block,
    byId,
    language,
}: {
    block: ProjectHeaderBlock;
    byId: Map<string, Project>;
    language: 'en' | 'zh';
}) => {
    const project = byId.get(block.projectId);
    if (!project) return null;

    const types = Array.isArray(project.projectType)
        ? project.projectType
        : project.projectType
            ? [project.projectType]
            : [];

    return (
        <div className="flex flex-col gap-2 border-l-2 border-brand-primary/40 pl-3">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-display text-lg font-bold text-text-accent">{project.title}</h3>
                {project.timeline && (
                    <span className="font-mono text-xs text-text-secondary">{project.timeline}</span>
                )}
            </div>
            {(types.length > 0 || project.techStack.length > 0) && (
                <div className="flex flex-wrap gap-1.5">
                    {types.map((t) => (
                        <span key={t} className="rounded bg-brand-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-brand-primary">
                            {t}
                        </span>
                    ))}
                    {project.techStack.slice(0, 6).map((tech) => (
                        <span key={tech} className="rounded border border-text-muted/20 px-2 py-0.5 text-[10px] text-text-secondary">
                            {tech}
                        </span>
                    ))}
                </div>
            )}
            {project.liveUrl && (
                <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-fit text-xs text-brand-primary underline decoration-brand-primary/40 underline-offset-2 hover:decoration-brand-primary"
                >
                    {language === 'zh' ? '访问 ↗' : 'Visit ↗'}
                </a>
            )}
        </div>
    );
};

const ProjectMediaRenderer = ({ detail }: { detail?: ProjectDetailData }) => {
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

const ProjectMetricsRenderer = ({ detail }: { detail?: ProjectDetailData }) => {
    const metrics = detail?.coreMetrics || [];
    if (!metrics.length) return null;
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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

const ProjectContentRenderer = ({
    block,
    detail,
}: {
    block: ProjectContentBlock;
    detail?: ProjectDetailData;
}) => {
    const blocks = selectContentBlocks(detail, { kinds: block.kinds, limit: block.limit });
    if (!blocks.length) return null;
    return <ContentSlotRenderer blocks={blocks} />;
};

export function GenerativeUI({ spec, onOpenProject, className }: GenerativeUIProps) {
    const projects = useProjectStore((s) => s.projects);
    const language = useProjectStore((s) => s.language);
    const byId = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);

    // Blocks that bind to a project's rich CMS content need its detail fetched.
    const detailIds = useMemo(() => {
        const ids = new Set<string>();
        for (const block of spec.blocks) {
            if (
                block.type === 'projectMedia' ||
                block.type === 'projectMetrics' ||
                block.type === 'projectContent'
            ) {
                ids.add(block.projectId);
            }
        }
        return Array.from(ids);
    }, [spec]);
    const { detailById, loading } = useProjectDetails(detailIds, language);

    return (
        <div className={clsx('flex flex-col gap-4', className)}>
            {spec.blocks.map((block: UIBlock, i) => {
                switch (block.type) {
                    case 'prose':
                        return <ProseRenderer key={i} block={block} />;
                    case 'workCard':
                        return (
                            <WorkCardRenderer
                                key={i}
                                block={block}
                                byId={byId}
                                language={language}
                                onOpenProject={onOpenProject}
                            />
                        );
                    case 'workGrid':
                        return (
                            <WorkGridRenderer
                                key={i}
                                block={block}
                                byId={byId}
                                language={language}
                                onOpenProject={onOpenProject}
                            />
                        );
                    case 'projectHeader':
                        return <ProjectHeaderRenderer key={i} block={block} byId={byId} language={language} />;
                    case 'projectMedia': {
                        const detail = detailById.get(block.projectId);
                        if (!detail) return loading ? <DetailPlaceholder key={i} /> : null;
                        return <ProjectMediaRenderer key={i} detail={detail} />;
                    }
                    case 'projectMetrics': {
                        const detail = detailById.get(block.projectId);
                        if (!detail) return loading ? <DetailPlaceholder key={i} /> : null;
                        return <ProjectMetricsRenderer key={i} detail={detail} />;
                    }
                    case 'projectContent': {
                        const detail = detailById.get(block.projectId);
                        if (!detail) return loading ? <DetailPlaceholder key={i} /> : null;
                        return <ProjectContentRenderer key={i} block={block} detail={detail} />;
                    }
                    default:
                        return null;
                }
            })}
        </div>
    );
}
