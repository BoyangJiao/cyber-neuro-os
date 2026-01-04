import React, { type ReactNode, useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { useSoundSystem } from '../../hooks/useSoundSystem';

export interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'corner' | 'chamfer' | 'ghost' | 'dot';
    size?: 'sm' | 'md' | 'lg';
    icon?: ReactNode;
    loading?: boolean;
    chamferCorner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    iconOnly?: boolean;
}

const GlitchText = ({ text }: { text: string }) => {
    return (
        <span className="relative inline-block overflow-hidden" data-text={text}>
            <span className="block">
                {text}
            </span>
            <span className="absolute top-0 left-0 -z-10 opacity-0 group-hover:opacity-50 text-red-500 translate-x-[2px] animate-pulse">
                {text}
            </span>
            <span className="absolute top-0 left-0 -z-10 opacity-0 group-hover:opacity-50 text-cyan-500 -translate-x-[2px] animate-pulse delay-75">
                {text}
            </span>
        </span>
    );
};

// Custom Frame Implementations to replace Arwes dependencies
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
        ? (isPressed ? 'var(--color-cyan-300)' : 'var(--color-cyan-400)')
        : 'var(--color-cyan-800)';
    const glowClass = isHovered ? (isPressed ? 'drop-shadow-[0_0_8px_rgba(0,240,255,1)]' : 'drop-shadow-[0_0_5px_rgba(0,240,255,0.9)]') : '';

    // Hover mode: solid stable background
    // Proximity mode: larger radial spotlight following mouse
    // Pressed mode: even brighter solid background
    const bgStyle = isHovered
        ? { backgroundColor: isPressed ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.25)' }
        : {
            backgroundImage: `radial-gradient(circle 200px at ${mousePos.x}% ${mousePos.y}%, rgba(0, 240, 255, ${proximityOpacity * 0.4}) 0%, transparent 100%)`,
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

            {/* Background Frame - Internal scale only on press to keep corners fixed */}
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

const FrameChamfer = ({ isHovered, isPressed = false, corner = 'bottom-right' }: { isHovered: boolean, isPressed?: boolean, corner?: CyberButtonProps['chamferCorner'] }) => {
    // Colors responsive to hover and press
    const borderColor = isHovered
        ? (isPressed ? 'rgba(0, 240, 255, 0.9)' : 'rgba(0, 240, 255, 0.6)')
        : 'rgba(0, 240, 255, 0.2)';

    const bgColor = isHovered
        ? (isPressed ? 'rgba(0, 240, 255, 0.2)' : 'rgba(6, 18, 30, 0.9)')
        : 'rgba(6, 18, 26, 0.4)';

    const paths = {
        'top-left': 'polygon(0 10px, 10px 0, 100% 0, 100% 100%, 0 100%)',
        'top-right': 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
        'bottom-right': 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
        'bottom-left': 'polygon(0 0, 100% 0, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
    };

    const clipPath = paths[corner] || paths['bottom-right'];

    return (
        <div className="absolute inset-0 transition-all duration-300 pointer-events-none">
            {/* Border Layer */}
            <div
                className="absolute inset-0 transition-all duration-300"
                style={{
                    clipPath: clipPath,
                    backgroundColor: borderColor,
                }}
            />
            {/* Background Layer (simulating 1px border) */}
            <div
                className="absolute inset-[1px] transition-all duration-300"
                style={{
                    clipPath: clipPath,
                    backgroundColor: bgColor,
                }}
            />

            {/* Inner Glow Effect for Hover/Press */}
            <div
                className={twMerge(
                    "absolute inset-0 transition-opacity duration-300 bg-cyan-500/5",
                    isHovered ? 'opacity-100' : 'opacity-0',
                    isPressed && 'bg-cyan-500/20'
                )}
                style={{ clipPath: clipPath }}
            />
        </div>
    );
}

const FrameDot = ({ isHovered, isPressed = false }: { isHovered: boolean, isPressed?: boolean }) => {
    // Death Stranding style: Solid block with 4 corner dots
    // Pressed state: Even stronger glow and deeper fill
    const dotShadow = isHovered
        ? (isPressed
            ? 'shadow-[0px_0px_12px_1px_rgba(0,255,255,0.6),0px_0px_15px_2px_rgba(0,255,255,0.3)] shadow-cyan-400'
            : 'shadow-[0px_0px_8.5px_0px_rgba(0,255,255,0.25),0px_0px_4.5px_0px_rgba(0,255,255,0.40)]'
        )
        : 'opacity-100';

    // Locked Dots: 2px square
    const dotBaseClass = "absolute w-[2px] h-[2px] bg-white z-10 transition-all duration-200";

    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Base transparent container */}
            <div className="absolute inset-0 transition-colors duration-300" />

            {/* Expanding Scan Fill - Scaling only this part for dot variant */}
            <div
                className={twMerge(
                    "absolute left-1/2 top-1/2 bg-cyan-600/90 z-0 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out",
                    isHovered ? 'h-[calc(100%-2px)] w-[calc(100%-2px)]' : 'h-0 w-[calc(100%-2px)]',
                    isPressed && "bg-cyan-400/95 scale-[0.97]"
                )}
            />

            {/* 4 Corner Dots */}
            <div className={`${dotBaseClass} -top-0 -left-0 ${dotShadow}`} />
            <div className={`${dotBaseClass} -top-0 -right-0 ${dotShadow}`} />
            <div className={`${dotBaseClass} -bottom-0 -left-0 ${dotShadow}`} />
            <div className={`${dotBaseClass} -bottom-0 -right-0 ${dotShadow}`} />
        </div>
    );
};

