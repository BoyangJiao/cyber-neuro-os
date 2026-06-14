import { useCallback, useEffect, useRef } from 'react';
import { MissionList } from '../components/project/MissionList';
import { MissionBriefing } from '../components/project/MissionBriefing';
import { MotionDiv } from '../components/motion/MotionWrappers';
import { HoloFrame } from '../components/ui/HoloFrame';
import { CyberButton } from '../components/ui/CyberButton';
import { useProjectStore } from '../store/useProjectStore';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '../sanity/client';
import { PROJECTS_QUERY } from '../sanity/queries';
import { useTranslation } from '../i18n';
import type { SanityProjectRaw } from '../sanity/types';

/**
 * ProjectLanding - Mission 风格的项目展示页
 * 
 * 布局：左侧任务列表 (2列) + 右侧任务简报 (6列)
 * 交互：click-to-select
 */
export const ProjectLanding = () => {
    const navigate = useNavigate();
    const { projects, activeProjectIndex, setActiveProjectIndex, setProjects, language } = useProjectStore();
    const { t } = useTranslation();

    // Enable Real-time synchronization for Sanity Presentation mode
    const { data: sanityProjects, loading } = useQuery<SanityProjectRaw[]>(PROJECTS_QUERY, { language });

    useEffect(() => {
        if (sanityProjects) {
            setProjects(sanityProjects);
        }
    }, [sanityProjects, setProjects]);

    // 获取所有项目
    const isLoading = loading && projects.length === 0;
    const visibleProjects = projects;
    const activeProject = visibleProjects[activeProjectIndex] || null;

    // 选择任务
    const handleSelectMission = useCallback((index: number) => {
        setActiveProjectIndex(index);
    }, [setActiveProjectIndex]);

    // ── Mobile: swipe the briefing horizontally to switch missions ──
    const chipStripRef = useRef<HTMLDivElement>(null);
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        const start = touchStartRef.current;
        touchStartRef.current = null;
        if (!start) return;
        const dx = e.changedTouches[0].clientX - start.x;
        const dy = e.changedTouches[0].clientY - start.y;
        // Decisively horizontal swipes only — vertical scrolling stays untouched
        if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
        const next = activeProjectIndex + (dx < 0 ? 1 : -1);
        if (next >= 0 && next < visibleProjects.length) {
            setActiveProjectIndex(next);
        }
    }, [activeProjectIndex, visibleProjects.length, setActiveProjectIndex]);

    // Keep the active chip visible after tap OR swipe navigation
    useEffect(() => {
        chipStripRef.current
            ?.querySelector('[data-chip-active="true"]')
            ?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }, [activeProjectIndex]);

    return (
        <MotionDiv
            className="absolute top-0 left-0 w-full h-full z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.3, ease: "circOut" }}
        >
            <HoloFrame
                variant="lines"
                className="w-full h-full bg-black/40 backdrop-blur-[1px] relative overflow-hidden p-0"
                showAtmosphere={true}
                showMask={true}
            >
                {/* 主容器 - Flex 垂直布局 */}
                <div className="w-full h-full flex flex-col">

                    {/* === HEADER === */}
                    <div className="w-full shrink-0 flex items-center justify-between relative z-[60] px-1 2xl:px-2 pt-1 2xl:pt-1 pb-1 2xl:pb-1">
                        {/* 左侧占位 */}
                        <div className="w-16 2xl:w-20" />

                        {/* 中央标题 */}
                        <div className="flex flex-col items-center">
                            <h1 className="text-sm 2xl:text-lg font-bold text-brand-secondary tracking-[0.3em] uppercase">
                                {t('features.project')}
                            </h1>
                        </div>

                        {/* 右侧关闭按钮 */}
                        <div className="flex justify-end w-16 2xl:w-20">
                            <CyberButton
                                variant="ghost"
                                icon={<i className="ri-close-line text-xl 2xl:text-2xl" />}
                                onClick={() => navigate('/')}
                                className="text-brand-primary hover:text-brand-secondary transition-colors"
                                iconOnly
                                silentHover={true}
                            />
                        </div>
                    </div>

                    {/* === MAIN CONTENT - mobile: selector strip + briefing / lg+: 8-col grid === */}
                    <div className="flex-1 w-full min-h-0 px-3 lg:px-4 2xl:px-6 pb-3 lg:pb-4 2xl:pb-6">
                        <div className="w-full h-full flex flex-col lg:grid lg:grid-cols-8 gap-3 lg:gap-4 2xl:gap-6">

                            {/* 移动端：横滑任务选择条 */}
                            <div ref={chipStripRef} className="lg:hidden shrink-0 -mx-3 px-3 overflow-x-auto no-scrollbar">
                                <div className="flex gap-2 w-max">
                                    {isLoading
                                        ? [...Array(4)].map((_, i) => (
                                            <div
                                                key={`chip-skeleton-${i}`}
                                                className="w-28 h-9 shrink-0 animate-pulse bg-[var(--color-bg-surface-2)]/30 border border-[var(--color-border-subtle)]"
                                            />
                                        ))
                                        : visibleProjects.map((project, index) => {
                                            const isActive = index === activeProjectIndex;
                                            return (
                                                <button
                                                    key={project.id}
                                                    data-chip-active={isActive}
                                                    onClick={() => handleSelectMission(index)}
                                                    className={`shrink-0 flex items-center gap-2 px-3 py-2 min-h-[36px] border transition-colors ${
                                                        isActive
                                                            ? 'border-[var(--color-brand-primary)]/60 bg-[var(--color-brand-primary)]/15 text-[var(--color-text-accent)]'
                                                            : 'border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]/40 text-[var(--color-text-secondary)] active:bg-[var(--color-bg-surface)]/70'
                                                    }`}
                                                >
                                                    <span className="text-[10px] font-mono text-[var(--color-brand-primary)]">
                                                        M-{String(index + 1).padStart(2, '0')}
                                                    </span>
                                                    <span className="text-[10px] font-display tracking-wider uppercase max-w-[120px] truncate">
                                                        {project.title}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>

                            {/* 左侧：任务列表 (2 列, lg+) */}
                            <div className="hidden lg:block col-span-2 h-full overflow-hidden">
                                <MissionList
                                    projects={visibleProjects}
                                    activeIndex={activeProjectIndex}
                                    onSelect={handleSelectMission}
                                    isLoading={isLoading}
                                />
                            </div>

                            {/* 右侧：任务简报 (6 列 / 移动端占满，横滑切换任务) */}
                            <div
                                className="flex-1 min-h-0 lg:col-span-6 lg:h-full overflow-hidden"
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                            >
                                <MissionBriefing
                                    project={activeProject}
                                    missionNumber={activeProjectIndex + 1}
                                    isLoading={isLoading}
                                />
                            </div>

                        </div>
                    </div>

                </div>
            </HoloFrame>
        </MotionDiv>
    );
};
