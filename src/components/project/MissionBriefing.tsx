import { type Project } from '../../data/projects';
import { useNavigate } from 'react-router-dom';
import { ChamferFrame } from '../ui/frames/ChamferFrame';
import { CyberButton } from '../ui/CyberButton';
import { twMerge } from 'tailwind-merge';
import { useSoundSystem } from '../../hooks/useSoundSystem';
import { useRef, useLayoutEffect, useState } from 'react';
import { ScanlineEffect, PixelGridEffect } from '../ui/effects';
import gsap from 'gsap';

interface MissionBriefingProps {
    project: Project | null;
    missionNumber: number;
    className?: string;
}

/**
 * MissionBriefing - 右侧任务简报面板
 * 
 * 简洁设计：
 * - Header: M-01 / ACTIVE / timeline
 * - Hero Image: 16:9
 * - Briefing: projectType + techStack
 * - Deploy button (if liveUrl exists)
 * 
 * GSAP-powered glitch transition with dynamic parameters
 */
export const MissionBriefing = ({
    project,
    missionNumber,
    className,
}: MissionBriefingProps) => {
    const navigate = useNavigate();
    const { playClick, playHover } = useSoundSystem();
    const [isImageHovered, setIsImageHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    // GSAP Smooth Transition Animation - 内容扫描 + 标题乱码解密
    useLayoutEffect(() => {
        if (!contentRef.current || !titleRef.current || !project) return;

        const contentEl = contentRef.current;
        const titleEl = titleRef.current;
        // 清理 title 移除零宽字符等不可见字符，确保动画准确
        const finalTitle = project.title.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

        // 强制清理
        gsap.killTweensOf(contentEl);
        gsap.killTweensOf(titleEl);

        const tl = gsap.timeline();

        // 1. 内容区域扫描
        tl.fromTo(contentEl,
            {
                clipPath: 'inset(0 0 100% 0)',
                y: -15,
                filter: 'blur(4px)',
                opacity: 0
            },
            {
                clipPath: 'inset(0 0 0% 0)',
                y: 0,
                filter: 'blur(0px)',
                opacity: 1,
                duration: 0.45,
                ease: 'power3.out',
                clearProps: 'all'
            },
            0 // 同步开始
        );

        // 2. 标题乱码解密 (手动实现 Scramble 效果)
        // 先设为空或初始状态
        if (titleEl) {
            titleEl.textContent = '';
        }

        const scrambleObj = { value: 0 };
        tl.to(scrambleObj, {
            value: 1,
            duration: 0.8,
            ease: 'none',
            onUpdate: () => {
                const progress = scrambleObj.value;
                const len = finalTitle.length;
                const revealed = Math.floor(progress * len);

                let result = finalTitle.substring(0, revealed);

                const remaining = len - revealed;
                for (let i = 0; i < remaining; i++) {
                    if (finalTitle[revealed + i] === ' ') {
                        result += ' ';
                    } else {
                        result += chars[Math.floor(Math.random() * chars.length)];
                    }
                }

                if (titleEl) {
                    titleEl.textContent = result;
                }
            },
            onComplete: () => {
                console.log('[MissionBriefing] Animation Complete');
                if (titleEl) titleEl.textContent = finalTitle;
            }
        }, 0);

        return () => {
            tl.kill();
            gsap.killTweensOf(contentEl);
            gsap.killTweensOf(titleEl);
        };
    }, [project?.id]); // 每次项目切换触发

    // Null状态处理
    if (!project) {
        return (
            <div className={twMerge("flex items-center justify-center h-full", className)}>
                <span className="text-sm text-[var(--color-text-dim)] font-mono">
                    [ NO MISSION SELECTED ]
                </span>
            </div>
        );
    }

    const handleDeploy = () => {
        if (project.liveUrl) {
            window.open(project.liveUrl, '_blank');
        }
    };

    const handleViewDetails = () => {
        playClick();
        navigate(`/projects/${project.id}`);
    };

    const hasImage = project.thumbnail?.startsWith('http') || project.thumbnail?.startsWith('/');
    const hasLiveUrl = !!project.liveUrl;

    return (
        <div
            ref={containerRef}
            key={project.id}
            className={twMerge("flex flex-col h-full", className)}
        >
            {/* Mission Header - 固定不动 */}
            <div className="shrink-0 flex items-center justify-between mb-0 pb-1 border-b border-[var(--color-border-subtle)] z-10">
                <div className="flex items-center gap-3">
                    <span className="text-md 2xl:text-lg font-mono text-[var(--color-brand-primary)] font-bold">
                        M-{String(missionNumber).padStart(2, '0')}
                    </span>
                    {/* 使用 Sanity status */}
                    <span className="text-sm font-mono text-[var(--color-text-secondary)] uppercase tracking-wider">
                        {project.status || 'ACTIVE'}
                    </span>
                </div>
                {/* Timeline 替代 project type */}
                <span className="text-xs font-mono text-[var(--color-text-primary)] tracking-wider">
                    {project.timeline || '—'}
                </span>
            </div>

            {/* 可滚动内容区域 - 应用扫描动效 */}
            <div ref={contentRef} className="flex-1 min-h-0 overflow-y-auto scrollbar-hide pt-1">
                {/* Hero Image - 固定 16:9 比例 */}
                <div className="w-full mb-4" style={{ aspectRatio: '16/9' }}>
                    <ChamferFrame
                        chamferSize={16}
                        className="w-full h-full cursor-pointer"
                        showEffects={false}
                    >
                        <div
                            className="relative w-full h-full overflow-hidden"
                            onClick={handleViewDetails}
                            onMouseEnter={() => {
                                playHover();
                                setIsImageHovered(true);
                            }}
                            onMouseLeave={() => setIsImageHovered(false)}
                        >
                            {hasImage ? (
                                <>
                                    <img
                                        src={project.thumbnail}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />

                                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                        {/* 使用标准化组件执行网格效果 */}
                                        <PixelGridEffect active={isImageHovered} />

                                        {/* 使用标准化组件执行 Flash 扫描效果 */}
                                        <ScanlineEffect variant="flash" active={isImageHovered} />
                                    </div>

                                    {/* 轻微遮罩 - 仅图片区域 */}
                                    <div className={twMerge(
                                        "absolute inset-0 transition-colors duration-300",
                                        isImageHovered ? "bg-[var(--color-brand-dim)]/10" : "bg-transparent"
                                    )} />
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-surface)]">
                                    <i className={twMerge(
                                        project.thumbnail || 'ri-code-s-slash-line',
                                        "text-[80px] 2xl:text-[120px] text-[var(--color-brand-primary)]/20"
                                    )} />
                                </div>
                            )}
                        </div>
                    </ChamferFrame>
                </div>

                {/* Briefing Content */}
                <div className="space-y-3">
                    {/* Title */}
                    <h2
                        ref={titleRef}
                        className="text-xl 2xl:text-2xl font-display font-bold text-[var(--color-text-primary)] tracking-wider uppercase min-h-[1.5em]"
                    />

                    {/* Description */}
                    <p className="text-sm 2xl:text-base text-[var(--color-text-secondary)] leading-relaxed">
                        {project.description}
                    </p>

                    {/* Project Type */}
                    <div className="text-xs font-mono text-[var(--color-brand-primary)] tracking-wider uppercase">
                        {project.projectType || project.techStack?.[0] || 'PROJECT'}
                    </div>
                </div>

                {/* Action Button - 仅当有 liveUrl 时显示 */}
                {hasLiveUrl && (
                    <div className="pt-4 mt-4">
                        <CyberButton
                            variant="chamfer"
                            onClick={handleDeploy}
                            className="w-full"
                        >
                            <i className="ri-external-link-line mr-2" />
                            DEPLOY
                        </CyberButton>
                    </div>
                )}
            </div>
        </div>
    );
};
