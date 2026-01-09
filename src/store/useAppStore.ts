import { create } from 'zustand';

interface AppState {
    isBootSequenceActive: boolean;
    setBootSequence: (active: boolean) => void;
    isAboutMeOpen: boolean;
    setAboutMeOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    isBootSequenceActive: false, // Set to true for production
    setBootSequence: (active) => set({ isBootSequenceActive: active }),
    isAboutMeOpen: false,
    setAboutMeOpen: (open) => set({ isAboutMeOpen: open }),
}));

