import { create } from 'zustand';

export type GeometryType = 'project' | 'video' | 'game' | 'sound' | 'music' | 'lab';

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
    // Debug Mode
    debugMode: boolean;
    setDebugMode: (mode: boolean) => void;
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
}

export const useAppStore = create<AppState>((set) => ({
    isBootSequenceActive: false,
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
    // Debug Mode
    debugMode: false,
    setDebugMode: (mode) => set({ debugMode: mode }),
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
}));
