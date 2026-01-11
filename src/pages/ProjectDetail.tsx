import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MotionDiv } from '../components/motion/MotionWrappers';
import { useQuery } from '../sanity/client';
import { useProjectStore } from '../store/useProjectStore';
import { PROJECT_DETAIL_QUERY } from '../sanity/queries';
import { DetailHeroSection } from '../components/project/detail/DetailHeroSection';
import { HUDSidebar } from '../components/project/detail/HUDSidebar';
import { CyberButton } from '../components/ui/CyberButton';
import { SectionRenderer } from '../components/project/detail/SectionRenderer';
import type { SanityProjectDetail } from '../data/projectDetails';
import { getProjectDetail } from '../data/projectDetails';

export const ProjectDetail = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { projects } = useProjectStore();

    // Data State
    const [detail, setDetail] = useState<SanityProjectDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI State
    const [activeSection, setActiveSection] = useState('');
    const [isHeroVisible, setIsHeroVisible] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Refs
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);

    // Find basic project info from store (for error checking / title fallback)
    const project = projects.find(p => p.id === projectId);

    // Live Query for Real-time Preview
    // We import useQuery from our configured client.ts
    // The initial data can be passed if we had server-side props, but here we start null/loading.
    const { data: sanityData, loading: isSanityLoading, error: sanityError } = useQuery<SanityProjectDetail>(
        PROJECT_DETAIL_QUERY,
        { slug: projectId },
        { initial: undefined }
    );

    // Sync state
    useEffect(() => {
        if (sanityData) {
            setDetail(sanityData);
            setIsLoading(false);
        } else if (!isSanityLoading && !sanityData) {
            // Failed to find or load
            // Fallback strategy remains similar to before
            const legacyData = getProjectDetail(projectId || '');
            if (legacyData) {
                if (import.meta.env.DEV) {
                    console.warn(`Project ${projectId} not found in Sanity. Falling back to legacy mock if available.`);
                }
                // For now, simple error or leave detail null
                setError("Project not found in CMS.");
            } else {
                setError("Project not found.");
            }
            setIsLoading(false);
        }
    }, [sanityData, isSanityLoading, projectId]);

    // Error handling from hook
    useEffect(() => {
        if (sanityError) {
            console.error("Sanity live query error:", sanityError);
            setError("Failed to load project content.");
            setIsLoading(false);
        }
    }, [sanityError]);

    // Construct Sidebar Sections from Modules
    const sidebarSections = (detail?.contentModules || []).map(module => ({
        id: module.title ? module.title.toLowerCase().replace(/\s+/g, '-') : module._key,
        title: module.title || 'Untitled'
    }));

    // Handle scroll spy
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
    }, [isLoading]);

    // Handle Layout Logic
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

    const handleClose = useCallback(() => {
        navigate('/projects');
    }, [navigate]);

    const toggleSidebar = useCallback(() => {
        setIsSidebarCollapsed(prev => !prev);
    }, []);

    // Render Logic
    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black">
                <div className="text-cyan-500 font-mono text-sm 2xl:text-base animate-pulse">LOADING NEURAL LINK...</div>
            </div>
        );
    }

    if (error || !project || !detail) {
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
                    <h1 className="text-2xl 2xl:text-3xl font-display text-cyan-500 mb-2">
                        {error || "PROJECT NOT FOUND"}
                    </h1>
                    <p className="text-neutral-400 mb-6 2xl:text-lg">
                        The requested project data is unavailable.
                    </p>
                    <CyberButton variant="ghost" onClick={() => navigate('/projects')}>
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
                <div className="absolute inset-0 z-0 bg-[#050505]/98" />

                {/* Close Button */}
                <div className="absolute top-4 right-4 z-[100]">
                    <CyberButton
                        variant="ghost"
                        icon={<i className="ri-close-line text-2xl" />}
                        onClick={handleClose}
                        className="text-cyan-500 hover:text-cyan-300"
                        iconOnly
                    />
                </div>

                {/* HUD Toggle */}
                <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: isHeroVisible ? 0 : 1,
                        x: isHeroVisible ? -60 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="fixed left-0 top-1/2 -translate-y-1/2 z-[100]"
                    style={{ pointerEvents: isHeroVisible ? 'none' : 'auto' }}
                >
                    <button
                        onClick={toggleSidebar}
                        className="group relative flex items-center cursor-pointer bg-transparent border-none p-0"
                    >
                        <div
                            className={`w-[3px] h-[120px] transition-all duration-300 ${isSidebarCollapsed ? 'hud-toggle-bar--active' : 'hud-toggle-bar--inactive'}`}
                        />
                        <MotionDiv
                            animate={{
                                width: isSidebarCollapsed ? 48 : 40,
                                opacity: 1,
                            }}
                            transition={{ duration: 0.2 }}
                            className="h-[100px] flex flex-col items-center justify-center gap-2 overflow-hidden bg-gradient-to-r from-[#06121ae6] to-[#06121acc] border-y border-r border-[#00f0ff33]"
                        >
                            <i className={`${isSidebarCollapsed ? 'ri-layout-left-2-line' : 'ri-layout-left-2-fill'} text-xl transition-all duration-200 text-[#00f0ff]`} />
                            <span className="text-[10px] font-mono tracking-[0.15em] uppercase text-[#00f0ff66] [writing-mode:vertical-rl] [text-orientation:mixed]">
                                HUD
                            </span>
                        </MotionDiv>
                    </button>
                </MotionDiv>

                {/* Main Content Area */}
                <div
                    ref={scrollContainerRef}
                    className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide scroll-smooth"
                >
                    <div ref={heroRef}>
                        {/* Pass project (basic info) and detail (Sanity enhanced info) */}
                        {/* Note: DetailHeroSection types might warn about mismatch but we are passing superset/compatible structure */}
                        <DetailHeroSection project={project} detail={detail as any} />
                    </div>

                    <div className="w-full px-4 2xl:px-6 pb-20 2xl:pb-28">
                        <div className="flex gap-6 lg:gap-10 2xl:gap-14">
                            {/* Sticky Sidebar */}
                            <MotionDiv
                                animate={{
                                    opacity: isSidebarCollapsed ? 0 : (isHeroVisible ? 0 : 1),
                                    width: isSidebarCollapsed ? 0 : 'auto',
                                }}
                                transition={{ duration: 0.5 }}
                                className="sticky top-6 h-fit self-start overflow-hidden flex-shrink-0 min-w-[180px] max-w-[220px]"
                                style={{ pointerEvents: (isHeroVisible || isSidebarCollapsed) ? 'none' : 'auto' }}
                            >
                                <HUDSidebar
                                    detail={detail}
                                    activeSection={activeSection}
                                    sections={sidebarSections}
                                    onNavigate={handleNavigate}
                                />
                            </MotionDiv>

                            {/* Dynamic Content Feed */}
                            <MotionDiv
                                layout
                                className="flex-1 min-w-0 px-4"
                            >
                                <div className="space-y-12 2xl:space-y-16">
                                    {(detail.contentModules || []).map((module) => (
                                        <SectionRenderer
                                            key={module._key}
                                            module={module}
                                            onVisible={() => setActiveSection(module.title ? module.title.toLowerCase().replace(/\s+/g, '-') : '')}
                                        />
                                    ))}
                                </div>

                                {/* Back Button Footer */}
                                <div className="py-20 2xl:py-28 flex flex-col items-center justify-center border-t border-cyan-900/30 mt-20 2xl:mt-28">
                                    <h3 className="text-2xl 2xl:text-3xl font-display text-cyan-400 mb-6 2xl:mb-8">
                                        End of Case Study
                                    </h3>
                                    <CyberButton variant="chamfer" onClick={handleClose}>
                                        <i className="ri-arrow-left-line mr-2" />
                                        Back to Directory
                                    </CyberButton>
                                </div>
                            </MotionDiv>
                        </div>
                    </div>
                </div>

                {/* Background Glows */}
                <div className="absolute top-0 left-0 w-1/3 h-1/3 pointer-events-none z-0 bg-glow-top-left" />
                <div className="absolute bottom-0 right-0 w-1/3 h-1/3 pointer-events-none z-0 bg-glow-bottom-right" />

            </MotionDiv>
        </AnimatePresence>
    );
};
