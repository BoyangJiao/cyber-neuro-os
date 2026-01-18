import { useState, useRef, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { useSoundSystem } from '../../hooks/useSoundSystem';

export interface CyberSlotCardProps {
    title: string;
    inactiveImage: string;
    activeImage: string;
    onClick?: () => void;
    className?: string;
}

/**
 * CyberSlotCard - 赛博朋克义体插槽风格卡片
 * 
 * 特性:
 * - 单切角边框（右下角）
 * - 透明背景
 * - 扫描线揭示背景变化
 * - Hover 时显示像素网格背景（与 FeatureCard 一致）
 */
export const CyberSlotCard = ({
    title,
    inactiveImage,
    activeImage,
    onClick,
    className,
}: CyberSlotCardProps) => {
    const { playHover, playClick } = useSoundSystem();
    const [scanProgress, setScanProgress] = useState(0);
    const animationRef = useRef<number | null>(null);

    // 单切角 clip-path（仅右下角）
    const chamferSize = 16;
    const clipPath = `polygon(
        0 0,
        100% 0,
        100% calc(100% - ${chamferSize}px),
        calc(100% - ${chamferSize}px) 100%,
        0 100%
    )`;

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

    const isActive = scanProgress === 100;

    return (
        <div
            className={twMerge(
                "relative h-full cursor-pointer group",
                className
            )}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {/* 切角边框容器 - 使用框架技术：外层填充+内层透明 */}
            <div
                className="absolute inset-0"
                style={{ clipPath }}
            >
                {/* 边框填充层 */}
                <div
                    className={twMerge(
                        "absolute inset-0 transition-colors duration-300",
                        isActive
                            ? "bg-[var(--color-brand-primary)]"
                            : "bg-[var(--color-brand-primary)]/30"
                    )}
                />

                {/* 内容容器 - 内缩形成边框 */}
                <div
                    className="absolute inset-[1px] overflow-hidden bg-black"
                    style={{ clipPath }}
                >
                    {/* Inactive 背景层 */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${inactiveImage})` }}
                    />

                    {/* Active 背景层 - 跟随扫描线揭示 + 通电后 glitch 效果 */}
                    <div
                        className={twMerge(
                            "absolute inset-0 bg-cover bg-center bg-no-repeat",
                            isActive && "animate-[cyberGlitch_4s_ease-in-out_infinite]"
                        )}
                        style={{
                            backgroundImage: `url(${activeImage})`,
                            clipPath: `polygon(0 0, 100% 0, 100% ${scanProgress}%, 0 ${scanProgress}%)`,
                        }}
                    />

                    {/* 像素网格背景 - 扫描完成后显示（与 FeatureCard 一致） */}
                    <div
                        className={twMerge(
                            "absolute inset-0 transition-opacity duration-300",
                            "bg-[linear-gradient(to_bottom,var(--color-brand-dim)_80%,transparent)]",
                            "[mask-image:conic-gradient(from_0deg_at_3px_3px,transparent_270deg,black_270deg)]",
                            "[mask-size:4px_4px]",
                            isActive ? "opacity-100" : "opacity-0"
                        )}
                    />

                    {/* 扫描线 */}
                    {scanProgress > 0 && scanProgress < 100 && (
                        <div
                            className="absolute inset-x-0 h-[2px] bg-[var(--color-brand-secondary)] shadow-[0_0_15px_var(--color-brand-glow)] pointer-events-none z-10"
                            style={{ top: `${scanProgress}%` }}
                        />
                    )}
                </div>
            </div>

            {/* 标题层 */}
            <div className="relative z-10 h-full flex flex-col p-8">
                <div
                    className={twMerge(
                        "font-display text-lg lg:text-xl 2xl:text-2xl font-bold tracking-wider text-center uppercase leading-none transition-colors duration-300",
                        isActive ? "text-[var(--color-brand-secondary)]" : "text-[var(--color-text-secondary)]"
                    )}
                >
                    {title}
                </div>
            </div>
        </div>
    );
};
