import { useState } from 'react';
import { HoloFrame } from './HoloFrame';
import { CyberButton } from './CyberButton';
import { NeuralLogo3D } from './NeuralLogo3D';
import { MotionDiv } from '../motion/MotionWrappers';
import { useAppStore } from '../../store/useAppStore';
import { useMusicStore } from '../../store/useMusicStore';
import { useLanguage } from '../../i18n';
import { useTranslation } from '../../i18n';
import type { Language } from '../../i18n';
import type { BrandTheme } from '../../store/useAppStore';

interface LanguageOption {
    code: Language;
    label: string;
    labelNative: string;
}

interface ThemeOption {
    code: BrandTheme;
    label: string;
    color: string;
}

const languages: LanguageOption[] = [
    { code: 'en', label: 'English', labelNative: 'EN' },
    { code: 'zh', label: '中文', labelNative: '中' },
];

const themes: ThemeOption[] = [
    { code: 'cyan', label: '赛博青', color: '#00F0FF' },
    { code: 'green', label: '赛博绿', color: '#00ff88' },
    { code: 'red', label: '赛博红', color: '#FF0055' },
];

export const SettingsModal = () => {
    const [activeTab, setActiveTab] = useState<'about' | 'appearance' | 'audio'>('about');
    const { setSettingsOpen, debugMode, setDebugMode, is3DMode, set3DMode, brandTheme, setBrandTheme, sfxVolume, setSfxVolume } = useAppStore();
    const { volume, setVolume } = useMusicStore();
    const { language, setLanguage } = useLanguage();
    const { t } = useTranslation();

    return (
        <MotionDiv
            className="fixed inset-0 z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, ease: "circOut" }}
        >
            {/* Backdrop for the "Force Field Bubble" effect */}
            <div
                className="absolute inset-0 bg-[var(--color-bg-overlay)] backdrop-blur-[2px]"
                onClick={() => setSettingsOpen(false)}
            />

            {/* Modal Container */}
            <MotionDiv
                className="relative w-[90vw] max-w-[420px] 2xl:max-w-[560px]"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "circOut" }}
            >
                <HoloFrame
                    variant="dots"
                    className="relative flex flex-col h-[min(70vh,520px)] 2xl:h-[min(75vh,720px)] min-h-[420px] 2xl:min-h-[580px]"
                    active={true}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-5 bg-[var(--color-brand-primary)] shadow-[0_0_10px_var(--color-brand-primary)]" />
                            <h2 className="text-base font-bold text-[var(--color-brand-secondary)] tracking-[0.3em] uppercase">
                                {t('settings.title')}
                            </h2>
                        </div>
                        <CyberButton
                            variant="ghost"
                            size="sm"
                            iconOnly
                            onClick={() => setSettingsOpen(false)}
                            className="text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]"
                        >
                            <i className="ri-close-line text-xl" />
                        </CyberButton>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex border-b border-[var(--color-border-subtle)]/50 mb-6 overflow-x-auto scrollbar-hide">
                        {(['about', 'appearance', 'audio'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 px-2 text-[10px] sm:text-xs 2xl:text-sm font-bold tracking-widest uppercase transition-all duration-300 whitespace-nowrap border-b-2 ${activeTab === tab
                                    ? 'text-[var(--color-brand-primary)] border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10'
                                    : 'text-[var(--color-text-secondary)] border-transparent hover:text-[var(--color-text-primary)] hover:bg-black/20'
                                    }`}
                            >
                                {t(`settings.tabs.${tab}`)}
                            </button>
                        ))}
                    </div>

                    {/* Scrollable Tab Content Area */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0">

                        {/* About Content */}
                        {activeTab === 'about' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

                                {/* ── Overview ── */}
                                <div className="flex flex-col items-center text-center gap-3">
                                    {/* Personal Logo — 3D Neural Core */}
                                    <NeuralLogo3D size={120} className="2xl:!w-[180px] 2xl:!h-[180px]" />

                                    {/* System Name + Version */}
                                    <div>
                                        <p className="text-sm font-display font-bold tracking-[0.25em] text-[var(--color-brand-primary)] uppercase">
                                            BOYANG NEURO.OS
                                        </p>
                                        <p className="text-[10px] font-mono text-[var(--color-text-subtle)] tracking-widest mt-1">
                                            v1.2.0-rc1 · BUILD 2026.02.25
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs font-mono text-[var(--color-text-secondary)] leading-relaxed max-w-[300px] opacity-80">
                                        {language === 'zh'
                                            ? '一个完全模拟 Boyang 大脑内神经系统的数字图形界面。'
                                            : 'A digital graphical interface that fully simulates the neural system inside Boyang\'s brain.'}
                                    </p>
                                </div>

                                {/* ── Architect ── */}
                                <div className="border-t border-[var(--color-text-subtle)]/20 pt-4 space-y-3">
                                    {/* Core */}
                                    <p className="text-[10px] font-mono text-[var(--color-text-secondary)] leading-relaxed tracking-wider">
                                        <span className="text-[var(--color-brand-primary)] font-semibold">CORE</span>
                                        <span className="mx-2 text-[var(--color-text-subtle)]">//</span>
                                        {language === 'zh'
                                            ? '本系统核心代码库由人类架构师与 AI 逻辑引擎共同编译构建。'
                                            : 'The core codebase is co-compiled by a human architect and an AI logic engine.'}
                                    </p>

                                    {/* Visual Assets */}
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-mono text-[var(--color-brand-primary)] font-semibold tracking-wider">
                                            VISUAL ASSETS
                                        </p>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                            {[
                                                { icon: 'ri-sparkling-2-line', label: 'Generative AI' },
                                                { icon: 'ri-box-3-line', label: language === 'zh' ? '个人 3D 渲染' : 'Personal 3D Renders' },
                                                { icon: 'ri-open-source-line', label: language === 'zh' ? '开源 3D 模型' : 'Open-Source 3D Models' },
                                                { icon: 'ri-shapes-line', label: language === 'zh' ? '自定义 SVG 图形' : 'Custom SVG Graphics' },
                                            ].map((item) => (
                                                <div key={item.label} className="flex items-center gap-1.5">
                                                    <i className={`${item.icon} text-[10px] text-[var(--color-brand-primary)]/50`} />
                                                    <span className="text-[10px] font-mono text-[var(--color-text-secondary)] tracking-wider">{item.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* ── Legal ── */}
                                <div className="border-t border-[var(--color-text-subtle)]/20 pt-3 space-y-1 text-center">
                                    <p className="text-[9px] font-mono text-[var(--color-text-subtle)] tracking-widest uppercase">
                                        © 2026 Boyang Jiao. All Rights Reserved.
                                    </p>
                                    <p className="text-[9px] font-mono text-[var(--color-text-subtle)]/60 leading-relaxed">
                                        {language === 'zh'
                                            ? '未经授权，禁止将本脑机接口数据用于个人或商业克隆。'
                                            : 'Unauthorized use of this neural interface data for personal or commercial cloning is prohibited.'}
                                    </p>
                                </div>

                            </div>
                        )}

                        {/* Appearance Settings Content (Merged System & Visual) */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {/* Language Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <i className="ri-global-line text-[var(--color-brand-primary)]/60" />
                                        <span className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-widest uppercase">
                                            {t('settings.language')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[var(--color-text-secondary)]/80 mb-3">
                                        {t('settings.languageDesc')}
                                    </p>

                                    <div className="flex gap-2">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => setLanguage(lang.code)}
                                                className={`
                                            relative flex-1 py-3 px-4 
                                            border transition-all duration-300
                                            group overflow-hidden
                                            ${language === lang.code
                                                        ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/20 text-[var(--color-text-primary)]'
                                                        : 'border-[var(--color-text-secondary)]/30 bg-[var(--color-text-brand)]/5 text-[var(--color-text-brand)] hover:border-[var(--color-brand-primary)]/60 hover:text-[var(--color-text-primary)]'
                                                    }
                                        `}
                                            >
                                                {language === lang.code && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand-primary)]/10 via-[var(--color-brand-secondary)]/20 to-[var(--color-brand-primary)]/10" />
                                                )}
                                                <div className="relative z-10 flex flex-col items-center gap-1">
                                                    <span className="text-lg font-bold tracking-wider">{lang.labelNative}</span>
                                                    <span className="text-[10px] tracking-widest uppercase opacity-70">{lang.label}</span>
                                                </div>
                                                {language === lang.code && (
                                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[var(--color-brand-secondary)] shadow-[0_0_8px_var(--color-brand-primary)]" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Theme Section */}
                                <div className="border-t border-[var(--color-text-subtle)]/30 pt-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <i className="ri-palette-line text-[var(--color-brand-primary)]/60" />
                                        <span className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-widest uppercase">
                                            {language === 'zh' ? '品牌主题' : 'BRAND THEME'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[var(--color-text-secondary)]/80 mb-3">
                                        {language === 'zh' ? '选择你喜欢的赛博主题色' : 'Select your preferred cyber theme color'}
                                    </p>

                                    <div className="flex gap-2">
                                        {themes.map((theme) => (
                                            <button
                                                key={theme.code}
                                                onClick={() => setBrandTheme(theme.code)}
                                                className={`
                                            relative flex-1 py-3 px-2 
                                            border transition-all duration-300
                                            group overflow-hidden
                                            ${brandTheme === theme.code ? 'border-current bg-current/20' : 'border-neutral-700 bg-neutral-900/50 hover:border-neutral-500'}
                                        `}
                                                style={{ color: theme.color, borderColor: brandTheme === theme.code ? theme.color : undefined }}
                                            >
                                                <div className="relative z-10 flex flex-col items-center gap-1">
                                                    <div className="w-6 h-6 border border-white/20" style={{ backgroundColor: theme.color, boxShadow: brandTheme === theme.code ? `0 0 12px ${theme.color}` : 'none' }} />
                                                    <span className="text-[9px] tracking-widest uppercase mt-1" style={{ color: brandTheme === theme.code ? theme.color : '#888' }}>
                                                        {theme.label}
                                                    </span>
                                                </div>
                                                {brandTheme === theme.code && (
                                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px]" style={{ backgroundColor: theme.color, boxShadow: `0 0 8px ${theme.color}` }} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 3D Mode & Debug Mode Section */}
                                <div className="border-t border-[var(--color-text-subtle)]/30 pt-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <i className="ri-box-3-line text-[var(--color-brand-primary)]/60" />
                                            <span className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-widest uppercase">
                                                {t('settings.mode3d')}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => set3DMode(!is3DMode)}
                                            className={`
                                        w-12 h-6 relative rounded-none border transition-all duration-300
                                        ${is3DMode ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/30' : 'border-[var(--color-text-subtle)]/50 bg-[var(--color-text-subtle)]/10'}
                                    `}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-[var(--color-brand-secondary)] transition-all duration-300 ${is3DMode ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <i className="ri-bug-line text-[var(--color-brand-primary)]/60" />
                                            <span className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-widest uppercase">
                                                DEBUG MODE
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => setDebugMode(!debugMode)}
                                            className={`
                                        w-12 h-6 relative rounded-none border transition-all duration-300
                                        ${debugMode
                                                    ? 'border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/30'
                                                    : 'border-[var(--color-text-subtle)]/50 bg-[var(--color-text-subtle)]/10'
                                                }
                                    `}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-[var(--color-brand-secondary)] transition-all duration-300 ${debugMode ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Audio Settings Content */}
                        {activeTab === 'audio' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <i className="ri-volume-up-line text-[var(--color-brand-primary)]/60" />
                                        <span className="text-xs font-semibold text-[var(--color-text-secondary)] tracking-widest uppercase">
                                            OUTPUT CHANNELS
                                        </span>
                                    </div>

                                    {/* Music Volume */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider">
                                            <span>MUSIC BROADCAST</span>
                                            <span>{Math.round(volume)}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={volume}
                                            onChange={(e) => setVolume(Number(e.target.value))}
                                            className="w-full h-4 appearance-none cursor-pointer outline-none bg-transparent slider-thumb-cyber"
                                        />
                                    </div>

                                    {/* SFX Volume */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider">
                                            <span>SYSTEM EFFECTS</span>
                                            <span>{Math.round(sfxVolume)}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={sfxVolume}
                                            onChange={(e) => setSfxVolume(Number(e.target.value))}
                                            className="w-full h-4 appearance-none cursor-pointer outline-none bg-transparent slider-thumb-cyber"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>{/* end scrollable content area */}
                </HoloFrame>
            </MotionDiv>
        </MotionDiv>
    );
};
