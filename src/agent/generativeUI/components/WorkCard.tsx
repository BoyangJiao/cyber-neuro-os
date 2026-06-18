/**
 * WorkCard — presentational card for one real project.
 *
 * Pure/presentational: every value comes from the resolved `Project` (real store
 * data), never from the model. `emphasis` only changes which fields are visually
 * highlighted. Styling reuses the design-system tokens + `CyberButton`.
 */

import clsx from 'clsx';
import type { Project } from '../../../data/projects';
import type { WorkField } from '../spec';
import { CyberButton } from '../../../components/ui/CyberButton';

interface WorkCardProps {
    project: Project;
    emphasis?: WorkField[];
    /** Open the project detail. The renderer wires navigation/overlay-exit here. */
    onOpen?: (project: Project) => void;
    language?: 'en' | 'zh';
    className?: string;
}

type StatusTone = 'success' | 'warning' | 'muted' | 'danger' | 'brand';

const STATUS_TONE: Record<string, StatusTone> = {
    DEPLOYED: 'success',
    LIVE: 'success',
    IN_DEVELOPMENT: 'warning',
    ARCHIVED: 'muted',
    CLASSIFIED: 'danger',
};

const TONE_DOT: Record<StatusTone, string> = {
    success: 'bg-status-success',
    warning: 'bg-status-warning',
    muted: 'bg-text-secondary',
    danger: 'bg-status-danger',
    brand: 'bg-brand-primary',
};

const STR = {
    en: { open: 'VIEW', live: 'LIVE', stack: 'STACK' },
    zh: { open: '查看', live: '访问', stack: '技术栈' },
} as const;

const normalizeStatus = (status: string) => status.toUpperCase().replace(/\s+/g, '_');

export function WorkCard({ project, emphasis = [], onOpen, language = 'en', className }: WorkCardProps) {
    const t = STR[language];
    const has = (f: WorkField) => emphasis.includes(f);

    const tone = STATUS_TONE[normalizeStatus(project.status)] ?? 'brand';
    const isIconThumb = project.thumbnail.startsWith('ri-');
    const projectType = Array.isArray(project.projectType)
        ? project.projectType.join(' · ')
        : project.projectType;

    return (
        <div
            className={clsx(
                'group relative flex flex-col overflow-hidden rounded-md',
                'border border-brand-primary/30 bg-black/30 backdrop-blur-sm',
                'transition-colors duration-200 hover:border-brand-primary/70',
                className,
            )}
        >
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden bg-bg-deep">
                {isIconThumb ? (
                    <div className="flex h-full w-full items-center justify-center">
                        <i className={clsx(project.thumbnail, 'text-4xl text-brand-primary/60')} />
                    </div>
                ) : (
                    <img
                        src={project.thumbnail}
                        alt={project.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                )}

                {/* Status badge */}
                <div
                    className={clsx(
                        'absolute right-2 top-2 flex items-center gap-1.5 rounded-sm px-2 py-1',
                        'bg-black/60 font-mono text-[10px] uppercase tracking-wider backdrop-blur-sm',
                        has('status') ? 'text-text-primary ring-1 ring-brand-primary/50' : 'text-text-secondary',
                    )}
                >
                    <span className={clsx('h-1.5 w-1.5 rounded-full', TONE_DOT[tone])} />
                    {project.status}
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg font-bold leading-tight text-text-accent">
                        {project.title}
                    </h3>
                    {project.timeline && (
                        <span
                            className={clsx(
                                'shrink-0 font-mono text-xs',
                                has('timeline') ? 'text-brand-primary' : 'text-text-secondary',
                            )}
                        >
                            {project.timeline}
                        </span>
                    )}
                </div>

                {projectType && (
                    <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                        {projectType}
                    </span>
                )}

                {project.description && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-text-secondary">
                        {project.description}
                    </p>
                )}

                {/* Tech stack */}
                {project.techStack.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                        {project.techStack.slice(0, 6).map((tech) => (
                            <span
                                key={tech}
                                className={clsx(
                                    'rounded-sm px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide',
                                    has('techStack')
                                        ? 'border border-brand-primary/50 text-brand-primary'
                                        : 'border border-white/10 text-text-secondary',
                                )}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="mt-auto flex items-center gap-2 pt-3">
                    {onOpen && (
                        <CyberButton
                            variant="corner"
                            size="sm"
                            onClick={() => onOpen(project)}
                        >
                            {t.open}
                        </CyberButton>
                    )}
                    {project.liveUrl && (
                        <CyberButton
                            variant="ghost"
                            size="sm"
                            color={has('liveUrl') ? 'green' : 'cyan'}
                            onClick={() => window.open(project.liveUrl, '_blank', 'noopener,noreferrer')}
                        >
                            {t.live} ↗
                        </CyberButton>
                    )}
                </div>
            </div>
        </div>
    );
}
