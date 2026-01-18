import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useSoundSystem } from '../../../hooks/useSoundSystem';
import { ButtonLoadingIndicator } from './ButtonLoadingIndicator';
import { getButtonSizeStyles, buttonBaseStyles, buttonDisabledStyles } from './buttonStyles';

export interface ChamferButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    loading?: boolean;
    iconOnly?: boolean;
    size?: 'sm' | 'md' | 'lg';
    corner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const paths = {
    'top-left': 'polygon(0 12px, 12px 0, 100% 0, 100% 100%, 0 100%)',
    'top-right': 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
    'bottom-right': 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
    'bottom-left': 'polygon(0 0, 100% 0, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
};

const FrameChamfer = ({ isHovered, isPressed: _isPressed, corner = 'bottom-right', size = 'md' }: {
    isHovered: boolean,
    isPressed: boolean,
    corner?: ChamferButtonProps['corner'],
    size?: ChamferButtonProps['size']
}) => {
    const borderWidth = size === 'sm' ? 1 : 1;
    const theme = {
        base: 'var(--color-brand-primary)',
        // Darker hover fill: 15% brand color mixed with black for a subtle, deep glow
        fillHover: 'color-mix(in srgb, var(--color-brand-primary) 15%, var(--color-black))',
        glow: 'var(--color-brand-glow)',
    };

    const clipPath = paths[corner] || paths['bottom-right'];

    return (
        <div className={twMerge(
            "absolute inset-0 transition-all duration-300 pointer-events-none",
            isHovered && "filter drop-shadow-[0_0_8px_var(--color-brand-glow)]"
        )}>
            {/* 1. Border Layer (Outer) - Full chamfered shape with brand color */}
            <div
                className="absolute inset-0 transition-colors duration-300"
                style={{ clipPath, backgroundColor: theme.base }}
            />

            {/* 2. Inner Cutout Layer - Creates hollow effect with page background */}
            <div
                className="absolute transition-all duration-300"
                style={{
                    inset: `${borderWidth}px`,
                    clipPath,
                    backgroundColor: isHovered ? theme.fillHover : 'var(--color-bg-app)',
                }}
            >
                {/* Pulse 1 */}
                <div
                    className="absolute inset-y-0 w-[50%] transition-all duration-300 ease-in-out pointer-events-none"
                    style={{
                        transform: isHovered ? 'translateX(200%)' : 'translateX(-100%)',
                        background: 'linear-gradient(to right, transparent, var(--color-brand-glow), transparent)',
                        maskImage: 'repeating-linear-gradient(to bottom, black 0px, black 2px, transparent 2px, transparent 4px)',
                        opacity: isHovered ? 0.7 : 0
                    }}
                />
                {/* Pulse 2 (Delayed) */}
                <div
                    className="absolute inset-y-0 w-[50%] transition-all duration-300 ease-in-out pointer-events-none"
                    style={{
                        transform: isHovered ? 'translateX(200%)' : 'translateX(-100%)',
                        background: 'linear-gradient(to right, transparent, var(--color-brand-glow), transparent)',
                        maskImage: 'repeating-linear-gradient(to bottom, black 0px, black 2px, transparent 2px, transparent 4px)',
                        opacity: isHovered ? 0.7 : 0,
                        transitionDelay: isHovered ? '500ms' : '0ms'
                    }}
                />
            </div>
        </div>
    );
};

export const ChamferButton = ({
    children,
    className,
    size = 'md',
    icon,
    loading,
    disabled,
    iconOnly,
    corner = 'bottom-right',
    ...props
}: ChamferButtonProps) => {
    const { playHover, playClick } = useSoundSystem();
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const textColorClass = isHovered
        ? "text-[var(--color-text-accent)]"
        : "text-[var(--color-text-brand)]";

    const clipPath = paths[corner] || paths['bottom-right'];

    const mergedClasses = twMerge(
        buttonBaseStyles,
        getButtonSizeStyles(size, iconOnly),
        textColorClass,
        isPressed && "scale-[0.97]",
        disabled && buttonDisabledStyles,
        className
    );

    return (
        <button
            className={mergedClasses}
            style={{ clipPath }}
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
            <FrameChamfer isHovered={isHovered} isPressed={isPressed} corner={corner} size={size} />

            <span className="relative z-10 flex items-center gap-2 transition-colors duration-300">
                {loading ? (
                    <ButtonLoadingIndicator />
                ) : (
                    <>
                        {icon && <span className="text-xl opacity-90 group-hover:opacity-100">{icon}</span>}
                        {children}
                    </>
                )}
            </span>
        </button>
    );
};
