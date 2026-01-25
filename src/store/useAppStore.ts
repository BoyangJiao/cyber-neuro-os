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
// Glitch Effect Settings - 赛博故障效果配置
// ============================================================
export interface GlitchSettings {
    enabled: boolean;
    masterIntensity: number;      // 0-1 overall intensity multiplier
    rgbSplit: number;             // RGB 通道分离
    vertexDisplacement: number;   // 顶点位移抖动
    glitchBands: number;          // 水平故障带
    flickerBands: number;         // 闪烁高亮带
    colorInvert: number;          // 颜色反转区域
    strobe: number;               // 频闪效果
    noiseOverlay: number;         // 噪点覆盖
    scanlineVariation: number;    // 不规则扫描线
}

const defaultGlitchSettings: GlitchSettings = {
    enabled: true,
    masterIntensity: 0.27,
    rgbSplit: 0.3,
    vertexDisplacement: 0.05,
    glitchBands: 0.4,
    flickerBands: 0.3,
    colorInvert: 0,
    strobe: 0,
    noiseOverlay: 0.2,
    scanlineVariation: 0.5,
};

// ============================================================
// Transition Glitch Settings - Mission Briefing 切换效果配置
// ============================================================
export interface TransitionGlitchSettings {
    enabled: boolean;
    rgbSplit: number;          // 0-30 px
    skewAngle: number;         // 0-20 deg
    displacement: number;      // 0-30 px
    flickerIntensity: number;  // 0-1
    sliceAmount: number;       // 0-1
    duration: number;          // 100-800 ms
    hueRotate: number;         // 0-180 deg - 色调旋转
    colorInvert: number;       // 0-1 - 颜色反转
    saturate: number;          // 0.5-2 - 饱和度
}

const defaultTransitionGlitchSettings: TransitionGlitchSettings = {
    enabled: false, // 默认使用平滑过渡，glitch 可通过 Debug Panel 启用
    rgbSplit: 10,
    skewAngle: 8,
    displacement: 12,
    flickerIntensity: 0.7,
    sliceAmount: 0.5,
    duration: 400,
    hueRotate: 30,
    colorInvert: 0.3,
    saturate: 1.2,
};

// ============================================================
// Cyber RGB Effect Settings - 赛博色彩效果配置
// ============================================================
export interface CyberRgbSettings {
    enabled: boolean;
    // Color Settings
    colorCount: 2 | 3;            // 2 or 3 color gradient
    colorA: string;               // hex color e.g. "#00ffff"
    colorB: string;               // hex color e.g. "#ff00ff"
    colorC: string;               // hex color e.g. "#ffff00"
    colorSpeed: number;           // 0-1 color transition speed
    colorMixIntensity: number;    // 0-1 how much cyber color overrides base
    // Scanline Settings
    scanlineSpeed: number;        // 0-1
    scanlineWidth: number;        // 0-1 (thin to thick)
    scanlineDirection: 'horizontal' | 'vertical' | 'both';
}

const defaultCyberRgbSettings: CyberRgbSettings = {
    enabled: true,
    colorCount: 3,
    colorA: '#00ffff',
    colorB: '#ff00ff',
    colorC: '#ffff00',
    colorSpeed: 0.19,
    colorMixIntensity: 0.67,
    scanlineSpeed: 0.53,
    scanlineWidth: 0.64,
    scanlineDirection: 'vertical',
};

// ============================================================
// LocalStorage persistence
// ============================================================
const GLITCH_SETTINGS_KEY = 'cyber-glitch-settings';
const CYBER_RGB_SETTINGS_KEY = 'cyber-rgb-settings';
const TRANSITION_GLITCH_SETTINGS_KEY = 'cyber-transition-glitch-settings';

