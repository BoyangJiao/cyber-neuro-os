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

// Helper to get status badge CSS class
const getStatusBadgeClass = (status: string): string => {
    const normalized = status.toUpperCase();
    if (normalized === 'DEPLOYED' || normalized === 'LIVE') {
        return 'status-badge--deployed';
    }
    if (normalized === 'IN_DEVELOPMENT' || normalized === 'IN DEVELOPMENT') {
        return 'status-badge--development';
    }
    if (normalized === 'CLASSIFIED' || normalized === 'ARCHIVED') {
        return 'status-badge--classified';
    }
    return 'status-badge--default';
};

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

                    {/* Gradient background */}
                    <div className="absolute inset-0 z-0 card-gradient-bg" />

                    {/* Card Content */}
                    <div className="relative w-full h-full flex flex-row items-center p-6 gap-6 z-[1] card-content-overlay">
                        {/* Project Icon */}
                        <div className="icon-container">
                            {project.thumbnail?.startsWith('http') || project.thumbnail?.startsWith('/') ? (
                                <img
                                    src={project.thumbnail}
                                    alt={project.title}
                                    className={twMerge(
                                        "w-full h-full object-cover transition-[filter] duration-300",
                                        isActive ? "glow-image" : "grayscale"
                                    )}
                                />
                            ) : (
                                <i
                                    className={twMerge(
                                        project.thumbnail || 'ri-code-s-slash-line',
                                        "text-[40px] transition-all duration-300",
                                        isActive ? "text-cyan-500 glow-icon" : "text-cyan-500/60"
                                    )}
                                />
                            )}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 flex flex-col justify-center gap-2">
                            <h3
                                className={twMerge(
                                    "text-xl font-semibold tracking-[2px] m-0 transition-all duration-300",
                                    isActive ? "text-cyan-500 glow-text" : "text-cyan-500/70"
                                )}
                            >
                                {project.title}
                            </h3>

                            <p className="text-neutral-400/80 text-[13px] m-0 leading-[1.4] line-clamp-2">
                                {project.description}
                            </p>

                            <div className={twMerge("status-badge mt-1", getStatusBadgeClass(project.status))}>
                                {project.status.replace('_', ' ')}
                            </div>
                        </div>
                    </div>
                </div>
            </Animator>
        </div>
    );
};
