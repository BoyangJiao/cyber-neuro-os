import { useState, useRef, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { useSoundSystem } from '../../hooks/useSoundSystem';
import { ChamferFrame } from './frames/ChamferFrame';
import { PixelGridEffect, PCBTraceEffect } from './effects';

export type GlitchType = 'heavy' | 'rgb' | 'slice' | 'vertical' | 'subtle' | 'standard';

export interface CyberSlotCardProps {
    title: string;
    subtitle?: string;
    inactiveImage: string;
    activeImage: string;
    onClick?: () => void;
    className?: string;
    glitchType?: GlitchType;
}

/**
 * CyberSlotCard - 赛博朋克义体插槽风格卡片
 * Redesigned as "Game Cartridge" / "Skill Chip"
 */
export const CyberSlotCard = ({
    title,
    subtitle,
    inactiveImage,
    activeImage,
    onClick,
    className,
    glitchType = 'standard',
}: CyberSlotCardProps) => {
    const { playHover, playClick } = useSoundSystem();
    const [scanProgress, setScanProgress] = useState(0);
    const animationRef = useRef<number | null>(null);

    const startScan = useCallback(() => {
        if (animationRef.current || scanProgress === 100) return;

        const duration = 400;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            setScanProgress(progress);

            if (progress < 100) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                animationRef.current = null;
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    }, [scanProgress]);

    const handleMouseEnter = () => {
        playHover();
        startScan();
    };

    const handleMouseLeave = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        setScanProgress(0);
    };

    const handleClick = () => {
        playClick();
        onClick?.();
    };

    const isScanComplete = scanProgress === 100;
    // Header activates early during the scan (20%)
    const isHeaderActive = scanProgress > 20;

    // Map glitch type to animation class
    const getGlitchClass = (type: GlitchType) => {
        switch (type) {
            case 'heavy':
            case 'rgb':
            case 'slice':
            case 'vertical':
            case 'subtle':
            case 'standard': default: return "animate-[cyberGlitch_4s_ease-in-out_infinite]";
        }
    };

    return (
        <ChamferFrame
            className={twMerge("cursor-pointer group", className)}
            isActive={isScanComplete}
            chamferSize={16}
            bgClassName="bg-black/90"
        >
            <div
                className="h-full w-full flex flex-row"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            >
                {/* 1. 左侧侧边：元数据 (Meta) */}
                <div className="w-auto shrink-0 border-r border-[var(--color-brand-primary)]/30 bg-[var(--color-bg-deep)]/50 flex flex-col items-center justify-between py-2 px-[2px] text-[var(--color-text-dim)]">
                    <div className="[writing-mode:vertical-rl] rotate-180 text-[0.6rem] font-mono tracking-widest opacity-60 whitespace-nowrap">
                        VER. 2.0
                    </div>
                    <div className={twMerge(
                        "[writing-mode:vertical-rl] rotate-180 text-[0.6rem] font-mono font-bold tracking-widest transition-colors duration-200 whitespace-nowrap",
                        isScanComplete ? "text-[var(--color-brand-secondary)] drop-shadow-[0_0_5px_var(--color-brand-secondary)]" : "opacity-40"
                    )}>
                        [ ACCESS: {isScanComplete ? 'GRANTED' : 'WAITING'} ]
                    </div>
                    <div className="w-1 h-1 bg-current rounded-full opacity-40"></div>
                </div>

                {/* Main Content Column */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* 2. 上部：数据标签 (Data Label) */}
                    <div className={twMerge(
                        "h-[15%] min-h-[40px] border-b border-[var(--color-brand-primary)]/30 flex items-center justify-center relative overflow-hidden transition-colors duration-300",
                        isHeaderActive ? "bg-[var(--color-brand-primary)]/20" : "bg-[var(--color-bg-surface)]"
                    )}>
                        {/* 装饰性的小细线 */}
                        <div className="absolute left-0 top-0 h-full w-[2px] bg-[var(--color-brand-primary)]/20" />

                        <h3 className={twMerge(
                            "font-display text-base lg:text-sm xl:text-base 2xl:text-lg font-bold tracking-widest uppercase transition-all duration-300 z-10",
                            isHeaderActive ? "text-[var(--color-text-accent)] drop-shadow-[0_0_8px_var(--color-brand-glow)]" : "text-[var(--color-text-brand)]"
                        )}>
                            {title}
                        </h3>
                    </div>

                    {/* 3. 下部：全息视窗 (Holo-Viewport) */}
                    <div className="flex-1 relative overflow-hidden bg-black/60">
                        {/* Inactive 背景层 */}
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 mix-blend-screen"
                            style={{ backgroundImage: `url('${inactiveImage}')` }}
                        />

                        {/* Active 背景层 - 跟随扫描线揭示 + 通电后 glitch 效果 */}
                        <div
                            className={twMerge(
                                "absolute inset-0 bg-cover bg-center bg-no-repeat",
                                isScanComplete && getGlitchClass(glitchType)
                            )}
                            style={{
                                backgroundImage: `url('${activeImage}')`,
                                clipPath: `polygon(0 0, 100% 0, 100% ${scanProgress}%, 0 ${scanProgress}%)`,
                            }}
                        />

                        {/* Subtitle / Caption Layer */}
                        {subtitle && (
                            <div className={twMerge(
                                "absolute bottom-0 right-0 p-2 pr-4 z-20 text-[0.6rem] font-mono tracking-widest text-right transition-all duration-300",
                                isScanComplete ? "opacity-100 translate-y-0 text-[var(--color-brand-primary)]" : "opacity-0 translate-y-2 text-white/50"
                            )}>
                                <span className="bg-black/50 px-1 backdrop-blur-sm border-l-2 border-[var(--color-brand-primary)]">
                                    {subtitle}
                                </span>
                            </div>
                        )}

                        {/* 像素网格背景 - 覆盖在图像之上，作为全息纹理 */}
                        <PixelGridEffect active={isScanComplete} />

                        {/* PCB Traces Effect - Underlay texture that lights up on hover */}
                        <PCBTraceEffect
                            active={isScanComplete}
                            scanProgress={scanProgress}
                            className="z-0 mix-blend-screen opacity-60"
                        />

                        {/* 扫描线 */}
                        {scanProgress > 0 && scanProgress < 100 && (
                            <div
                                className="absolute inset-x-0 h-[2px] bg-[var(--color-brand-secondary)] shadow-[0_0_15px_var(--color-brand-glow)] pointer-events-none z-10"
                                style={{ top: `${scanProgress}%` }}
                            />
                        )}

                        {/* Viewport Corners overlay for "Tech" feel */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" xmlns="http://www.w3.org/2000/svg">
                            <path d="M 0 0 L 10 0 L 0 10 Z" fill="var(--color-brand-primary)" />
                            <path d="M 100% 100% L calc(100% - 10px) 100% L 100% calc(100% - 10px) Z" fill="var(--color-brand-primary)" />
                        </svg>
                    </div>
                </div>
            </div>
        </ChamferFrame>
    );
};
