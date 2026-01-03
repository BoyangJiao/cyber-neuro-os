import { motion, MotionValue, useTransform } from 'framer-motion';
import { HoloFrame } from '../ui/HoloFrame';
import type { Project } from '../../data/projects';
import { twMerge } from 'tailwind-merge';
import { ProjectInfo } from './ProjectInfo';

interface ProjectCardProps {
    project: Project;
    isActive: boolean;
    onClick: () => void;
    index: MotionValue<number>; // Relative index as a continuous value
}

export const ProjectCard = ({ project, isActive, onClick, index }: ProjectCardProps) => {
    // ========== PRISM GEOMETRY ==========
    // This simulates a 9-sided rotating prism where each project is a face.
    // The viewer sees ~3 faces at a time (center + 2 angled sides).
    // When switching projects, the entire prism rotates around its vertical axis.

    const prismRadius = 700;    // Distance from center axis to face surface (SMALLER = tighter grouping)
    const anglePerFace = 40;    // Degrees per face (360 / 9 faces = 40deg)

    // Calculate face angle (degrees) based on relative index
    const faceAngle = useTransform(index, (i) => i * anglePerFace);

    // ---------- POSITION ----------
    // X: Horizontal position derived from prism geometry
    // At angle 0: center. At angle 40: offset right. At angle -40: offset left.
    const x = useTransform(faceAngle, (a) => {
        const rad = (a * Math.PI) / 180;
        return `calc(-50% + ${Math.sin(rad) * prismRadius}px)`;
    });

    // Y: Compensate for perspective-induced vertical offset
    // Side cards need to shift UP to align with center card's top/bottom edges
    const y = useTransform(faceAngle, (a) => {
        const offset = Math.abs(a) * 2.2; // Pixels to shift up per degree of angle
        return `calc(-50% - ${offset}px)`;
    });

    // Z: Depth from viewer. Center face is closest, sides recede.
    // At angle 0: z = 0 (front). At angle 90: z = -prismRadius (side, deep).
    const z = useTransform(faceAngle, (a) => {
        const rad = (a * Math.PI) / 180;
        return (Math.cos(rad) - 1) * prismRadius;
    });

    // ---------- ORIENTATION ----------
    // RotateY: Each face rotates to face outward from the prism center
    const rotateY = useTransform(faceAngle, (a) => -a);

    // SkewY: The critical "polyhedron facet" effect
    // Reduced factor to prevent vertical misalignment while keeping facet feel
    const skewY = useTransform(faceAngle, (a) => a * -0.5);

    // ---------- APPEARANCE ----------
    // Scale: Uniform for vertical alignment (no size variation)
    const scale = 1;

    // Opacity: SHARP cutoff to simulate solid object with hidden back faces
    // Faces visible from -60deg to +60deg. Fade between 30-60.
    const opacity = useTransform(faceAngle, (a) => {
        const absA = Math.abs(a);
        if (absA > 60) return 0;             // Behind the prism - invisible
        if (absA < 30) return 1;             // Front faces - fully visible
        return 1 - ((absA - 30) / 30);       // Transition zone - gradual fade
    });

    // Z-Index: Ensure front faces render on top
    const zIndex = useTransform(faceAngle, (a) => Math.round(100 - Math.abs(a)));

    const MotionDiv = motion.div as any;

    return (
        <MotionDiv
            className={twMerge(
                "absolute top-1/2 left-1/2 w-[410px] h-[502px] cursor-pointer"
            )}
            style={{
                x,
                y,
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
                    "w-full h-full bg-cyber-900/80 backdrop-blur-md transition-colors duration-300 overflow-hidden",
                    isActive ? "border-cyan-400/50" : "border-cyan-900/30 group-hover:border-cyan-500/30"
                )}
            >
                {/* Placeholder Image */}
                <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-700">
                    <img
                        src={`https://placehold.co/600x800/06121a/00f0ff?text=${encodeURIComponent(project.title)}`}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-cyber-950/80 via-transparent to-transparent"></div>
                </div>
            </HoloFrame>

            {/* External Project Info (Active Only) */}
            {/* Note: In fast scroll, we might want to hide this until settled. For now keep simple. */}
            {isActive && <ProjectInfo project={project} />}
        </MotionDiv>
    );
};
