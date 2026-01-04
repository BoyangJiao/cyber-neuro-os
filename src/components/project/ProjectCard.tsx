import { motion, MotionValue, useTransform } from 'framer-motion';
import { HoloFrame } from '../ui/HoloFrame';
import type { Project } from '../../data/projects';
import { twMerge } from 'tailwind-merge';

interface ProjectCardProps {
    project: Project;
    isActive: boolean;
    onClick: () => void;
    index: MotionValue<number>; // Relative index as a continuous value
}

export const ProjectCard = ({ project, isActive, onClick, index }: ProjectCardProps) => {
    // ========== COVER FLOW WITH TRAPEZOID EFFECT ==========
    // Active card: flat, centered
    // Inactive cards: rotated, skewed (trapezoid), pushed back

    const xOffset = 360; // Horizontal spacing
    const zDepth = 300;  // Push back depth
    const rotateAngle = 60; // Strong rotation for trapezoid effect
    const skewAngle = 12; // Re-introduce skew for forced trapezoid

    // X position
    const x = useTransform(index, (i) => i * xOffset);

    // Z depth (push back)
    const z = useTransform(index, (i) => Math.min(0, -Math.abs(i) * zDepth));

    // Y-axis rotation
    const rotateY = useTransform(index, (i) => {
        if (i < -0.5) return rotateAngle;
        if (i > 0.5) return -rotateAngle;
        return i * -rotateAngle * 2;
    });

    // Skew Y for trapezoid effect
    const skewY = useTransform(index, (i) => {
        if (i < -0.5) return -skewAngle; // Skew inverse to rotation side usually
        if (i > 0.5) return skewAngle;
        return i * skewAngle * 2;
    });

    // Scale
    const scale = useTransform(index, (i) => {
        const abs = Math.abs(i);
        if (abs < 0.3) return 1;
        return 0.85;
    });

    // Opacity - Only show n-1, n, n+1
    const opacity = useTransform(index, (i) => {
        const abs = Math.abs(i);
        if (abs < 0.5) return 1;
        if (abs < 1.5) return 0.5; // Visible side cards
        return 0; // Hidden beyond
    });

    // Z-index
    const zIndex = useTransform(index, (i) => Math.round(100 - Math.abs(i)));

    const MotionDiv = motion.div as any;

    return (
        <MotionDiv
            className={twMerge(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                "w-[200px] lg:w-[240px] xl:w-[306px] 2xl:w-[306px]",
                "h-[245px] lg:h-[294px] xl:h-[375px] 2xl:h-[375px]",
                "cursor-pointer"
            )}
            style={{
                x,
                z,
                rotateY,
                skewY,
                scale,
                opacity,
                zIndex,
                transformStyle: "preserve-3d",
            }}
            onClick={onClick}
        >
            <HoloFrame
                variant="corner"
                active={isActive}
                className={twMerge(
                    "w-full h-full bg-cyber-900/60 backdrop-blur-sm transition-all duration-500 overflow-hidden",
                    isActive
                        ? "border-cyan-400/80 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                        : "border-cyan-800/40"
                )}
            >
                {/* Simple Placeholder Image */}
                <img
                    src={`https://placehold.co/400x500/0a1420/0a1420`}
                    alt={project.title}
                    className="w-full h-full object-cover"
                />
            </HoloFrame>
        </MotionDiv>
    );
};
