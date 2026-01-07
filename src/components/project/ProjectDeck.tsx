import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../store/useProjectStore';
import { ProjectCard } from './ProjectCard';
import { ProjectInfo } from './ProjectInfo';
import { CyberButton } from '../ui/CyberButton';

// Carousel Configuration
const CAROUSEL_CONFIG = {
    MAX_VISIBLE_CARDS: 6,        // Limit cards for optimal 3D effect
    RADIUS: 380,                 // Distance from center (px)
    BASE_CONTENT_HEIGHT: 650,    // Height threshold for scaling
    MIN_SCALE: 0.5,
    MAX_SCALE: 1.5,
    WHEEL_THROTTLE_MS: 500,      // Delay between wheel events
};

export const ProjectDeck = () => {
    const { projects, activeProjectId, setActiveProject } = useProjectStore();
    const navigate = useNavigate();

    // Only show first configured number of projects for clean 3D effect
    const visibleProjects = projects.slice(0, CAROUSEL_CONFIG.MAX_VISIBLE_CARDS);
    const activeIndex = visibleProjects.findIndex(p => p.id === activeProjectId);
    const effectiveActiveIndex = activeIndex >= 0 ? activeIndex : 0;

    // Container ref and scale state for responsive sizing
    const containerRef = useRef<HTMLDivElement>(null);
    const [deckScale, setDeckScale] = useState(1);

    // 3D Carousel configuration
    const totalCards = visibleProjects.length;
    const anglePerCard = totalCards > 0 ? 360 / totalCards : 0;
    const radius = CAROUSEL_CONFIG.RADIUS;

    // Current rotation angle - calculated from activeIndex
    // Ensures rotation syncs with store's activeProjectId on remount
    const initialRotation = -effectiveActiveIndex * anglePerCard;
    const [rotation, setRotation] = useState(initialRotation);

    // Track previous index for rotation calculation
    const prevIndexRef = useRef(effectiveActiveIndex);

    // Sync rotation when activeProjectId changes (from Pagination or other sources)
    useEffect(() => {
        const prevIndex = prevIndexRef.current;

        // Only rotate if index actually changed
        if (effectiveActiveIndex !== prevIndex) {
            // Calculate shortest path rotation
            let diff = effectiveActiveIndex - prevIndex;
            if (diff > totalCards / 2) {
                diff -= totalCards;
            } else if (diff < -totalCards / 2) {
                diff += totalCards;
            }
            setRotation(prev => prev - diff * anglePerCard);
        }

        // Update ref after rotation calculation
        prevIndexRef.current = effectiveActiveIndex;
    }, [effectiveActiveIndex, totalCards, anglePerCard]);

    // Destructure scaling constants for readability
    const { BASE_CONTENT_HEIGHT, MIN_SCALE, MAX_SCALE } = CAROUSEL_CONFIG;

    // Navigation handlers with useCallback to ensure stable references
    // IMPORTANT: Update prevIndexRef BEFORE calling setActiveProject to prevent
    // the useEffect from triggering a duplicate rotation
    const handleNext = useCallback(() => {
        const currentIdx = prevIndexRef.current;
        const nextIdx = (currentIdx + 1) % totalCards;

        // Update ref first to prevent useEffect double-rotation
        prevIndexRef.current = nextIdx;

        setRotation(prev => prev - anglePerCard);
        setActiveProject(visibleProjects[nextIdx].id);
    }, [totalCards, anglePerCard, visibleProjects, setActiveProject]);

    const handlePrev = useCallback(() => {
        const currentIdx = prevIndexRef.current;
        const prevIdx = (currentIdx - 1 + totalCards) % totalCards;

        // Update ref first to prevent useEffect double-rotation
        prevIndexRef.current = prevIdx;

        setRotation(prev => prev + anglePerCard);
        setActiveProject(visibleProjects[prevIdx].id);
    }, [totalCards, anglePerCard, visibleProjects, setActiveProject]);

    const handleCardClick = useCallback((index: number) => {
        const current = prevIndexRef.current;

        // If clicking on active card, navigate to detail page
        if (index === current) {
            navigate(`/projects/${visibleProjects[index].id}`);
            return;
        }

        let diff = index - current;
        if (diff > totalCards / 2) {
            diff -= totalCards;
        } else if (diff < -totalCards / 2) {
            diff += totalCards;
        }

        // Update ref first to prevent useEffect double-rotation
        prevIndexRef.current = index;

        setRotation(prev => prev - diff * anglePerCard);
        setActiveProject(visibleProjects[index].id);
    }, [totalCards, anglePerCard, visibleProjects, setActiveProject, navigate]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev]);

    // Mouse wheel navigation with debounce
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let isThrottled = false;
        const throttleDelay = 500; // ms between wheel events (increased for smoother feel)

        const handleWheel = (e: WheelEvent) => {
            // Prevent page scrolling when inside the container
            e.preventDefault();

            if (isThrottled) return;
            isThrottled = true;

            // Fixed direction: scroll down = prev, scroll up = next
            if (e.deltaY > 0 || e.deltaX > 0) {
                handlePrev();
            } else if (e.deltaY < 0 || e.deltaX < 0) {
                handleNext();
            }

            setTimeout(() => {
                isThrottled = false;
            }, throttleDelay);
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [handleNext, handlePrev]);

    // Dynamic scaling based on container height
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const updateScale = () => {
            const containerHeight = container.clientHeight;
            const scaleFactor = containerHeight / BASE_CONTENT_HEIGHT;
            const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scaleFactor));
            setDeckScale(clampedScale);
        };

        updateScale();
        const resizeObserver = new ResizeObserver(updateScale);
        resizeObserver.observe(container);

        return () => resizeObserver.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative flex flex-col items-center group overflow-hidden"
        >
            {/* 3D Scene Container with perspective */}
            <div
                className="relative flex-1 w-full flex items-center justify-center"
                style={{
                    perspective: '1000px',
                    perspectiveOrigin: '50% 50%',
                }}
            >
                {/* Scale wrapper */}
                <div
                    style={{
                        transform: `scale(${deckScale})`,
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {/* Rotating Carousel Container */}
                    <div
                        style={{
                            position: 'relative',
                            width: '400px',
                            height: '240px',
                            transformStyle: 'preserve-3d',
                            transform: `rotateY(${rotation}deg)`,
                            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        {visibleProjects.map((project, index) => {
                            const cardAngle = index * anglePerCard;
                            const isActive = index === effectiveActiveIndex;

                            return (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    isActive={isActive}
                                    onClick={() => handleCardClick(index)}
                                    angle={cardAngle}
                                    radius={radius}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Project Info - Below Active Card */}
            <div className="w-full flex justify-center py-2 lg:py-3 pointer-events-none z-40">
                {visibleProjects.map(p => p.id === activeProjectId && (
                    <ProjectInfo key={p.id} project={p} />
                ))}
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 lg:left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                <CyberButton
                    variant="ghost"
                    icon={<i className="ri-arrow-left-s-line"></i>}
                    onClick={handlePrev}
                    className="h-10 w-10 lg:h-12 lg:w-12 rounded-full"
                    iconOnly
                />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4 lg:right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                <CyberButton
                    variant="ghost"
                    icon={<i className="ri-arrow-right-s-line"></i>}
                    onClick={handleNext}
                    className="h-10 w-10 lg:h-12 lg:w-12 rounded-full"
                    iconOnly
                />
            </div>
        </div>
    );
};
