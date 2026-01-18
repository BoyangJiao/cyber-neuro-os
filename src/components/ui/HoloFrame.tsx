import { type ReactNode, type CSSProperties, type HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { CornerFrame } from './frames/CornerFrame';
import { ChamferFrame } from './frames/ChamferFrame';
import { DotsFrame } from './frames/DotsFrame';
import { LinesFrame } from './frames/LinesFrame';

export interface HoloFrameProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    className?: string;
    variant?: 'corner' | 'lines' | 'chamfer' | 'dots';
    filled?: boolean;
    background?: ReactNode;
    active?: boolean;
    showAtmosphere?: boolean;
    showMask?: boolean;
    showGhost?: boolean;
    ghostOffset?: string;
    // For Corner variant interactions
    isPressed?: boolean;
}

export const HoloFrame = ({
    children,
    className,
    variant = 'corner',
    filled = false,
    background,
    active,
    showAtmosphere = false,
    showMask = false,
    showGhost = false,
    ghostOffset = "-translate-x-[3px] -translate-y-[2px]",
    isPressed = false,
    ...props
}: HoloFrameProps) => {

    // Theme styles for frame customization
    const frameStyles = {
        '--frame-bg-color': filled ? 'var(--color-bg-panel)' : 'transparent',
        '--frame-line-color': 'var(--color-brand-primary)',
        '--frame-deco-color': 'var(--color-brand-secondary)',
    } as CSSProperties;

    // Helper to render the specific frame component
    const renderFrame = (isGhost = false) => {
        const extraClass = isGhost
            ? twMerge("absolute inset-0 opacity-40 blur-[1px] pointer-events-none", ghostOffset)
            : "h-full w-full";

        switch (variant) {
            case 'corner':
                return (
                    <div className={extraClass}>
                        <CornerFrame
                            isActive={active}
                            isPressed={isPressed}
                            className={!isGhost ? "opacity-50 group-hover:opacity-100 transition-opacity duration-300" : ""}
                        />
                    </div>
                );
            case 'lines':
                return <div className={extraClass}><LinesFrame /></div>;
            case 'dots':
                return <div className={extraClass}><DotsFrame /></div>;
            case 'chamfer':
                return <div className={extraClass}><ChamferFrame /></div>;
            default:
                return null;
        }
    };

    return (
        <div
            className={twMerge(
                "relative p-8 transition-all duration-300 group",
                className
            )}
            style={frameStyles}
            {...props}
        >
            {/* 1. MASKED DECORATION LAYER (Atmosphere + Borders) */}
            <div className={twMerge(
                "absolute inset-0 pointer-events-none z-0",
                showMask && "cyber-mask-h"
            )}>
                {/* Custom Background */}
                <div className="absolute inset-0 z-0">
                    {background}
                </div>

                {/* Atmosphere Glow */}
                {showAtmosphere && (
                    <div className="absolute inset-0 cyber-glow z-1" />
                )}

                {/* Frame Decorative Lines (Purely visual here) */}
                <div className="absolute inset-0 z-2">
                    {showGhost && renderFrame(true)}
                    {renderFrame(false)}
                </div>
            </div>

            {/* 2. CONTENT LAYER (Unmasked) */}
            <div className="relative z-10 h-full flex flex-col">
                {/* Primary Content */}
                <div className="relative z-10 h-full flex flex-col">
                    {children}
                </div>

                {/* Ghost Content Overlay - Sycned with frame ghost */}
                {showGhost && (
                    <div className={twMerge(
                        "absolute inset-0 z-0 opacity-40 blur-[1px] select-none pointer-events-none flex flex-col",
                        ghostOffset
                    )} aria-hidden="true">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};
