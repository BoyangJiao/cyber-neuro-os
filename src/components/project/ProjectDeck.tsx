import { useEffect } from 'react';
import { useSpring, useTransform } from 'framer-motion';
import { useProjectStore } from '../../store/useProjectStore';
import { ProjectCard } from './ProjectCard';
import { CyberButton } from '../ui/CyberButton';
import { ProjectPagination } from './ProjectPagination';

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
        <div className="w-full h-full relative flex items-center justify-center perspective-[1200px] group pb-32">

            {/* 3D Scene Container */}
            <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
                {projects.map((project, index) => {
                    // Create relative MotionValue for each card
                    // Note: In a dynamic list, this should be in a memoized wrapper, 
                    // but for static project list this is acceptable.
                    const relativeIndex = useTransform(springIndex, (latest) => index - latest);

                    // Optimization: We can't conditionally return null based on a MotionValue value easily 
                    // without causing hook count errors or hydration mismatches if we want to animate out.
                    // Instead, we will let CSS opacity handle the hiding (ProjectCard does this).

                    return (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            isActive={project.id === activeProjectId}
                            onClick={() => setActiveProject(project.id)}
                            index={relativeIndex}
                        />
                    );
                })}
            </div>

            {/* Navigation Areas (Clickable overlays or buttons) */}
            <div className="absolute top-0 bottom-32 left-0 w-32 flex items-center justify-start pl-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <CyberButton
                    variant="dot"
                    icon={<i className="ri-arrow-left-s-line"></i>}
                    onClick={prevProject}
                    className="h-16 w-16 rounded-full"
                    iconOnly
                />
            </div>
            <div className="absolute top-0 bottom-32 right-0 w-32 flex items-center justify-end pr-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <CyberButton
                    variant="dot"
                    icon={<i className="ri-arrow-right-s-line"></i>}
                    onClick={nextProject}
                    className="h-16 w-16 rounded-full"
                    iconOnly
                />
            </div>

            {/* Pagination Controls */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center z-50">
                <ProjectPagination
                    projects={projects}
                    activeProjectId={activeProjectId}
                    onSelect={setActiveProject}
                />
            </div>

        </div>
    );
};
