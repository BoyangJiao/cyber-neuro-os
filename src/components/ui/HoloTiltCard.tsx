import { useState, useRef, type ReactNode, type MouseEvent } from 'react';
import { useSoundSystem } from '../../hooks/useSoundSystem';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface HoloTiltCardProps {
    title: string;
    icon?: string;
    /** The 3D content that will popup on hover */
    content3d?: ReactNode;
    onClick?: () => void;
    className?: string;
    onHoverChange?: (isHovered: boolean) => void;
}

/**
 * HoloTiltCard - Optimized Version V2.7
 * Fixes: Scanline position (inside tilt), Title overlap, 3D Model Centering
 */
export const HoloTiltCard = ({
    title,
    icon,
    content3d,
    onClick,
    className,
    onHoverChange
}: HoloTiltCardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const tiltRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const { playHover, playClick } = useSoundSystem();

    // GSAP Context automatically cleans up animations
    const { contextSafe } = useGSAP({ scope: containerRef });

    const handleMouseMove = contextSafe((e: MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !tiltRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Normalize mouse (-1 to 1)
        const mouseX = (e.clientX - rect.left - width / 2) / (width / 2);
        const mouseY = (e.clientY - rect.top - height / 2) / (height / 2);

        // Gyroscope Intensity
        const tiltIntensity = 18; // degrees (increased for more dramatic effect)
        const parallaxIntensity = 30; // px for 3D content

        // Animate the Tilt Layer (Background)
        // Using gsap.to with overwrite: 'auto' ensures smooth updates without lag
        gsap.to(tiltRef.current, {
            rotationX: 35 + (-mouseY * tiltIntensity), // Base 35 + Gyro (increased base tilt)
            rotationY: mouseX * tiltIntensity,
            transformPerspective: 800,
            duration: 0.5,
            ease: "power2.out",
            overwrite: 'auto'
        });

        // Animate the 3D Content Layer (Parallax)
        if (contentRef.current) {
            gsap.to(contentRef.current, {
                x: mouseX * parallaxIntensity,
                y: mouseY * parallaxIntensity,
                rotationY: mouseX * 5,
                duration: 0.5,
                ease: "power2.out",
                overwrite: 'auto'
            });
        }
    });

    const handleMouseLeave = contextSafe(() => {
        setIsHovered(false);
        if (onHoverChange) onHoverChange(false);

        // Reset Tilt Layer
        if (tiltRef.current) {
            gsap.to(tiltRef.current, {
                rotationX: 0,
                rotationY: 0,
                z: 0, // Reset translateZ if needed
                y: 0,
                duration: 0.5,
                ease: "back.out(1.7)",
                overwrite: 'auto'
            });
        }

        // Reset 3D Content
        if (contentRef.current) {
            gsap.to(contentRef.current, {
                x: 0,
                y: 0,
                rotationY: 0,
                duration: 0.5,
                ease: "power2.out",
                overwrite: 'auto'
            });
        }
    });

    const handleMouseEnter = contextSafe(() => {
        setIsHovered(true);
        if (onHoverChange) onHoverChange(true);
        playHover();

        // Initial Pop Animation
        if (tiltRef.current) {
            gsap.to(tiltRef.current, {
                y: '-5%', // translateY
                // z: 0, // translateZ
                rotationX: 25, // Start at base tilt
                duration: 0.5,
                ease: "back.out(1.7)"
            });
        }
    });

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full flex justify-center items-end perspective-[2500px] group cursor-pointer ${className}`}
            onClick={() => {
                playClick();
                onClick?.();
            }}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* 1. Physics Container (Handles Tilt + Gyroscope) */}
            {/* Removed css transitions FROM STYLE to let GSAP handle it */}
            <div
                ref={tiltRef}
                className="absolute inset-0 w-full h-full z-0 bg-cyan-950/20 border border-cyan-500/30 overflow-hidden"
                style={{
                    // Initial State
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* 1.1 Pixel Grid Pattern */}
                <div className={`absolute inset-0 transition-opacity duration-300 bg-[linear-gradient(to_bottom,rgba(6,182,212,0.15)_80%,transparent)] [mask-image:conic-gradient(from_0deg_at_3px_3px,transparent_270deg,black_270deg)] [mask-size:4px_4px] ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

                {/* 1.2 Base Dark Background */}
                <div className="absolute inset-0 bg-cyan-950/40 group-hover:bg-cyan-950/20 transition-colors" />

                {/* 1.3 Scanline Effect - Moved INSIDE tilt container for correct physics */}
                {/* opacity-0 base, animate on hover. Removed explicit opacity-100 to allow animation to handle visibility fade */}
                <div className="absolute inset-x-0 h-[2px] bg-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-50 pointer-events-none opacity-0 group-hover:animate-[scanline_0.3s_linear_1]"></div>
            </div>

            {/* 2. Title */}
            {/* Reduced offset from -50px to -30px to prevent overlap with 3D model */}
            <div
                className={`absolute bottom-10 w-full text-center z-20 transition-transform duration-500 delay-200 font-display text-cyan-50 font-bold tracking-widest uppercase text-xl pointer-events-none ${isHovered ? 'translate-z-[100px]' : ''}`}
                style={{
                    transform: isHovered ? 'translate3d(0%, -30px, 100px)' : 'translate3d(0%, 0%, 0)'
                }}
            >
                {title}
            </div>

            {/* 3. 2D Content (Icon) - Fades OUT */}
            <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 delay-200 pointer-events-none z-10 ${isHovered ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}
            >
                {icon?.includes('/') || icon?.includes('data:') ? (
                    <img
                        src={icon}
                        alt=""
                        className="w-[72px] h-[72px] xl:w-[90px] xl:h-[90px] 2xl:w-[108px] 2xl:h-[108px] object-contain opacity-90"
                    />
                ) : (
                    <i className={`${icon} text-[72px] xl:text-[90px] 2xl:text-[108px] text-cyan-50 leading-none`}></i>
                )}
            </div>

            {/* 4. 3D Content (Popup) - Fades IN */}
            {/* Expanded container to prevent clipping of rotation rings */}
            <div
                ref={contentRef}
                className={`absolute w-[140%] h-[140%] -left-[20%] -top-[20%] z-50 transition-opacity duration-500 ease-out pointer-events-none delay-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    // Initial transform handled by GSAP or static
                    transform: isHovered ? 'translate3d(0%, -5%, 150px)' : 'translate3d(0%, 20%, -50px)'
                }}
            >
                {content3d}
            </div>
        </div>
    );
};
