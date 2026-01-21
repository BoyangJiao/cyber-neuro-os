import { type Project } from '../../data/projects';
import { useNavigate } from 'react-router-dom';
import { ChamferFrame } from '../ui/frames/ChamferFrame';
import { CyberButton } from '../ui/CyberButton';
import { MotionDiv } from '../motion/MotionWrappers';
import { twMerge } from 'tailwind-merge';
import { useSoundSystem } from '../../hooks/useSoundSystem';
import { AnimatePresence } from 'framer-motion';
import { useState, useRef, useLayoutEffect } from 'react';
import { ScanlineEffect, PixelGridEffect } from '../ui/effects';
import { useAppStore } from '../../store/useAppStore';
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
    const { playHover, playClick } = useSoundSystem();
    const [isImageHovered, setIsImageHovered] = useState(false);
    const transitionSettings = useAppStore(state => state.transitionGlitchSettings);
    const containerRef = useRef<HTMLDivElement>(null);

    // 使用 ref 存储最新设置，这样动画可以读取最新值但不会因设置变化而重新触发
    const settingsRef = useRef(transitionSettings);
    settingsRef.current = transitionSettings;

    // GSAP Smooth Transition Animation - 默认使用平滑过渡
    useLayoutEffect(() => {
        if (!containerRef.current || !project) return;

        const el = containerRef.current;

        // 强制清理任何残留动画
        gsap.killTweensOf(el);

        // 读取 ref 中的最新设置值
        const {
            enabled, rgbSplit, skewAngle, displacement, flickerIntensity, sliceAmount, duration,
            hueRotate, colorInvert, saturate
        } = settingsRef.current;

        // 立即重置到初始状态
        gsap.set(el, {
            opacity: 0,
            x: 0,
            y: 0,
            skewX: 0,
            scale: 1,
            filter: 'none',
            clipPath: 'inset(0 0 0 0)',
            clearProps: 'none'
        });

        // === 新的平滑过渡效果 (默认) ===
        // 如果 glitch 未启用，使用优雅的 cyber-slide 效果
        if (!enabled) {
            const tl = gsap.timeline();

            // Phase 1: 从下方滑入 + 淡入 + 轻微缩放
            gsap.set(el, {
                opacity: 0,
                y: 30,
                scale: 0.98,
                filter: 'blur(8px)'
            });

            tl.to(el, {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                duration: 0.5,
                ease: 'power3.out'
            });

            return () => {
                tl.kill();
            };
        }

        const durationSec = Math.max(0.1, duration / 1000); // 最小 100ms

        // 允许极端切片效果
        const safeSlice = sliceAmount;

        // 辅助函数：生成 clipPath (允许更极端值)
        const getClip = (top: number, bottom: number) => {
            return `inset(${Math.max(top, 0)}% 0 ${Math.max(bottom, 0)}% 0)`;
        };

        // 辅助函数：生成 RGB 分离 filter
        const getRgbFilter = (split: number, opacity: number = 1) => {
            if (split <= 0) return '';
            return `drop-shadow(${split}px 0 0 rgba(255, 0, 100, ${opacity})) drop-shadow(-${split}px 0 0 rgba(0, 255, 255, ${opacity}))`;
        };

        // 组合 filter：RGB分离 + 色调 + 反转 + 饱和度
        const getFullFilter = (rgbPart: string, hue: number, inv: number, sat: number) => {
            const parts = [rgbPart];
            if (hue > 0) parts.push(`hue-rotate(${hue}deg)`);
            if (inv > 0) parts.push(`invert(${inv})`);
            if (sat !== 1) parts.push(`saturate(${sat})`);
            return parts.filter(Boolean).join(' ') || 'none';
        };


        const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });

        // Phase 1: 剧烈抖动 + RGB分离 + 颜色偏移
        tl.to(el, {
            opacity: 1,
            x: -displacement,
            skewX: -skewAngle,
            filter: getFullFilter(getRgbFilter(rgbSplit, 1), hueRotate, 0, saturate),
            clipPath: safeSlice > 0 ? getClip(safeSlice * 15, safeSlice * 25) : 'inset(0 0 0 0)',
            duration: durationSec * 0.08,
            ease: 'steps(1)'
        })
            // Phase 2: 第一次闪烁 - 快速暗下 + 颜色反转
            .to(el, {
                opacity: Math.max(0.1, 1 - flickerIntensity * 0.9),
                filter: getFullFilter(getRgbFilter(rgbSplit * 0.5, 0.5), 0, colorInvert, 1),
                duration: durationSec * 0.03,
                ease: 'steps(1)'
            })
            // Phase 3: 第一次闪烁 - 快速亮起
            .to(el, {
                opacity: 1,
                x: displacement * 0.9,
                skewX: skewAngle * 1.2,
                filter: getFullFilter(getRgbFilter(rgbSplit * 1.3, 1), -hueRotate * 0.5, 0, saturate * 1.2),
                clipPath: safeSlice > 0 ? getClip(safeSlice * 35, safeSlice * 5) : 'inset(0 0 0 0)',
                duration: durationSec * 0.06,
                ease: 'steps(1)'
            })
            // Phase 4: 反向位移 + 饱和度增强
            .to(el, {
                x: -displacement * 0.6,
                skewX: -skewAngle * 0.7,
                filter: getFullFilter(getRgbFilter(rgbSplit * 0.8, 0.9), hueRotate * 0.3, 0, saturate * 1.5),
                clipPath: safeSlice > 0 ? getClip(safeSlice * 8, safeSlice * 45) : 'inset(0 0 0 0)',
                duration: durationSec * 0.08,
                ease: 'steps(1)'
            })
            // Phase 5: 第二次闪烁 - 更剧烈暗下 + 强反转 + 色调180°
            .to(el, {
                opacity: Math.max(0.05, 1 - flickerIntensity),
                filter: getFullFilter(getRgbFilter(rgbSplit * 1.5, 1), 180, colorInvert * 1.5, 1),
                clipPath: safeSlice > 0 ? getClip(safeSlice * 50, safeSlice * 20) : 'inset(0 0 0 0)',
                duration: durationSec * 0.04,
                ease: 'steps(1)'
            })
            // Phase 6: 第二次闪烁 - 亮起
            .to(el, {
                opacity: 1,
                x: displacement * 1.1,
                skewX: skewAngle * 0.4,
                filter: getFullFilter(getRgbFilter(rgbSplit * 1.1, 1), 0, 0, saturate),
                clipPath: 'inset(0 0 0 0)',
                duration: durationSec * 0.05,
                ease: 'steps(1)'
            })
            // Phase 7: 微抖动
            .to(el, {
                x: -displacement * 0.25,
                skewX: -skewAngle * 0.15,
                filter: getFullFilter(getRgbFilter(rgbSplit * 0.4, 0.6), hueRotate * 0.2, 0, 1),
                duration: durationSec * 0.08,
                ease: 'power1.out'
            })
            // Phase 8: 稳定
            .to(el, {
                opacity: 1,
                x: 0,
                skewX: 0,
                filter: getFullFilter(getRgbFilter(rgbSplit * 0.15, 0.25), 0, 0, 1),
                clipPath: 'inset(0 0 0 0)',
                duration: durationSec * 0.28,
                ease: 'power2.out'
            })
            // Phase 9: 完全清除
            .to(el, {
                filter: 'none',
                duration: durationSec * 0.3,
                ease: 'power2.out'
            });

        return () => {
            tl.kill();
            gsap.killTweensOf(el);
        };
    }, [project?.id]); // 只在 project 切换时触发

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
        <AnimatePresence mode="wait">
            <MotionDiv
                ref={containerRef}
                key={project.id}
                className={twMerge("flex flex-col h-full", className)}
            >
                {/* Mission Header - 吸顶 */}
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

                {/* 可滚动内容区域 */}
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide pt-1">
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

                                        {/* 效果包裹容器 */}
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
                        <h2 className="text-xl 2xl:text-2xl font-display font-bold text-[var(--color-text-primary)] tracking-wider uppercase">
                            {project.title}
                        </h2>

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
            </MotionDiv>
        </AnimatePresence>
    );
};
