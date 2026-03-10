import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { client } from '../sanity/client';
import { PROJECTS_QUERY } from '../sanity/queries';
import { type Project } from '../data/projects';
import type { SanityProjectRaw } from '../sanity/types';

// Manual order requested by user as fallback
const PROJECT_TITLE_ORDER = [
    'Worldfirst mobile',
    'Worldfirst mobile design system',
    'worldfirst CN redesign',
    'worldfirst FX redesign',
    'Alipay+ wallet',
    'Vodapay',
    'Alipay+ rewards'
].map(t => t.toLowerCase());

interface ProjectState {
    projects: Project[];
    activeProjectId: string;
    activeProjectIndex: number;  // 保持 Mission 选择
    filter: 'ALL' | 'WEB3' | 'AI' | 'SYS';
    language: 'en' | 'zh';
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchProjects: () => Promise<void>;
    setProjects: (sanityProjects: SanityProjectRaw[]) => void;
    preloadHeroAssets: () => void;
    setActiveProject: (id: string) => void;
    setActiveProjectIndex: (index: number) => void;
    setFilter: (filter: 'ALL' | 'WEB3' | 'AI' | 'SYS') => void;
    setLanguage: (lang: 'en' | 'zh') => void;
    nextProject: () => void;
    prevProject: () => void;
    getActiveProject: () => Project | undefined;
}

// Helper to get initial language
const getInitialLanguage = (): 'en' | 'zh' => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('cyber-neuro-language');
        if (stored === 'en' || stored === 'zh') return stored;
    }
    return 'en';
};

export const useProjectStore = create<ProjectState>()(
    persist(
        (set, get) => ({
            projects: [],
            activeProjectId: '',
            activeProjectIndex: 0,
            filter: 'ALL',
            language: getInitialLanguage(),
            isLoading: false,
            error: null,

            setProjects: (sanityProjects) => {
                // Sanity queries may return raw array OR a wrapper object with 'result' property
                // Support both, and fallback to empty array if data is missing/invalid
                let rawData: SanityProjectRaw[] = [];
                if (Array.isArray(sanityProjects)) {
                    rawData = sanityProjects;
                } else if (sanityProjects && typeof sanityProjects === 'object' && 'result' in sanityProjects && Array.isArray((sanityProjects as any).result)) {
                    rawData = (sanityProjects as any).result;
                }

                // Transform Sanity data to match Project interface
                const mappedProjects: Project[] = (rawData || []).map((p) => ({
                    id: p.slug,
                    title: p.title,
                    description: p.description || '',
                    techStack: p.techStack || [],
                    status: (p.status || 'In Development') as Project['status'],
                    thumbnail: p.heroImage ? `${p.heroImage}?auto=format&w=1920&q=90` : 'ri-code-s-slash-line',
                    videoFile: p.heroVideoFile,
                    video: p.heroVideoUrl,
                    projectType: p.projectType,
                    timeline: p.timeline,
                    liveUrl: p.liveUrl,
                    sortOrder: p.sortOrder
                }));

                // Apply manual sorting priority
                const sortedProjects = [...mappedProjects].sort((a, b) => {
                    // 1. Sanity sortOrder takes ultimate priority
                    if (typeof a.sortOrder === 'number' && typeof b.sortOrder === 'number') {
                        return a.sortOrder - b.sortOrder;
                    }
                    if (typeof a.sortOrder === 'number') return -1;
                    if (typeof b.sortOrder === 'number') return 1;

                    // 2. Fallback to the hardcoded list sequence
                    const indexA = PROJECT_TITLE_ORDER.indexOf(a.title.toLowerCase());
                    const indexB = PROJECT_TITLE_ORDER.indexOf(b.title.toLowerCase());

                    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                    if (indexA !== -1) return -1;
                    if (indexB !== -1) return 1;

                    return 0; // Maintain original creation date sort from query
                });

                const currentActiveId = get().activeProjectId;
                const activeProjectExists = sortedProjects.some(p => p.id === currentActiveId);

                // Re-calculate the best active ID and Index
                const newActiveId = activeProjectExists ? currentActiveId : (sortedProjects[0]?.id || '');
                const newActiveIndex = activeProjectExists
                    ? sortedProjects.findIndex(p => p.id === currentActiveId)
                    : 0;

                set({
                    projects: sortedProjects,
                    activeProjectId: newActiveId,
                    activeProjectIndex: newActiveIndex,
                    isLoading: false,
                    error: null
                });
            },

            fetchProjects: async () => {
                set({ isLoading: true });
                try {
                    const { language } = get();
                    const sanityProjects = await client.fetch(PROJECTS_QUERY, { language });
                    get().setProjects(sanityProjects as SanityProjectRaw[]);
                    // Auto-trigger preload after fetching
                    get().preloadHeroAssets();
                } catch (err) {
                    console.error('Failed to fetch projects:', err);
                    set({ error: 'Failed to sync with Cortex', isLoading: false });
                }
            },

            preloadHeroAssets: () => {
                const { projects } = get();
                projects.forEach((p) => {
                    // Preload hero images
                    if (p.thumbnail?.startsWith('http') || p.thumbnail?.startsWith('/')) {
                        const img = new Image();
                        img.src = p.thumbnail;
                    }
                    // Preload video poster frames by triggering a prefetch link
                    const videoUrl = p.videoFile || p.video;
                    if (videoUrl) {
                        const link = document.createElement('link');
                        link.rel = 'prefetch';
                        link.href = videoUrl;
                        link.as = 'video';
                        document.head.appendChild(link);
                    }
                });
            },

            setActiveProject: (id) => {
                const { projects } = get();
                const index = projects.findIndex(p => p.id === id);
                set({
                    activeProjectId: id,
                    activeProjectIndex: index === -1 ? 0 : index
                });
            },

            setActiveProjectIndex: (index) => {
                const { projects } = get();
                const project = projects[index];
                set({
                    activeProjectIndex: index,
                    activeProjectId: project?.id || ''
                });
            },

            setFilter: (filter) => set({ filter }),

            setLanguage: (lang) => {
                set({ language: lang });
                if (typeof window !== 'undefined') {
                    localStorage.setItem('cyber-neuro-language', lang);
                }
                get().fetchProjects();
            },

            nextProject: () => {
                const { projects, activeProjectId } = get();
                if (!projects.length) return;
                const currentIndex = projects.findIndex(p => p.id === activeProjectId);
                const nextIndex = (currentIndex + 1) % projects.length;
                set({ activeProjectId: projects[nextIndex].id });
            },

            prevProject: () => {
                const { projects, activeProjectId } = get();
                if (!projects.length) return;
                const currentIndex = projects.findIndex(p => p.id === activeProjectId);
                const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
                set({ activeProjectId: projects[prevIndex].id });
            },

            getActiveProject: () => {
                const { projects, activeProjectId } = get();
                return projects.find(p => p.id === activeProjectId);
            }
        }),
        {
            name: 'cyber-neuro-projects',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                projects: state.projects,
                activeProjectId: state.activeProjectId,
                activeProjectIndex: state.activeProjectIndex,
                language: state.language
            }),
        }
    )
);
