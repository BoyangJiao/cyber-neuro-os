import type { Project } from '../../data/projects';
import type { CSSProperties } from 'react';
import { useState, useEffect } from 'react';
import { Animator, FrameCorners } from '@arwes/react';
import { twMerge } from 'tailwind-merge';

// Configuration constants
const CARD_WIDTH = 400;
const CARD_HEIGHT = 240;
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

    // Arwes FrameCorners CSS variables
    const frameStyles = {
        '--arwes-frames-bg-color': 'transparent',
        '--arwes-frames-line-color': delayedActive ? 'var(--color-cyan-600)' : 'var(--color-cyan-900)',
        '--arwes-frames-deco-color': delayedActive ? 'var(--color-cyan-400)' : 'var(--color-cyan-500)',
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
            <Animator>
                <div className="relative w-full h-full" style={frameStyles}>
                    {/* Inactive corner decoration - fade out */}
                    <div
                        className={twMerge(
                            "absolute inset-0 pointer-events-none z-10 transition-opacity",
                            delayedActive ? "opacity-0 duration-0" : "opacity-100"
                        )}
                    >
                        <FrameCorners padding={0} strokeWidth={2} cornerLength={12} />
                    </div>

                    {/* Active corner decoration - fade in with glow */}
                    <div
                        className={twMerge(
                            "absolute inset-0 pointer-events-none z-10 transition-opacity duration-400 ease-out",
                            delayedActive ? "opacity-100" : "opacity-0"
                        )}
                    >
                        <FrameCorners
                            padding={0}
                            strokeWidth={2}
                            cornerLength={24}
                            className="frame-glow"
                        />
                    </div>

                    {/* Background Layer: Image or Gradient + Icon Watermark */}
                    <div className="absolute inset-0 z-0 overflow-hidden bg-neutral-900">
                        {project.thumbnail?.startsWith('http') || project.thumbnail?.startsWith('/') ? (
                            // Image Background
                            <div className="absolute inset-0">
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
                            <div className="absolute inset-0 card-gradient-bg">
                                <i
                                    className={twMerge(
                                        project.thumbnail || 'ri-code-s-slash-line',
                                        "absolute -bottom-4 -right-4 text-[120px] text-cyan-500/10 pointer-events-none transition-transform duration-500",
                                        isActive ? "scale-110 translate-x-2 translate-y-2" : "scale-100"
                                    )}
                                />
                            </div>
                        )}
                    </div>

                    {/* Card Content */}
                    <div className="relative w-full h-full flex flex-col justify-end p-6 z-[1]">
                        <div className="flex flex-col gap-2 transform transition-transform duration-300 translate-z-10">
                            {/* Title */}
                            <h3
                                className={twMerge(
                                    "text-2xl font-bold tracking-[2px] m-0 transition-all duration-300",
                                    isActive ? "text-cyan-400 glow-text" : "text-white/80"
                                )}
                            >
                                {project.title}
                            </h3>
                        </div>
                    </div>
                </div>
            </Animator>
        </div>
    );
};
