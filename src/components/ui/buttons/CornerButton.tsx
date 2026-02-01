import React, { useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { useSoundSystem } from '../../../hooks/useSoundSystem';
import { ButtonLoadingIndicator } from './ButtonLoadingIndicator';

export interface CornerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    loading?: boolean;
    iconOnly?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const FrameCorners = ({
    isHovered,
    isPressed = false,
    proximityOpacity = 0,
    mousePos = { x: 50, y: 50 }
}: {
    isHovered: boolean,
    isPressed?: boolean,
    proximityOpacity?: number,
    mousePos?: { x: number, y: number }
}) => {
    const color = isHovered
        ? 'var(--color-brand-primary)'
        : 'var(--color-border-default)';
    const glowClass = isHovered ? (isPressed ? 'drop-shadow-[0_0_5px_var(--color-brand-primary)]' : 'drop-shadow-[0_0_3px_var(--color-brand-glow)]') : '';

    const bgStyle = isHovered
        ? { backgroundColor: isPressed ? 'color-mix(in srgb, var(--color-brand-primary) 50%, transparent)' : 'color-mix(in srgb, var(--color-brand-primary) 40%, transparent)' }
        : {
            backgroundImage: `radial-gradient(circle 200px at ${mousePos.x}% ${mousePos.y}%, color-mix(in srgb, var(--color-brand-primary) ${proximityOpacity * 40}%, transparent) 0%, transparent 100%)`,
        };

    return (
        <div className="absolute inset-0 pointer-events-none transition-all duration-300">
            {/* Top Left */}
            <svg className={`absolute top-0 left-0 w-3 h-3 transition-opacity duration-100 ${glowClass}`} viewBox="0 0 12 12" fill="none">
                <path d="M1 12V1H12" stroke={color} strokeWidth={2} />
            </svg>
            {/* Top Right */}
            <svg className={`absolute top-0 right-0 w-3 h-3 transition-opacity duration-100 ${glowClass}`} viewBox="0 0 12 12" fill="none">
                <path d="M12 12V1H1" stroke={color} strokeWidth={2} />
            </svg>
            {/* Bottom Left */}
            <svg className={`absolute bottom-0 left-0 w-3 h-3 transition-opacity duration-100 ${glowClass}`} viewBox="0 0 12 12" fill="none">
                <path d="M1 0V11H12" stroke={color} strokeWidth={2} />
            </svg>
            {/* Bottom Right */}
            <svg className={`absolute bottom-0 right-0 w-3 h-3 transition-opacity duration-100 ${glowClass}`} viewBox="0 0 12 12" fill="none">
                <path d="M12 0V11H1" stroke={color} strokeWidth={2} />
            </svg>

            <div
                className={twMerge(
                    "absolute inset-1 transition-all duration-300",
                    isPressed && "scale-[0.98] origin-center"
                )}
                style={{
                    ...bgStyle,
                    opacity: isHovered ? 1 : (proximityOpacity > 0.005 ? 1 : 0)
                }}
            />
        </div>
    );
};

export const CornerButton = ({
    children,
    className,
    size = 'md',
    icon,
    loading,
    disabled,
    iconOnly,
    ...props
}: CornerButtonProps) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { playHover, playClick } = useSoundSystem();
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [proximityOpacity, setProximityOpacity] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    useEffect(() => {
        if (disabled || loading) return;

        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!buttonRef.current) return;

            const rect = buttonRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dist = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
            const range = 400;

            if (dist < range) {
                const relX = ((e.clientX - rect.left) / rect.width) * 100;
                const relY = ((e.clientY - rect.top) / rect.height) * 100;
                setMousePos({ x: relX, y: relY });

                const isInside = e.clientX >= rect.left && e.clientX <= rect.right &&
                    e.clientY >= rect.top && e.clientY <= rect.bottom;

                if (isInside) {
                    setProximityOpacity(1);
                } else {
                    const opacity = 1 - (dist / range);
                    setProximityOpacity(Math.pow(opacity, 1.5));
                }
            } else {
                setProximityOpacity(0);
            }
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
    }, [disabled, loading]);

    const baseStyles = "relative inline-flex items-center justify-center font-sans font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 group outline-none select-none z-0 text-[var(--color-text-brand)] hover:text-[var(--color-text-accent)]";

    const sizeStyles = {
        sm: iconOnly ? "px-2 h-8 text-xs" : "px-2 h-8 text-xs",
        md: iconOnly ? "px-4 h-10 text-sm" : "px-4 h-10 text-sm min-w-[120px]",
        lg: iconOnly ? "px-6 h-11 text-base" : "px-6 h-11 text-base min-w-[160px]",
    };

    const mergedClasses = twMerge(
        baseStyles,
        sizeStyles[size],
        disabled && "opacity-50 cursor-not-allowed grayscale pointer-events-none",
        className
    );

    return (
        <button
            ref={buttonRef}
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
            <FrameCorners isHovered={isHovered} isPressed={isPressed} proximityOpacity={proximityOpacity} mousePos={mousePos} />

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
