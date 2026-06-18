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
import type { Project } from '../../data/projects';
import type { ProseBlock, UIBlock, UISpec, WorkCardBlock, WorkGridBlock } from './spec';
import { WorkCard } from './components/WorkCard';

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

export function GenerativeUI({ spec, onOpenProject, className }: GenerativeUIProps) {
    const projects = useProjectStore((s) => s.projects);
    const language = useProjectStore((s) => s.language);
    const byId = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);

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
                    default:
                        return null;
                }
            })}
        </div>
    );
}
