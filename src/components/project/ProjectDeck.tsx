import { useEffect } from 'react';
import { useSpring, useTransform } from 'framer-motion';
import { useProjectStore } from '../../store/useProjectStore';
import { ProjectCard } from './ProjectCard';
import { ProjectInfo } from './ProjectInfo';
import { CyberButton } from '../ui/CyberButton';

export const ProjectDeck = () => {
    const { projects, activeProjectId, setActiveProject, nextProject, prevProject } = useProjectStore();
    const activeIndex = projects.findIndex(p => p.id === activeProjectId);

    // Spring physics for smooth "Time Machine" scrolling
    const springIndex = useSpring(activeIndex, {
        stiffness: 200,
        damping: 25,
        mass: 1
    });

    useEffect(() => {
        springIndex.set(activeIndex);
    }, [activeIndex, springIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prevProject();
            if (e.key === 'ArrowRight') nextProject();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextProject, prevProject]);

    return (
        <div className="w-full h-full relative flex flex-col items-center perspective-[800px] group overflow-hidden">

            {/* 3D Scene Container */}
            <div className="relative flex-1 w-full flex items-center justify-center transform-style-3d">
                {projects.map((project, index) => {
                    // Create relative MotionValue for each card
                    const relativeIndex = useTransform(springIndex, (latest) => index - latest);

                    return (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            isActive={project.id === activeProjectId}
                            onClick={() => {
                                if (index < activeIndex) prevProject();
                                else if (index > activeIndex) nextProject();
                            }}
                            index={relativeIndex}
                        />
                    );
                })}
            </div>

            {/* Project Info - Below Active Card */}
            <div className="w-full flex justify-center py-2 lg:py-3 pointer-events-none z-40">
                {projects.map(p => p.id === activeProjectId && (
                    <ProjectInfo key={p.id} project={p} />
                ))}
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 lg:left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                <CyberButton
                    variant="dot"
                    icon={<i className="ri-arrow-left-s-line"></i>}
                    onClick={prevProject}
                    className="h-10 w-10 lg:h-12 lg:w-12 rounded-full"
                    iconOnly
                />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4 lg:right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                <CyberButton
                    variant="dot"
                    icon={<i className="ri-arrow-right-s-line"></i>}
                    onClick={nextProject}
                    className="h-10 w-10 lg:h-12 lg:w-12 rounded-full"
                    iconOnly
                />
            </div>
        </div>
    );
};

