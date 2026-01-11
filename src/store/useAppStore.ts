import { create } from 'zustand';

interface AppState {
    isBootSequenceActive: boolean;
    setBootSequence: (active: boolean) => void;
    isAboutMeOpen: boolean;
    setAboutMeOpen: (open: boolean) => void;
    isSettingsOpen: boolean;
    setSettingsOpen: (open: boolean) => void;
    isAvatarScanning: boolean;
    startAvatarScan: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    isBootSequenceActive: false, // Set to true for production
    setBootSequence: (active) => set({ isBootSequenceActive: active }),
    isAboutMeOpen: false,
    setAboutMeOpen: (open) => set({ isAboutMeOpen: open }),
    isSettingsOpen: false,
    setSettingsOpen: (open) => set({ isSettingsOpen: open }),
    isAvatarScanning: false,
    startAvatarScan: () => {
        set({ isAvatarScanning: true });
        // 扫描动画 350ms 后打开页面（等待 300ms 扫描线动画完成 + 50ms 缓冲）
        setTimeout(() => {
            set({ isAvatarScanning: false, isAboutMeOpen: true });
        }, 350);
    },
}));