export const CyberButton = ({
    children,
    className,
    variant = 'corner',
    size = 'md',
    icon,
    loading,
    disabled,
    chamferCorner,
    iconOnly,
    ...props
}: CyberButtonProps) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { playHover, playClick } = useSoundSystem();
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [proximityOpacity, setProximityOpacity] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    useEffect(() => {
        if (variant !== 'corner' || disabled || loading) return;

        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!buttonRef.current) return;

            const rect = buttonRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate distance from mouse to button center
            const dist = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));

            // Proximity sensing range
            const range = 400;

            if (dist < range) {
                // Track relative mouse position for radial gradient
                const relX = ((e.clientX - rect.left) / rect.width) * 100;
                const relY = ((e.clientY - rect.top) / rect.height) * 100;
                setMousePos({ x: relX, y: relY });

                // Inside button detection
                const isInside = e.clientX >= rect.left && e.clientX <= rect.right &&
                    e.clientY >= rect.top && e.clientY <= rect.bottom;

                if (isInside) {
                    setProximityOpacity(1);
                } else {
                    // Exponential falloff for more obvious local brightening
                    const opacity = 1 - (dist / range);
                    setProximityOpacity(Math.pow(opacity, 1.5));
                }
            } else {
                setProximityOpacity(0);
            }
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);
        return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
    }, [variant, disabled, loading]);

    const baseStyles = "relative inline-flex items-center justify-center font-sans font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 group outline-none select-none z-0";

    const sizeStyles = {
        sm: iconOnly ? "px-2 h-8 text-xs" : "px-2 h-8 text-xs",
        md: iconOnly ? "px-4 h-10 text-sm" : "px-4 h-10 text-sm min-w-[120px]",
        lg: iconOnly ? "px-6 h-11 text-base" : "px-6 h-11 text-base min-w-[160px]",
    };

    const variants = {
        corner: "text-cyan-500 hover:text-cyan-400",
        chamfer: "text-cyan-400 hover:text-cyan-300",
        ghost: "text-cyber-200 hover:text-cyan-400 border border-transparent hover:border-cyan-500/30 bg-transparent",
        dot: "text-cyan-50 hover:text-white font-bold tracking-[0.2em]", // High contrast text for dot
    };

    const mergedClasses = twMerge(
        baseStyles,
        sizeStyles[size],
        variants[variant],
        // Global scale for non-special variants only
        isPressed && !['dot', 'corner'].includes(variant) && "scale-[0.97]",
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
                if (!disabled) {
                    setIsPressed(true);
                }
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
            {/* Frames */}
            {variant === 'corner' && <FrameCorners isHovered={isHovered} isPressed={isPressed} proximityOpacity={proximityOpacity} mousePos={mousePos} />}
            {variant === 'chamfer' && <FrameChamfer isHovered={isHovered} isPressed={isPressed} corner={chamferCorner} />}
            {variant === 'dot' && <FrameDot isHovered={isHovered} isPressed={isPressed} />}

            <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                    <span className="flex gap-1 items-center">
                        <span className="w-1 h-3 bg-current animate-[pulse_0.6s_ease-in-out_infinite]" />
                        <span className="w-1 h-4 bg-current animate-[pulse_0.6s_ease-in-out_0.1s_infinite]" />
                        <span className="w-1 h-2 bg-current animate-[pulse_0.6s_ease-in-out_0.2s_infinite]" />
                        <span className="ml-2 font-mono">PROCESSING</span>
                    </span>
                ) : (
                    <>
                        {icon && <span className="text-2xl opacity-80 group-hover:opacity-100 transition-opacity">{icon}</span>}
                        {typeof children === 'string' && variant === 'chamfer' ? (
                            <GlitchText text={children} />
                        ) : (
                            children
                        )}
                    </>
                )}
            </span>
        </button>
    );
};
