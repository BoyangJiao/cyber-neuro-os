import { twMerge } from 'tailwind-merge';
import { useEffect, useState, useRef } from 'react';

export type ScanlineVariant = 'flash' | 'loop';

export interface ScanlineEffectProps {
    /** 
     * 变体类型：
     * - flash: 0.3秒一次性快闪，适用于 hover/按压态的激活反馈
     * - loop: 3秒无限循环平移扫描，仅用于 HolographicAvatar
     */
    variant?: ScanlineVariant;
    /** 是否显示/激活扫描线 */
    active?: boolean;
    /** 自定义颜色（默认使用主题色） */
    color?: string;
    /** 自定义发光颜色（默认使用主题 glow） */
    glowColor?: string;
    /** 额外的 className */
    className?: string;
}

/**
 * ScanlineEffect - 统一扫描线效果组件
 * 
 * 封装了两种标准扫描线动效：
 * 1. flash: 0.3秒一次性快闪（交互反馈），动画结束后自动隐藏
 * 2. loop: 3秒无限循环（全息氛围）
 * 
 * 样式统一：水平渐变线 + 发光阴影
 */
export const ScanlineEffect = ({
    variant = 'flash',
    active = false,
    color,
    glowColor,
    className,
}: ScanlineEffectProps) => {
    const lineRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [wasActive, setWasActive] = useState(false);

    // 颜色配置
    const lineColor = color || 'var(--color-brand-secondary)';
    const shadowColor = glowColor || 'var(--color-brand-glow)';

    // Flash 变体：检测 active 从 false -> true 的变化来触发动画
    useEffect(() => {
        if (variant === 'flash') {
            if (active && !wasActive) {
                // 触发新的动画
                setIsAnimating(true);
            } else if (!active) {
                // 退出 hover 时重置状态，准备下次触发
                setIsAnimating(false);
            }
            setWasActive(active);
        }
    }, [active, wasActive, variant]);

    // 监听动画结束事件（仅 flash 变体）
    const handleAnimationEnd = () => {
        if (variant === 'flash') {
            setIsAnimating(false);
        }
    };

    // Loop 变体：直接跟随 active 状态
    const shouldShow = variant === 'loop' ? active : isAnimating;

    // 动画类配置
    const animationClass = variant === 'flash'
        ? 'animate-[scanline_0.3s_linear_forwards]'
        : 'animate-[holoScanline_3s_linear_infinite]';

    return (
        <div
            ref={lineRef}
            className={twMerge(
                "absolute inset-x-0 h-[2px] pointer-events-none transition-opacity duration-100",
                shouldShow ? `${animationClass} opacity-100` : "opacity-0",
                className
            )}
            style={{
                background: `linear-gradient(to right, transparent, ${lineColor}, transparent)`,
                boxShadow: `0 0 15px ${shadowColor}`,
            }}
            onAnimationEnd={handleAnimationEnd}
        />
    );
};

