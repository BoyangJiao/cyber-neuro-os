import { type ReactNode, useRef, useEffect, type CSSProperties, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import gsap from 'gsap';
import { ScanlineEffect, PixelGridEffect } from '../effects';

export interface ChamferFrameProps {
    children?: ReactNode;
    className?: string;
    /** Size of the chamfer cut in pixels */
    chamferSize?: number;
    /** Whether to animate the frame on mount */
    animate?: boolean;
    /** Whether the frame is in active/selected state */
    isActive?: boolean;
    /** Whether to show scanline and pixel grid effects (default: true) */
    showEffects?: boolean;
    /** Custom background class for the inner area */
    bgClassName?: string;
    /** Whether to disable hover effects and state changes (default: false) */
    disableHover?: boolean;
}

/**
 * ChamferFrame - Single bottom-right chamfer frame with simple border
 * Isolated hover state (triggered only when hovered directly)
 * Includes scanline and grid effects
 */
export const ChamferFrame = ({
    children,
    className,
    chamferSize = 12,
    animate = true,
    isActive = false,
    showEffects = true,
    bgClassName,
    disableHover = false,
}: ChamferFrameProps) => {
    const borderRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Single chamfer clip-path (bottom-right corner only)
    const clipPath = `polygon(
        0 0,
        100% 0,
        100% calc(100% - ${chamferSize}px),
        calc(100% - ${chamferSize}px) 100%,
        0 100%
    )`;

    const frameStyles = {
        '--frame-color': 'var(--color-brand-primary)',
        '--frame-deco-color': 'var(--color-brand-secondary)',
    } as CSSProperties;

    // Entry animation using GSAP
    useEffect(() => {
        if (!animate) return;
        const border = borderRef.current;
        if (!border) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(border,
                { opacity: 0 },
                { opacity: 1, duration: 0.4, ease: 'power2.out' }
            );
        });
        return () => ctx.revert();
    }, [animate, chamferSize]);

    return (
        <div
            className={twMerge("relative h-full w-full overflow-hidden", className)}
            style={frameStyles}
            onMouseEnter={() => !disableHover && setIsHovered(true)}
            onMouseLeave={() => !disableHover && setIsHovered(false)}
        >
            {/* Border Layer */}
            <div
                className="absolute inset-0 z-0"
                style={{ clipPath }}
            >
                {/* Border fill layer - this color determines the border color */}
                <div
                    ref={borderRef}
                    className={twMerge(
                        "absolute inset-0 transition-all duration-300",
                        (isActive || isHovered)
                            ? "bg-[var(--frame-color)] shadow-[0_0_15px_var(--color-brand-glow)]"
                            : "bg-[var(--color-brand-primary)]/30" // Brand-tinted border for default state
                    )}
                />

                {/* Inner background foundation - ensures border contrast by clearing the area */}
                <div
                    className="absolute inset-[1px] bg-[var(--color-bg-app)]"
                    style={{ clipPath }}
                />

                {/* Custom inner background - applied on top of the clean foundation */}
                <div
                    className={twMerge(
                        "absolute inset-[1px] transition-colors duration-300",
                        bgClassName
                    )}
                    style={{ clipPath }}
                />
            </div>

            {/* Effects Layer (Hover Grid + Scanline) - conditionally rendered */}
            {showEffects && (
                <div
                    className="absolute inset-[1px] z-30 pointer-events-none overflow-hidden"
                    style={{ clipPath }}
                >
                    {/* Pixel Grid Background */}
                    <PixelGridEffect active={isActive || isHovered} />

                    {/* Scanline Effect - Flash variant for hover feedback */}
                    <ScanlineEffect
                        variant="flash"
                        active={isActive || isHovered}
                    />
                </div>
            )}

            {/* Content Layer - Inset by 1px to show border */}
            <div
                className="relative z-20 h-full w-full inset-[1px] flex flex-col overflow-hidden"
                style={{
                    clipPath,
                    width: 'calc(100% - 2px)',
                    height: 'calc(100% - 2px)'
                }}
            >
                {children}
            </div>
        </div>
    );
};

