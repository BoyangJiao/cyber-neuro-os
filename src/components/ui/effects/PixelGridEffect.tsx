import { twMerge } from 'tailwind-merge';

export interface PixelGridEffectProps {
    /** 是否显示/激活网格效果 */
    active?: boolean;
    /** 网格点间距（像素），默认 4px */
    gridSize?: number;
    /** 网格点大小（像素），默认 3px */
    dotSize?: number;
    /** 渐变颜色（默认使用主题 dim 色） */
    color?: string;
    /** 额外的 className */
    className?: string;
}

/**
 * PixelGridEffect - 统一像素网格背景效果组件
 * 
 * 创建赛博朋克风格的像素点阵背景，通常配合 hover 状态使用。
 * 使用 CSS mask 实现高性能渲染。
 * 
 * 样式统一：
 * - 渐变背景：从上到下，80% 处开始淡出
 * - 网格遮罩：conic-gradient 创建点阵效果
 * - 默认 4px 间距，3px 点大小
 */
export const PixelGridEffect = ({
    active = false,
    gridSize = 4,
    dotSize = 3,
    color,
    className,
}: PixelGridEffectProps) => {
    const gradientColor = color || 'var(--color-brand-dim)';

    return (
        <div
            className={twMerge(
                "absolute inset-0 pointer-events-none transition-opacity duration-500",
                active ? "opacity-100" : "opacity-0",
                className
            )}
            style={{
                background: `linear-gradient(to bottom, ${gradientColor} 80%, transparent)`,
                maskImage: `conic-gradient(from 0deg at ${dotSize}px ${dotSize}px, transparent 270deg, black 270deg)`,
                WebkitMaskImage: `conic-gradient(from 0deg at ${dotSize}px ${dotSize}px, transparent 270deg, black 270deg)`,
                maskSize: `${gridSize}px ${gridSize}px`,
                WebkitMaskSize: `${gridSize}px ${gridSize}px`,
            }}
        />
    );
};
