import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MotionDiv } from '../components/motion/MotionWrappers';
import { useProjectStore } from '../store/useProjectStore';
import { getProjectDetail } from '../data/projectDetails';
import { DetailHeroSection } from '../components/project/detail/DetailHeroSection';
import { HUDSidebar } from '../components/project/detail/HUDSidebar';
import { NarrativeSection } from '../components/project/detail/NarrativeSection';
import { HighlightStatement } from '../components/project/detail/HighlightQuote';
import { CyberButton } from '../components/ui/CyberButton';

// Section configuration for navigation (highlight quote is not a navigation anchor)
const SECTIONS = [
    { id: 'context', title: 'CONTEXT' },
    { id: 'strategy', title: 'STRATEGY' },
    { id: 'highlights', title: 'HIGHLIGHTS' },
    { id: 'outcome', title: 'OUTCOME' },
];

export const ProjectDetail = () => {

    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { projects } = useProjectStore();

    const [activeSection, setActiveSection] = useState('context');
    const [isHeroVisible, setIsHeroVisible] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);

    // Find project and detail data
    const project = projects.find(p => p.id === projectId);
    const detail = projectId ? getProjectDetail(projectId) : undefined;

    // Handle scroll to detect when hero leaves viewport
    useEffect(() => {
        const container = scrollContainerRef.current;
        const hero = heroRef.current;
        if (!container || !hero) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsHeroVisible(entry.isIntersecting);
            },
            { root: container, threshold: 0.1 }
        );

        observer.observe(hero);
        return () => observer.disconnect();
    }, []);

    // Handle section navigation
    const handleNavigate = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const elementTop = element.offsetTop;
            container.scrollTo({
                top: elementTop - 100,
                behavior: 'smooth',
            });
        }
    }, []);

    // Handle section visibility change (scroll spy)
    const handleSectionVisible = useCallback((sectionId: string) => {
        setActiveSection(sectionId);
    }, []);

    // Handle close/back navigation
    const handleClose = useCallback(() => {
        navigate('/projects');
    }, [navigate]);

    // Toggle sidebar
    const toggleSidebar = useCallback(() => {
        setIsSidebarCollapsed(prev => !prev);
    }, []);

    // 404 state
    if (!project || !detail) {
        return (
            <MotionDiv
                className="w-full h-full flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="text-center">
                    <div className="text-6xl mb-4 opacity-30">
                        <i className="ri-error-warning-line" />
                    </div>
                    <h1 className="text-2xl font-display text-cyan-500 mb-2">PROJECT NOT FOUND</h1>
                    <p className="text-neutral-400 mb-6">The requested project data is unavailable.</p>
                    <CyberButton
                        variant="ghost"
                        onClick={() => navigate('/projects')}
                    >
                        Return to Directory
                    </CyberButton>
                </div>
            </MotionDiv>
        );
    }



    return (
        <AnimatePresence>
            <MotionDiv
                className="absolute inset-0 z-[60] overflow-hidden"
                layoutId={`project-card-${projectId}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            >
                {/* Background Overlay */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background: 'rgba(5, 5, 5, 0.98)',
                    }}
                />

                {/* Close Button - Positioned inside container (Top Right) */}
                {/* 这里的 top-4 right-4 对应 16px，与容器 padding 对齐 */}
                <div className="absolute top-4 right-4 z-[100]">
                    <CyberButton
                        variant="ghost"
                        icon={<i className="ri-close-line text-2xl" />}
                        onClick={handleClose}
                        className="text-cyan-500 hover:text-cyan-300"
                        iconOnly
                    />
                </div>

                {/* Sidebar Toggle - Cyberpunk Energy Bar */}
                <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: isHeroVisible ? 0 : 1,
                        x: isHeroVisible ? -60 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="fixed left-0 top-1/2 -translate-y-1/2 z-[100]"
                    style={{
                        pointerEvents: isHeroVisible ? 'none' : 'auto',
                    }}
                >
                    {/* Energy Bar Toggle Button */}
                    <button
                        onClick={toggleSidebar}
                        className="group relative flex items-center cursor-pointer"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            padding: 0,
                        }}
                    >
                        {/* Glowing Edge Line */}
                        <div
                            className="w-[3px] h-[120px] transition-all duration-300"
                            style={{
                                background: isSidebarCollapsed
                                    ? 'linear-gradient(to bottom, transparent 0%, rgba(0, 240, 255, 0.4) 10%, rgba(0, 240, 255, 1) 50%, rgba(0, 240, 255, 0.4) 90%, transparent 100%)'
                                    : 'linear-gradient(to bottom, transparent 0%, rgba(0, 240, 255, 0.15) 20%, rgba(0, 240, 255, 0.3) 50%, rgba(0, 240, 255, 0.15) 80%, transparent 100%)',
                                boxShadow: isSidebarCollapsed
                                    ? '0 0 15px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.3)'
                                    : '0 0 5px rgba(0, 240, 255, 0.2)',
                            }}
                        />

                        {/* Expandable Panel */}
                        <MotionDiv
                            animate={{
                                width: isSidebarCollapsed ? 48 : 40,
                                opacity: 1,
                            }}
                            transition={{ duration: 0.2 }}
                            className="h-[100px] flex flex-col items-center justify-center gap-2 overflow-hidden"
                            style={{
                                background: 'linear-gradient(90deg, rgba(6, 18, 26, 0.95), rgba(6, 18, 26, 0.8))',
                                borderTop: '1px solid rgba(0, 240, 255, 0.2)',
                                borderRight: '1px solid rgba(0, 240, 255, 0.2)',
                                borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
                            }}
                        >
                            {/* Toggle Icon */}
                            <i
                                className={`${isSidebarCollapsed ? 'ri-layout-left-2-line' : 'ri-layout-left-2-fill'} text-xl transition-all duration-200`}
                                style={{
                                    color: isSidebarCollapsed ? '#00f0ff' : 'rgba(0, 240, 255, 0.5)',
                                    filter: isSidebarCollapsed ? 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.8))' : 'none',
                                }}
                            />

                            {/* Vertical Label */}
                            <span
                                className="text-[10px] font-mono tracking-[0.15em] uppercase transition-colors duration-200"
                                style={{
                                    writingMode: 'vertical-rl',
                                    textOrientation: 'mixed',
                                    color: isSidebarCollapsed ? '#00f0ff' : 'rgba(0, 240, 255, 0.4)',
                                }}
                            >
                                HUD
                            </span>
                        </MotionDiv>

                        {/* Hover Glow Effect */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            style={{
                                background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.1), transparent)',
                            }}
                        />
                    </button>
                </MotionDiv>

                {/* Scroll Container - Full Page Scroll */}
                <div
                    ref={scrollContainerRef}
                    className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide"
                    style={{
                        scrollBehavior: 'smooth',
                    }}
                >
                    {/* Hero Section - Full Width */}
                    <div ref={heroRef}>
                        <DetailHeroSection project={project} detail={detail} />
                    </div>

                    {/* Main Content Section - Flex Layout for smooth animation */}
                    <div className="w-full px-4 pb-20">
                        {/* Flex container for sidebar + content */}
                        <div className="flex gap-6 lg:gap-10">
                            {/* Sidebar - Animated width */}
                            <MotionDiv
                                animate={{
                                    opacity: isSidebarCollapsed ? 0 : (isHeroVisible ? 0 : 1),
                                    width: isSidebarCollapsed ? 0 : 'auto',
                                    marginRight: isSidebarCollapsed ? 0 : undefined,
                                }}
                                transition={{
                                    duration: 0.5,
                                    ease: [0.4, 0, 0.2, 1],
                                    opacity: { duration: 0.3 }
                                }}
                                style={{
                                    position: 'sticky',
                                    top: '24px',
                                    height: 'fit-content',
                                    alignSelf: 'flex-start',
                                    pointerEvents: (isHeroVisible || isSidebarCollapsed) ? 'none' : 'auto',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    minWidth: isSidebarCollapsed ? 0 : '180px',
                                    maxWidth: isSidebarCollapsed ? 0 : '220px',
                                }}
                            >
                                <HUDSidebar
                                    detail={detail}
                                    activeSection={activeSection}
                                    sections={SECTIONS}
                                    onNavigate={handleNavigate}
                                />
                            </MotionDiv>

                            {/* Content Feed - Flex grow to fill remaining space */}
                            <MotionDiv
                                layout
                                transition={{
                                    duration: 0.5,
                                    ease: [0.4, 0, 0.2, 1]
                                }}
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                }}
                                className="px-4"
                            >
                                {/* Highlight Statement - Flexible emphasis element (not an anchor) */}
                                <HighlightStatement content={detail.sections.hook.content} />

                                {/* Narrative Sections */}
                                {SECTIONS.map((section) => (
                                    <NarrativeSection
                                        key={section.id}
                                        id={section.id}
                                        detail={detail}
                                        onVisible={handleSectionVisible}
                                    />
                                ))}

                                {/* End Section - Call to Action */}
                                <div className="py-20 flex flex-col items-center justify-center border-t border-cyan-900/30">
                                    <MotionDiv
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="text-center"
                                    >
                                        <div className="text-[12px] font-mono text-cyan-600 tracking-[0.3em] uppercase mb-4">
                                            End of Case Study
                                        </div>
                                        <h3 className="text-2xl font-display text-cyan-400 mb-6">
                                            Explore More Projects
                                        </h3>
                                        <CyberButton
                                            variant="chamfer"
                                            onClick={handleClose}
                                        >
                                            <i className="ri-arrow-left-line mr-2" />
                                            Back to Directory
                                        </CyberButton>
                                    </MotionDiv>
                                </div>
                            </MotionDiv>
                        </div>
                    </div>
                </div>

                {/* Ambient Glow Effects */}
                <div
                    className="absolute top-0 left-0 w-1/3 h-1/3 pointer-events-none z-0"
                    style={{
                        background: 'radial-gradient(ellipse at top left, rgba(0, 240, 255, 0.05), transparent 60%)',
                    }}
                />
                <div
                    className="absolute bottom-0 right-0 w-1/3 h-1/3 pointer-events-none z-0"
                    style={{
                        background: 'radial-gradient(ellipse at bottom right, rgba(0, 240, 255, 0.03), transparent 60%)',
                    }}
                />
            </MotionDiv>
        </AnimatePresence>
    );
};
