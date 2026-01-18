import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useSoundSystem } from '../../../hooks/useSoundSystem';
import { ButtonLoadingIndicator } from './ButtonLoadingIndicator';

export interface GhostButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    loading?: boolean;
    iconOnly?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const GhostButton = ({
    children,
    className,
    size = 'md',
    icon,
    loading,
    disabled,
    iconOnly,
    ...props
}: GhostButtonProps) => {
    const { playHover, playClick } = useSoundSystem();
    const [isPressed, setIsPressed] = useState(false);

    const baseStyles = "relative inline-flex items-center justify-center font-sans font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 group outline-none select-none z-0";
    const variantStyles = "text-brand-primary hover:text-brand-secondary active:text-brand-secondary bg-transparent hover:scale-[1.15] active:scale-100 transition-all duration-200 hover:animate-[glitchGhost_0.3s_ease-in-out]";

    const sizeStyles = {
        sm: iconOnly ? "px-2 h-8 text-xs" : "px-2 h-8 text-xs",
        md: iconOnly ? "px-4 h-10 text-sm" : "px-4 h-10 text-sm min-w-[120px]",
        lg: iconOnly ? "px-6 h-11 text-base" : "px-6 h-11 text-base min-w-[160px]",
    };

    const mergedClasses = twMerge(
        baseStyles,
        sizeStyles[size],
        variantStyles,
        isPressed && "scale-[0.97]",
        disabled && "opacity-50 cursor-not-allowed grayscale pointer-events-none",
        className
    );

    return (
        <button
            className={mergedClasses}
            onMouseEnter={(e) => {
                playHover();
                props.onMouseEnter?.(e);
            }}
            onMouseLeave={(e) => {
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
        </button>
    );
};
