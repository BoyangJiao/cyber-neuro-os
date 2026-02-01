import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
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
    const location = useLocation();
    const navigate = useNavigate();
    const { projects } = useProjectStore();

    // Manually extract projectId since we are rendered outside of Routes
    const match = matchPath('/projects/:projectId', location.pathname);
    const projectId = match?.params.projectId;

    // Data State
    const [detail, setDetail] = useState<SanityProjectDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI State
    const [activeSection, setActiveSection] = useState('');

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

    // Construct Sidebar Sections from Modules (using anchorId)
    const sidebarSections = (detail?.contentModules || [])
        .filter(module => module.anchorId) // Only include modules with anchorId
        .map(module => ({
            id: module.anchorId || module._key,
            title: module.anchorId || 'Section'
        }));



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



    // Render Logic
    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black">
                <div className="text-brand-primary font-mono text-sm 2xl:text-base animate-pulse">LOADING NEURAL LINK...</div>
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
                    <h1 className="text-2xl 2xl:text-3xl font-display text-brand-primary mb-2">
                        {error || "PROJECT NOT FOUND"}
                    </h1>
                    <p className="text-text-secondary mb-6 2xl:text-lg">
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
                className="fixed left-0 right-0 z-[40] overflow-hidden"
                style={{
                    top: 'var(--header-height, 44px)',
                    bottom: 'var(--footer-height, 48px)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                {/* Background Overlay */}
                <div className="absolute inset-0 z-0 bg-bg-app/98" />

                {/* Close Button */}
                <div className="absolute top-4 right-4 lg:right-6 xl:right-10 2xl:right-12 z-[100]">
                    <CyberButton
                        variant="ghost"
                        icon={<i className="ri-close-line text-2xl" />}
                        onClick={handleClose}
                        className="text-brand-primary hover:text-text-accent"
                        iconOnly
                    />
                </div>



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

                    <div className="w-full px-4 lg:px-6 xl:px-10 2xl:px-12 pb-20 2xl:pb-28">
                        <div className="flex gap-4">
                            {/* Sticky Sidebar */}
                            <div
                                className="sticky top-6 h-fit self-start overflow-hidden flex-shrink-0 min-w-[180px] max-w-[220px]"
                            >
                                <HUDSidebar
                                    detail={detail}
                                    activeSection={activeSection}
                                    sections={sidebarSections}
                                    onNavigate={handleNavigate}
                                />
                            </div>

                            {/* Dynamic Content Feed */}
                            <MotionDiv
                                className="flex-1 min-w-0"
                            >
                                <div className="space-y-12 2xl:space-y-16">
                                    {(detail.contentModules || []).map((module) => (
                                        <SectionRenderer
                                            key={module._key}
                                            module={module}
                                            onVisible={() => setActiveSection(module.anchorId || module._key)}
                                        />
                                    ))}
                                </div>

                                {/* Back Button Footer */}
                                <div className="py-20 2xl:py-28 flex flex-col items-center justify-center border-t border-border-subtle mt-20 2xl:mt-28">
                                    <h3 className="text-2xl 2xl:text-3xl font-display text-brand-primary mb-6 2xl:mb-8">
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
