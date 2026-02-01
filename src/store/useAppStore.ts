import { create } from 'zustand';

export type GeometryType = 'project' | 'video' | 'game' | 'sound' | 'music' | 'lab';

// ============================================================
// Theme Settings - 主题品牌色配置
// ============================================================
export type BrandTheme = 'cyan' | 'green' | 'red';

const THEME_SETTINGS_KEY = 'cyber-brand-theme';

const loadSavedTheme = (): BrandTheme => {
    try {
        const saved = localStorage.getItem(THEME_SETTINGS_KEY);
        if (saved && ['cyan', 'green', 'red'].includes(saved)) {
            return saved as BrandTheme;
        }
    } catch (e) {
        console.warn('Failed to load theme setting:', e);
    }
    return 'cyan'; // Default theme
};

// ============================================================
// App State
// ============================================================
interface AppState {
    isBootSequenceActive: boolean;
    setBootSequence: (active: boolean) => void;
    isAboutMeOpen: boolean;
    setAboutMeOpen: (open: boolean) => void;
    isSettingsOpen: boolean;
    setSettingsOpen: (open: boolean) => void;
    isAvatarScanning: boolean;
    startAvatarScan: () => void;
    // Theme
    brandTheme: BrandTheme;
    setBrandTheme: (theme: BrandTheme) => void;
    // Debug Mode
    debugMode: boolean;
    setDebugMode: (mode: boolean) => void;
    // 3D Mode
    is3DMode: boolean;
    set3DMode: (mode: boolean) => void;

    debugGeometryType: GeometryType;
    setDebugGeometryType: (type: GeometryType) => void;

    // Audio Settings
    sfxVolume: number;
    setSfxVolume: (volume: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
    isBootSequenceActive: typeof window !== 'undefined' && window.location.pathname === '/',
    setBootSequence: (active) => set({ isBootSequenceActive: active }),
    isAboutMeOpen: false,
    setAboutMeOpen: (open) => set({ isAboutMeOpen: open }),
    isSettingsOpen: false,
    setSettingsOpen: (open) => set({ isSettingsOpen: open }),
    isAvatarScanning: false,
    startAvatarScan: () => {
        set({ isAvatarScanning: true });
        setTimeout(() => {
            set({ isAvatarScanning: false, isAboutMeOpen: true });
        }, 350);
    },
    // Theme
    brandTheme: loadSavedTheme(),
    setBrandTheme: (theme) => {
        set({ brandTheme: theme });
        try {
            localStorage.setItem(THEME_SETTINGS_KEY, theme);
            document.documentElement.setAttribute('data-theme', theme);
        } catch (e) {
            console.warn('Failed to save theme setting:', e);
        }
    },
    // Debug Mode
    debugMode: false,
    setDebugMode: (mode) => set({ debugMode: mode }),
    // 3D Mode
    is3DMode: false,
    set3DMode: (mode) => set({ is3DMode: mode }),
    debugGeometryType: 'project',
    setDebugGeometryType: (type) => set({ debugGeometryType: type }),

    // Audio Settings
    sfxVolume: 50,
    setSfxVolume: (vol) => set({ sfxVolume: Math.max(0, Math.min(100, vol)) }),
}));
