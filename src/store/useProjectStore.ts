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
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchProjects: () => Promise<void>;
    setActiveProject: (id: string) => void;
    setActiveProjectIndex: (index: number) => void;
    setFilter: (filter: 'ALL' | 'WEB3' | 'AI' | 'SYS') => void;
    nextProject: () => void;
    prevProject: () => void;
    getActiveProject: () => Project | undefined;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: mockProjects, // Start with mock, replace with Sanity data if available
    activeProjectId: mockProjects[0]?.id || '',
    activeProjectIndex: 0,
    filter: 'ALL',
    isLoading: false,
    error: null,

    fetchProjects: async () => {
        set({ isLoading: true });
        try {
            const sanityProjects = await client.fetch(PROJECTS_QUERY);

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
            // (Unless avoiding mock data is desired, but fallback is good for now)
            if (mappedProjects.length > 0) {
                set({
                    projects: mappedProjects,
                    activeProjectId: mappedProjects[0].id,
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
