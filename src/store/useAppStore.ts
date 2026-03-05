import { create } from 'zustand';

export type GeometryType = 'project' | 'video' | 'game' | 'sound' | 'music' | 'lab';

// ============================================================
// Theme Settings - 主题品牌色配置
// ============================================================
export type BrandTheme = 'cyan' | 'green' | 'red';

const THEME_SETTINGS_KEY = 'cyber-brand-theme';
const DEEPDIVE_SETTINGS_KEY = 'cyber-deepdive-mode';

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
    setAboutMeOpen: (isOpen: boolean) => void;

    // Character Stats Panel details
    isCharacterStatsOpen: boolean;
    setCharacterStatsOpen: (isOpen: boolean) => void;
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
    // DeepDive Mode (particle space)
    isDeepDiveMode: boolean;
    setDeepDiveMode: (mode: boolean) => void;

    debugGeometryType: GeometryType;
    setDebugGeometryType: (type: GeometryType) => void;

    // Particle Field — Nav ↔ Particle communication
    activeNodeId: string | null;
    setActiveNodeId: (id: string | null) => void;

    // Feature Panel navigation
    featureActiveIndex: number;
    setFeatureActiveIndex: (index: number) => void;

    // Audio Settings
    sfxVolume: number;
    setSfxVolume: (volume: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
    isBootSequenceActive: typeof window !== 'undefined' && window.location.pathname === '/',
    setBootSequence: (active) => set({ isBootSequenceActive: active }),
    isAboutMeOpen: false,
    setAboutMeOpen: (isOpen) => set({ isAboutMeOpen: isOpen }),

    isCharacterStatsOpen: false,
    setCharacterStatsOpen: (isOpen) => set({ isCharacterStatsOpen: isOpen }),
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
    // DeepDive Mode — persisted
    isDeepDiveMode: (() => { try { return localStorage.getItem(DEEPDIVE_SETTINGS_KEY) === 'true'; } catch { return false; } })(),
    setDeepDiveMode: (mode) => {
        set({ isDeepDiveMode: mode });
        try { localStorage.setItem(DEEPDIVE_SETTINGS_KEY, String(mode)); } catch { }
        document.body.classList.toggle('deepdive-mode', mode);
    },
    debugGeometryType: 'project',
    setDebugGeometryType: (type) => set({ debugGeometryType: type }),

    // Particle Field
    activeNodeId: null,
    setActiveNodeId: (id) => set({ activeNodeId: id }),

    // Feature Panel navigation
    featureActiveIndex: 0,
    setFeatureActiveIndex: (index) => set({ featureActiveIndex: index }),

    // Audio Settings
    sfxVolume: 20,
    setSfxVolume: (vol) => set({ sfxVolume: Math.max(0, Math.min(100, vol)) }),
}));
