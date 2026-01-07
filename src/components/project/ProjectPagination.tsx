import { useState } from 'react';
import { MotionDiv } from '../motion/MotionWrappers';
import type { Project } from '../../data/projects';
import { CyberButton } from '../ui/CyberButton';
import { twMerge } from 'tailwind-merge';

interface ProjectPaginationProps {
    projects: Project[];
    activeProjectId: string;
    onSelect: (id: string) => void;
}

export const ProjectPagination = ({ projects, activeProjectId, onSelect }: ProjectPaginationProps) => {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <div className="flex items-center gap-4 pointer-events-auto">
            {projects.map((project, index) => {
                const isActive = project.id === activeProjectId;
                const isHovered = hoveredId === project.id;
                const showExpanded = isActive || isHovered;

                return (
                    <MotionDiv
                        key={project.id}
                        layout // Enable smooth width transition
                        initial={false}
                        animate={{
                            width: 'auto' // Layout handles sizing based on content
                        }}
                        className="relative"
                        onMouseEnter={() => setHoveredId(project.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <CyberButton
                            variant="chamfer"
                            className={twMerge(
                                "h-8 transition-all duration-300 min-w-0 px-1",
                                showExpanded ? "px-3" : "px-1 opacity-60 [&>div.absolute]:opacity-0"
                            )}
                            onClick={() => onSelect(project.id)}
                            chamferCorner="bottom-right"
                        >
                            {/* Content */}
                            <div className={twMerge(
                                "flex items-center whitespace-nowrap",
                                showExpanded ? "gap-1" : "gap-0"
                            )}>
                                {/* Index indicator (always visible) */}
                                <span className={twMerge(
                                    "font-mono text-xs",
                                    showExpanded ? "text-cyan-400" : "text-cyan-700"
                                )}>
                                    0{index + 1}
                                </span>

                                {/* Title (Visible if active or hovered) */}
                                <span className={twMerge(
                                    "text-xs font-bold tracking-wider transition-all duration-300 overflow-hidden",
                                    showExpanded ? "w-auto opacity-100 pl-2 border-l border-cyan-500/30" : "w-0 opacity-0"
                                )}>
                                    {project.title}
                                </span>
                            </div>
                        </CyberButton>
                    </MotionDiv>
                );
            })}
        </div>
    );
};
