import { type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface GhostTextProps {
    children: ReactNode;
    /** Additional classes for the main text */
    className?: string;
    /** Ghost layer opacity (0-1), default 0.4 */
    ghostOpacity?: number;
    /** Ghost blur amount, default 1px */
    ghostBlur?: string;
    /** Ghost offset position, default bottom-right */
    ghostOffset?: string;
    /** Whether to render as inline-block (default) or block */
    block?: boolean;
    /** HTML tag to use, defaults to span */
    as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'p';
}

/**
 * GhostText - Cyberpunk ghost/afterimage text effect
 * 
 * Renders text with a blurred, offset "ghost" layer behind it
 * for a holographic/glitch aesthetic.
 * 
 * @example
 * <GhostText className="text-lg text-brand-primary font-bold">
 *   NEURAL LINK
 * </GhostText>
 */
export const GhostText = ({
    children,
    className = '',
    ghostOpacity = 0.4,
    ghostBlur = '1px',
    ghostOffset = 'bottom-[2px] right-[3px]',
    block = false,
    as: Tag = 'span',
}: GhostTextProps) => {
    const containerClass = block ? 'relative block' : 'relative inline-block';

    return (
        <Tag className={twMerge(containerClass, 'w-max')}>
            {/* Main visible text layer */}
            <span className={twMerge('relative z-10', className)}>
                {children}
            </span>

            {/* Ghost / Afterimage layer */}
            <span
                className={twMerge(
                    'absolute select-none pointer-events-none whitespace-nowrap',
                    ghostOffset,
                    className
                )}
                style={{
                    opacity: ghostOpacity,
                    filter: `blur(${ghostBlur})`,
                }}
                aria-hidden="true"
            >
                {children}
            </span>
        </Tag>
    );
};
