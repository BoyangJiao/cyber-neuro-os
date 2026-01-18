import { type ReactNode, useRef, useEffect, type CSSProperties } from 'react';
import { twMerge } from 'tailwind-merge';
import gsap from 'gsap';

export interface ChamferFrameProps {
    children?: ReactNode;
    className?: string;
    /** Size of the chamfer cut in pixels */
    chamferSize?: number;
    /** Whether to animate the frame on mount */
    animate?: boolean;
    /** Whether the frame is in active/selected state */
    isActive?: boolean;
}

/**
 * ChamferFrame - Single bottom-right chamfer frame with simple border
 * Inspired by CyberSlotCard but without scanline/grid effects
 * Replaces Arwes FrameNefrex with a simpler, theme-aware implementation
 */
export const ChamferFrame = ({
    children,
    className,
    chamferSize = 12,
    animate = true,
    isActive = false,
}: ChamferFrameProps) => {
    const borderRef = useRef<HTMLDivElement>(null);

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
            // Border fade in
            gsap.fromTo(border,
                { opacity: 0 },
                { opacity: 1, duration: 0.4, ease: 'power2.out' }
            );
        });

        return () => ctx.revert();
    }, [animate, chamferSize]);

    return (
        <div
            className={twMerge("relative h-full w-full group", className)}
            style={frameStyles}
        >
            {/* Border Layer - uses clip-path technique from CyberSlotCard */}
            <div
                className="absolute inset-0"
                style={{ clipPath }}
            >
                {/* Border fill layer */}
                <div
                    ref={borderRef}
                    className={twMerge(
                        "absolute inset-0 transition-colors duration-300",
                        isActive
                            ? "bg-[var(--frame-color)]"
                            : "bg-[var(--frame-color)]/30 group-hover:bg-[var(--frame-color)]/50"
                    )}
                />

                {/* Inner content container - creates the border by inset */}
                <div
                    className="absolute inset-[1px] bg-[var(--color-bg-app)]"
                    style={{ clipPath }}
                />
            </div>

            {/* Content Layer */}
            <div
                className="relative z-20 h-full w-full flex flex-col"
                style={{ clipPath }}
            >
                {children}
            </div>
        </div>
    );
};
