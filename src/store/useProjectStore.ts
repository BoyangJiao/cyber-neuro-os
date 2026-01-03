import { create } from 'zustand';
import { projects, type Project } from '../data/projects';

interface ProjectState {
    projects: Project[];
    activeProjectId: string;
    filter: 'ALL' | 'WEB3' | 'AI' | 'SYS';

    // Actions
    setActiveProject: (id: string) => void;
    setFilter: (filter: 'ALL' | 'WEB3' | 'AI' | 'SYS') => void;
    nextProject: () => void;
    prevProject: () => void;
    getActiveProject: () => Project | undefined;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: projects,
    activeProjectId: projects[0].id,
    filter: 'ALL',

    setActiveProject: (id) => set({ activeProjectId: id }),

    setFilter: (filter) => set({ filter }),

    nextProject: () => {
        const { projects, activeProjectId } = get();
        const currentIndex = projects.findIndex(p => p.id === activeProjectId);
        const nextIndex = (currentIndex + 1) % projects.length;
        set({ activeProjectId: projects[nextIndex].id });
    },

    prevProject: () => {
        const { projects, activeProjectId } = get();
        const currentIndex = projects.findIndex(p => p.id === activeProjectId);
        const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
        set({ activeProjectId: projects[prevIndex].id });
    },

    getActiveProject: () => {
        const { projects, activeProjectId } = get();
        return projects.find(p => p.id === activeProjectId);
    }
}));
