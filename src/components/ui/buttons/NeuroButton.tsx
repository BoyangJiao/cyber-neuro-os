import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useSoundSystem } from '../../../hooks/useSoundSystem';
import { ButtonLoadingIndicator } from './ButtonLoadingIndicator';

export interface NeuroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    loading?: boolean;
    iconOnly?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showGhost?: boolean;
    ghostOffset?: string;
}

const FrameDot = ({
    isHovered,
    isPressed,
    isGhost = false,
    ghostOffset = "translate-x-[4px] translate-y-[3px]"
}: {
    isHovered: boolean,
    isPressed: boolean,
    isGhost?: boolean,
    ghostOffset?: string
}) => {
    // 3. Pressing State: Dots scale to 4px (2x scale from 2px base) and glow
    const dotBaseClass = twMerge(
        "absolute w-[2px] h-[2px] bg-[var(--color-brand-primary)] z-20 transition-all duration-200",
        isGhost && "opacity-40 blur-[1px]"
    );
    const dotPressedClass = isPressed ? "scale-[2.0] shadow-[0_0_8px_2px_var(--color-brand-glow)]" : "";

    return (
        <div className={twMerge(
            "absolute inset-0 pointer-events-none",
            isGhost && ghostOffset
        )}>

            {/* Background Fill - Center expanding */}
            <div
                className={twMerge(
                    "absolute left-1/2 top-1/2 bg-[var(--color-brand-primary)]/70 z-0 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out",
                    isHovered ? 'h-full w-[calc(100%-2px)] opacity-100' : 'h-0 w-[calc(100%-2px)] opacity-0',
                    isGhost && "opacity-30 blur-[2px]"
                )}
            />

            {/* Hover Pattern: Pixel Pattern (Solid Squares) - Matches FeatureCard */}
            <div className={twMerge(
                "absolute inset-0 z-1 opacity-0 transition-opacity duration-300 pointer-events-none",
                isHovered && "opacity-100",
                "bg-[radial-gradient(color-mix(in_srgb,var(--color-brand-secondary),transparent_60%)_1px,transparent_1px)] [background-size:4px_4px]",
                isGhost && "opacity-0" // Hide pattern on ghost
            )} />


            {/* Dots */}
            <div className={`${dotBaseClass} top-0 left-0 ${dotPressedClass}`} />
            <div className={`${dotBaseClass} top-0 right-0 ${dotPressedClass}`} />
            <div className={`${dotBaseClass} bottom-0 left-0 ${dotPressedClass}`} />
            <div className={`${dotBaseClass} bottom-0 right-0 ${dotPressedClass}`} />
        </div>
    );
};

export const NeuroButton = ({
    children,
    className,
    size = 'md',
    icon,
    loading,
    disabled,
    iconOnly,
    showGhost = false,
    ghostOffset,
    ...props
}: NeuroButtonProps) => {
    const { playHover, playClick } = useSoundSystem();
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const baseStyles = "relative inline-flex items-center justify-center font-sans font-bold uppercase tracking-widest transition-all duration-300 group outline-none select-none z-0 tracking-[0.2em]";

    // 1. Hover Text Inversion: White Hover (Signal) on System BG
    const textColorClass = isHovered
        ? "text-[var(--color-text-accent)]"
        : "text-[var(--color-text-brand)]";

    const sizeStyles = {
        sm: iconOnly ? "px-2 h-8 text-xs" : "px-2 h-8 text-xs",
        md: iconOnly ? "px-4 h-10 text-sm" : "px-4 h-10 text-sm min-w-[120px]",
        lg: iconOnly ? "px-6 h-11 text-base" : "px-6 h-11 text-base min-w-[160px]",
    };

    const mergedClasses = twMerge(
        baseStyles,
        sizeStyles[size],
        textColorClass,
        disabled && "opacity-50 cursor-not-allowed grayscale pointer-events-none",
        className
    );

    return (
        <button
            className={mergedClasses}
            onMouseEnter={(e) => {
                setIsHovered(true);
                playHover();
                props.onMouseEnter?.(e);
            }}
            onMouseLeave={(e) => {
                setIsHovered(false);
                setIsPressed(false);
                props.onMouseLeave?.(e);
            }}
            onMouseDown={(e) => {
                if (!disabled) setIsPressed(true);
                props.onMouseDown?.(e);
            }}
            onMouseUp={(e) => {
                setIsPressed(false);
                props.onMouseUp?.(e);
            }}
            onClick={(e) => {
                playClick();
                props.onClick?.(e);
            }}
            disabled={disabled || loading}
            {...props}
        >
            {showGhost && <FrameDot isHovered={isHovered} isPressed={isPressed} isGhost={true} ghostOffset={ghostOffset} />}
            <FrameDot isHovered={isHovered} isPressed={isPressed} />

            <div className="relative z-10 w-full h-full flex items-center justify-center">
                {/* Primary Children Layer */}
                <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                        <ButtonLoadingIndicator />
                    ) : (
                        <>
                            {icon && <span className="text-2xl opacity-80 group-hover:opacity-100 transition-opacity">{icon}</span>}
                            {children}
                        </>
                    )}
                </span>

                {/* Ghost Children Layer - Automatically synced with FrameDot */}
                {showGhost && !loading && (
                    <span
                        className={twMerge(
                            "absolute inset-0 z-0 flex items-center justify-center gap-2 opacity-40 blur-[1px] select-none pointer-events-none whitespace-nowrap",
                            ghostOffset || "translate-x-[4px] translate-y-[3px]"
                        )}
                        aria-hidden="true"
                    >
                        {icon && <span className="text-2xl">{icon}</span>}
                        {children}
                    </span>
                )}
            </div>
        </button>
    );
};
