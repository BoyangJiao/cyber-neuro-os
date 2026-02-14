import { create } from 'zustand';
import { client } from '../sanity/client';
import { PROJECTS_QUERY } from '../sanity/queries';
import { projects as mockProjects, type Project } from '../data/projects';
import type { SanityProjectRaw } from '../sanity/types';

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

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: mockProjects, // Start with mock, replace with Sanity data if available
    activeProjectId: mockProjects[0]?.id || '',
    activeProjectIndex: 0,
    filter: 'ALL',
    language: getInitialLanguage(),
    isLoading: false,
    error: null,

    fetchProjects: async () => {
        set({ isLoading: true });
        try {
            const { language } = get();
            const sanityProjects = await client.fetch(PROJECTS_QUERY, { language });

            // Transform Sanity data to match Project interface
            const mappedProjects: Project[] = (sanityProjects as SanityProjectRaw[]).map((p) => ({
                id: p.slug,
                title: p.title,
                description: p.description || '',
                techStack: p.techStack || [],
                status: p.status || 'In Development',
                thumbnail: p.heroImage || 'ri-code-s-slash-line',
                projectType: p.projectType,
                timeline: p.timeline,
                liveUrl: p.liveUrl
            }));

            // Only update store if we actually got projects so we don't wipe the mock data with nothing
            if (mappedProjects.length > 0) {
                // Check if current active project exists in the new list
                const currentActiveId = get().activeProjectId;
                const activeProjectExists = mappedProjects.some(p => p.id === currentActiveId);

                // If it exists (Seamless Switch for Same-Slug), keep it. 
                // Otherwise default to first one.
                const newActiveId = activeProjectExists ? currentActiveId : mappedProjects[0].id;

                set({
                    projects: mappedProjects,
                    activeProjectId: newActiveId,
                    isLoading: false
                });
            } else {
                set({ isLoading: false });
            }

        } catch (err) {
            console.error('Failed to fetch projects:', err);
            set({ error: 'Failed to sync with Cortex', isLoading: false });
        }
    },

    setActiveProject: (id) => set({ activeProjectId: id }),

    setActiveProjectIndex: (index) => set({ activeProjectIndex: index }),

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
}));
