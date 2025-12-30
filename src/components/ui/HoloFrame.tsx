import { type ReactNode, type CSSProperties } from 'react';
import { twMerge } from 'tailwind-merge';
import {
    Animator,
    FrameCorners,
    FrameLines,
    FrameNefrex
} from '@arwes/react';

export interface HoloFrameProps {
    children: ReactNode;
    className?: string;
    variant?: 'corner' | 'lines' | 'outline';
    filled?: boolean;
    // Legacy: chamferCorner was planned for custom chamfer positioning, moved to legacy consideration
}

export const HoloFrame = ({
    children,
    className,
    variant = 'corner',
    filled = false
}: HoloFrameProps) => {
    // Official Arwes frames use CSS variables for customization
    // We map our theme colors to Arwes tokens
    const arwesThemeStyles = {
        '--arwes-frames-bg-color': filled ? 'rgba(6, 18, 26, 1)' : 'rgba(6, 18, 26, 0)',
        '--arwes-frames-line-color': 'rgba(0, 240, 255, 0.5)',
        '--arwes-frames-deco-color': 'rgba(0, 240, 255, 0.8)',
    } as CSSProperties;

    return (
        <Animator>
            <div
                className={twMerge("relative p-8 transition-all duration-300 group", className)}
                style={arwesThemeStyles}
            >
                {/* Frame Layer */}
                <div className="absolute inset-0 z-0">
                    {variant === 'corner' && (
                        <FrameCorners
                            padding={0}
                            strokeWidth={1}
                        />
                    )}
                    {variant === 'lines' && (
                        <FrameLines
                            padding={0}
                            largeLineWidth={1}
                            smallLineWidth={1}
                        />
                    )}
                    {variant === 'outline' && (
                        <FrameNefrex
                            padding={0}
                            strokeWidth={1}
                        />
                    )}
                </div>

                {/* Content Layer */}
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </Animator>
    );
};
