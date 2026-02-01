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

    return (
        <div className={twMerge("flex flex-col h-full", className)}>
            {/* Header - 仅显示 PROJECT 01/06 */}
            <div className="shrink-0 pb-2 border-b border-[var(--color-border-subtle)]">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-[var(--color-brand-secondary)] tracking-[0.2em] uppercase">
                        PROJECT
                    </span>
                    <span className="text-sm font-mono text-[var(--color-brand-primary)]">
                        {String(activeIndex + 1).padStart(2, '0')}/{String(projects.length).padStart(2, '0')}
                    </span>
                </div>
            </div>

            {/* Mission Items - 可滚动容器 */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide pt-1 pr-1">
                <div className="flex flex-col gap-2">
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

                                    {/* 项目类型 */}
                                    <div className={twMerge(
                                        "text-xs font-mono tracking-wider mt-1 uppercase",
                                        isActive
                                            ? "text-[var(--color-brand-primary)]"
                                            : "text-[var(--color-text-muted)]"
                                    )}>
                                        {project.projectType || project.techStack?.[0] || 'PROJECT'}
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
