import type { Project } from '../../data/projects';
import type { CSSProperties } from 'react';
import { useState, useEffect } from 'react';
import { CornerFrame } from '../ui/frames/CornerFrame';
import { twMerge } from 'tailwind-merge';

// Configuration constants
const CARD_WIDTH = 400;
const CARD_HEIGHT = 225;
const DECO_DELAY_MS = 500;

interface ProjectCardProps {
    project: Project;
    isActive: boolean;
    onClick: () => void;
    angle: number;
    radius: number;
}

export const ProjectCard = ({
    project,
    isActive,
    onClick,
    angle,
    radius,
}: ProjectCardProps) => {
    // Delayed active state for corner decoration animation timing
    const [delayedActive, setDelayedActive] = useState(isActive);

    // Sync state during render to avoid synchronous setState in useEffect
    if (!isActive && delayedActive) {
        setDelayedActive(false);
    }

    useEffect(() => {
        if (isActive && !delayedActive) {
            const timer = setTimeout(() => {
                setDelayedActive(true);
            }, DECO_DELAY_MS);
            return () => clearTimeout(timer);
        }
    }, [isActive, delayedActive]);

    // Frame CSS variables for theming
    const frameStyles = {
        '--frame-line-color': delayedActive ? 'var(--color-brand-primary)' : 'color-mix(in srgb, var(--color-brand-primary) 30%, transparent)',
        '--frame-deco-color': delayedActive ? 'var(--color-brand-secondary)' : 'color-mix(in srgb, var(--color-brand-secondary) 50%, transparent)',
    } as CSSProperties;

    return (
        <div
            onClick={onClick}
            className="absolute top-0 left-0 cursor-pointer carousel-preserve-3d"
            style={{
                width: `${CARD_WIDTH}px`,
                height: `${CARD_HEIGHT}px`,
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
            }}
        >
            <div className="relative w-full h-full p-4" style={frameStyles}>
                {/* Inactive corner decoration - fade out */}
                <div
                    className={twMerge(
                        "absolute inset-0 pointer-events-none z-10 transition-opacity",
                        delayedActive ? "opacity-0 duration-0" : "opacity-100"
                    )}
                >
                    <CornerFrame strokeWidth={2} cornerSize={12} color="var(--color-brand-secondary)" />
                </div>

                {/* Active corner decoration - fade in with glow */}
                <div
                    className={twMerge(
                        "absolute inset-0 pointer-events-none z-10 transition-opacity duration-400 ease-out",
                        delayedActive ? "opacity-100" : "opacity-0"
                    )}
                >
                    <CornerFrame
                        strokeWidth={2}
                        cornerSize={24}
                        color="var(--color-brand-primary)"
                        className="frame-glow"
                    />
                </div>

                {/* Background Layer: Image or Gradient + Icon Watermark */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {project.thumbnail?.startsWith('http') || project.thumbnail?.startsWith('/') ? (
                        // Image Background
                        <div className="absolute inset-4">
                            <div className="absolute inset-0 bg-neutral-900/20 z-0" />
                            <img
                                src={project.thumbnail}
                                alt={project.title}
                                className={twMerge(
                                    "w-full h-full object-cover transition-all duration-500",
                                    isActive ? "grayscale-0 brightness-75 scale-105" : "grayscale brightness-50 scale-100"
                                )}
                            />
                            {/* Overlay Gradient for text readability */}
                            <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                        </div>
                    ) : (
                        // Fallback: Gradient + Icon Watermark
                        <div className="absolute inset-4 card-gradient-bg">
                            <i
                                className={twMerge(
                                    project.thumbnail || 'ri-code-s-slash-line',
                                    "absolute -bottom-4 -right-4 text-[120px] text-brand-primary/10 pointer-events-none transition-transform duration-500",
                                    isActive ? "scale-110 translate-x-2 translate-y-2" : "scale-100"
                                )}
                            />
                        </div>
                    )}
                </div>

                {/* Card Content */}
                <div className="relative w-full h-full flex flex-col justify-end p-6 z-10">
                    <div className="flex flex-col gap-2 transform transition-transform duration-300 translate-z-10">
                        {/* Title */}
                        <h3
                            className={twMerge(
                                "text-2xl font-bold tracking-[2px] m-0 transition-all duration-300",
                                isActive ? "text-[var(--color-text-primary)] glow-text" : "text-[var(--color-text-secondary)]"
                            )}
                        >
                            {project.title}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
};
