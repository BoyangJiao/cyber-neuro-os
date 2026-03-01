import { type Project } from '../../data/projects';
import { twMerge } from 'tailwind-merge';
import { ChamferFrame } from '../ui/frames/ChamferFrame';
import { useTranslation } from '../../i18n';

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
    const { t } = useTranslation();

    // Helper to map projects to specific display modes (Case Study / Snapshot)
    const getDisplayMode = (title: string) => {
        const tTitle = title.toLowerCase();

        // Case Study matches
        if (
            (tTitle.includes('world') && tTitle.includes('mobile') && !tTitle.includes('design') && !tTitle.includes('system')) ||
            tTitle.includes('scene') ||
            tTitle.includes('cn redesign') ||
            (tTitle.includes('alipay') && (tTitle.includes('wallet') || tTitle.includes('digital'))) ||
            tTitle === 'world first mobile' ||
            tTitle === 'world first scene redesign' ||
            tTitle === 'alipay digital wallet' ||
            // Chinese matches
            tTitle.includes('支付宝') ||
            tTitle.includes('钱包') ||
            (tTitle.includes('场景') && !tTitle.includes('设计')) ||
            (tTitle.includes('移动') && !tTitle.includes('规范')) ||
            tTitle.includes('官网改版') ||
            tTitle.includes('中国区')
        ) {
            return t('projectLanding.caseStudy');
        }

        // Snapshot matches
        if (
            tTitle.includes('design system') ||
            tTitle.includes('forex') ||
            tTitle.includes('fx redesign') ||
            tTitle.includes('trading') ||
            tTitle.includes('borderpay') ||
            tTitle.includes('super app') ||
            tTitle.includes('vodapay') ||
            tTitle === 'world first design system' ||
            tTitle === 'world first forex trading redesign' ||
            tTitle === 'borderpay super app' ||
            // Chinese matches
            tTitle.includes('设计规范') ||
            tTitle.includes('设计系统') ||
            tTitle.includes('外汇') ||
            tTitle.includes('交易') ||
            tTitle.includes('超级应用')
        ) {
            return t('projectLanding.snapshot');
        }

        // Fallback to generic project label if none matches
        return t('projectLanding.project');
    };

    return (
        <div className={twMerge("flex flex-col h-full", className)}>
            {/* Header - 仅显示 PROJECT 01/06 */}
            <div className="shrink-0 pb-2 border-b border-[var(--color-border-subtle)]">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-[var(--color-brand-secondary)] tracking-[0.2em] uppercase">
                        {t('projectLanding.project')}
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
                                {t('projectLanding.initializing')}
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
                                        onSelect(index);
                                    }}
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
                                        {getDisplayMode(project.title)}
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
