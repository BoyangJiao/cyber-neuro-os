import { create } from 'zustand';

interface AppState {
    isBootSequenceActive: boolean;
    setBootSequence: (active: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    isBootSequenceActive: true,
    setBootSequence: (active) => set({ isBootSequenceActive: active }),
}));