const loadSavedGlitchSettings = (): GlitchSettings => {
    try {
        const saved = localStorage.getItem(GLITCH_SETTINGS_KEY);
        if (saved) {
            return { ...defaultGlitchSettings, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.warn('Failed to load glitch settings:', e);
    }
    return { ...defaultGlitchSettings };
};

const loadSavedCyberRgbSettings = (): CyberRgbSettings => {
    try {
        const saved = localStorage.getItem(CYBER_RGB_SETTINGS_KEY);
        if (saved) {
            return { ...defaultCyberRgbSettings, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.warn('Failed to load cyber RGB settings:', e);
    }
    return { ...defaultCyberRgbSettings };
};

const loadSavedTransitionGlitchSettings = (): TransitionGlitchSettings => {
    try {
        const saved = localStorage.getItem(TRANSITION_GLITCH_SETTINGS_KEY);
        if (saved) {
            return { ...defaultTransitionGlitchSettings, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.warn('Failed to load transition glitch settings:', e);
    }
    return { ...defaultTransitionGlitchSettings };
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
    // Glitch Settings
    glitchSettings: GlitchSettings;
    setGlitchSetting: <K extends keyof GlitchSettings>(key: K, value: GlitchSettings[K]) => void;
    resetGlitchSettings: () => void;
    saveGlitchSettings: () => void;
    // Cyber RGB Settings
    cyberRgbSettings: CyberRgbSettings;
    setCyberRgbSetting: <K extends keyof CyberRgbSettings>(key: K, value: CyberRgbSettings[K]) => void;
    resetCyberRgbSettings: () => void;
    saveCyberRgbSettings: () => void;
    // Transition Glitch Settings
    transitionGlitchSettings: TransitionGlitchSettings;
    setTransitionGlitchSetting: <K extends keyof TransitionGlitchSettings>(key: K, value: TransitionGlitchSettings[K]) => void;
    resetTransitionGlitchSettings: () => void;
    saveTransitionGlitchSettings: () => void;
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
    // Glitch Settings
    glitchSettings: loadSavedGlitchSettings(),
    setGlitchSetting: (key, value) => set((state) => ({
        glitchSettings: { ...state.glitchSettings, [key]: value }
    })),
    resetGlitchSettings: () => set({ glitchSettings: { ...defaultGlitchSettings } }),
    saveGlitchSettings: () => {
        const state = useAppStore.getState();
        try {
            localStorage.setItem(GLITCH_SETTINGS_KEY, JSON.stringify(state.glitchSettings));
        } catch (e) {
            console.warn('Failed to save glitch settings:', e);
        }
    },
    // Cyber RGB Settings
    cyberRgbSettings: loadSavedCyberRgbSettings(),
    setCyberRgbSetting: (key, value) => set((state) => ({
        cyberRgbSettings: { ...state.cyberRgbSettings, [key]: value }
    })),
    resetCyberRgbSettings: () => set({ cyberRgbSettings: { ...defaultCyberRgbSettings } }),
    saveCyberRgbSettings: () => {
        const state = useAppStore.getState();
        try {
            localStorage.setItem(CYBER_RGB_SETTINGS_KEY, JSON.stringify(state.cyberRgbSettings));
        } catch (e) {
            console.warn('Failed to save cyber RGB settings:', e);
        }
    },
    // Transition Glitch Settings
    transitionGlitchSettings: loadSavedTransitionGlitchSettings(),
    setTransitionGlitchSetting: (key, value) => set((state) => ({
        transitionGlitchSettings: { ...state.transitionGlitchSettings, [key]: value }
    })),
    resetTransitionGlitchSettings: () => set({ transitionGlitchSettings: { ...defaultTransitionGlitchSettings } }),
    saveTransitionGlitchSettings: () => {
        const state = useAppStore.getState();
        try {
            localStorage.setItem(TRANSITION_GLITCH_SETTINGS_KEY, JSON.stringify(state.transitionGlitchSettings));
        } catch (e) {
            console.warn('Failed to save transition glitch settings:', e);
        }
    },
}));
