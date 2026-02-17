import { type Project } from '../../data/projects';
import { twMerge } from 'tailwind-merge';
import { useSoundSystem } from '../../hooks/useSoundSystem';
import { ChamferFrame } from '../ui/frames/ChamferFrame';

interface MissionListProps {
    projects: Project[];
    activeIndex: number;
    onSelect: (index: number) => void;
    className?: string;
}

/**
 * MissionList - 左侧任务列表面板
 * 
 * 简洁设计：仅显示项目名称和类型
 * click-to-select 交互模式
 */
export const MissionList = ({
    projects,
    activeIndex,
    onSelect,
    className,
}: MissionListProps) => {
    const { playHover, playClick } = useSoundSystem();

    // Helper to map projects to specific display modes (Case Study / Snapshot)
    const getDisplayMode = (title: string, originalType: any) => {
        const t = title.toLowerCase();

        // Case Study matches
        if (
            (t.includes('world') && t.includes('mobile') && !t.includes('design') && !t.includes('system')) ||
            t.includes('scene') ||
            t.includes('cn redesign') ||
            (t.includes('alipay') && (t.includes('wallet') || t.includes('digital'))) ||
            t === 'world first mobile' ||
            t === 'world first scene redesign' ||
            t === 'alipay digital wallet'
        ) {
            return 'Case Study';
        }

        // Snapshot matches
        if (
            t.includes('design system') ||
            t.includes('forex') ||
            t.includes('fx redesign') ||
            t.includes('trading') ||
            t.includes('borderpay') ||
            t.includes('super app') ||
            t.includes('vodapay') ||
            t === 'world first design system' ||
            t === 'world first forex trading redesign' ||
            t === 'borderpay super app'
        ) {
            return 'Snapshot';
        }

        // Fallback
        if (Array.isArray(originalType)) return originalType[0] || 'PROJECT';
        return (originalType as string) || 'PROJECT';
    };

    return (
        <div className={twMerge("flex flex-col h-full", className)}>
            {/* Header - 仅显示 PROJECT 01/06 */}
            <div className="shrink-0 pb-2 border-b border-[var(--color-border-subtle)]">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-[var(--color-brand-secondary)] tracking-[0.2em] uppercase">
                        PROJECT
                    </span>
                    <span className="text-sm font-mono text-[var(--color-brand-primary)]">
                        {String(projects.length > 0 ? activeIndex + 1 : 0).padStart(2, '0')}/{String(projects.length).padStart(2, '0')}
                    </span>
                </div>
            </div>

            {/* Mission Items - 可滚动容器 */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide pt-1 pr-1">
                <div className="flex flex-col gap-2">
                    {projects.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 opacity-50">
                            <span className="text-[10px] font-mono tracking-[0.3em] animate-pulse">
                                INITIALIZING CORE...
                            </span>
                        </div>
                    )}
                    {projects.map((project, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <ChamferFrame
                                key={project.id}
                                chamferSize={6}
                                className="w-full transition-all duration-200 cursor-pointer shrink-0"
                                bgClassName={twMerge(
                                    isActive
                                        ? "bg-[var(--color-brand-primary)]/20"
                                        : "bg-[var(--color-bg-surface)]/40 hover:bg-[var(--color-bg-surface)]/70"
                                )}
                                isActive={isActive}
                                showEffects={false}
                                animate={false}
                            >
                                <button
                                    onClick={() => {
                                        playClick();
                                        onSelect(index);
                                    }}
                                    onMouseEnter={playHover}
                                    className="group/item w-full text-left p-3 flex flex-col"
                                >
                                    {/* 项目名称 */}
                                    <h4 className={twMerge(
                                        "text-xs font-display tracking-wider uppercase truncate transition-colors",
                                        isActive
                                            ? "text-[var(--color-text-accent)]"
                                            : "text-[var(--color-text-secondary)] group-hover/item:text-[var(--color-text-brand)]"
                                    )}>
                                        {project.title}
                                    </h4>

                                    {/* 项目类型/展示方式 */}
                                    <div className={twMerge(
                                        "text-xs font-mono tracking-wider mt-1 uppercase",
                                        isActive
                                            ? "text-[var(--color-brand-primary)]"
                                            : "text-[var(--color-text-muted)]"
                                    )}>
                                        {getDisplayMode(project.title, project.projectType)}
                                    </div>
                                </button>
                            </ChamferFrame>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
