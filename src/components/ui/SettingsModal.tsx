import { HoloFrame } from './HoloFrame';
import { CyberButton } from './CyberButton';
import { MotionDiv } from '../motion/MotionWrappers';
import { useAppStore } from '../../store/useAppStore';
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
    const { setSettingsOpen, debugMode, setDebugMode, brandTheme, setBrandTheme } = useAppStore();
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
                className="relative w-[90vw] max-w-[400px]"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "circOut" }}
            >
                <HoloFrame
                    variant="dots"
                    className="relative"
                    active={true}
                // 'dots' variant already applies backdrop-blur-md and bg-black/60
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

                    {/* Settings Content */}
                    <div className="space-y-6">
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

                            {/* Language Toggle */}
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
                                        {/* Glow effect for active */}
                                        {language === lang.code && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand-primary)]/10 via-[var(--color-brand-secondary)]/20 to-[var(--color-brand-primary)]/10" />
                                        )}

                                        {/* Corner dots */}
                                        <div className={`absolute top-0 left-0 w-[2px] h-[2px] ${language === lang.code ? 'bg-[var(--color-brand-secondary)]' : 'bg-[var(--color-text-subtle)]'}`} />
                                        <div className={`absolute top-0 right-0 w-[2px] h-[2px] ${language === lang.code ? 'bg-[var(--color-brand-secondary)]' : 'bg-[var(--color-text-subtle)]'}`} />
                                        <div className={`absolute bottom-0 left-0 w-[2px] h-[2px] ${language === lang.code ? 'bg-[var(--color-brand-secondary)]' : 'bg-[var(--color-text-subtle)]'}`} />
                                        <div className={`absolute bottom-0 right-0 w-[2px] h-[2px] ${language === lang.code ? 'bg-[var(--color-brand-secondary)]' : 'bg-[var(--color-text-subtle)]'}`} />

                                        <div className="relative z-10 flex flex-col items-center gap-1">
                                            <span className="text-lg font-bold tracking-wider">
                                                {lang.labelNative}
                                            </span>
                                            <span className="text-[10px] tracking-widest uppercase opacity-70">
                                                {lang.label}
                                            </span>
                                        </div>

                                        {/* Active indicator */}
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
                                    品牌主题
                                </span>
                            </div>
                            <p className="text-xs text-[var(--color-text-secondary)]/80 mb-3">
                                选择你喜欢的赛博主题色
                            </p>

                            {/* Theme Toggle */}
                            <div className="flex gap-2">
                                {themes.map((theme) => (
                                    <button
                                        key={theme.code}
                                        onClick={() => setBrandTheme(theme.code)}
                                        className={`
                                            relative flex-1 py-3 px-4 
                                            border transition-all duration-300
                                            group overflow-hidden
                                            ${brandTheme === theme.code
                                                ? 'border-current bg-current/20'
                                                : 'border-neutral-700 bg-neutral-900/50 hover:border-neutral-500'
                                            }
                                        `}
                                        style={{
                                            color: theme.color,
                                            borderColor: brandTheme === theme.code ? theme.color : undefined,
                                        }}
                                    >
                                        {/* Glow effect for active */}
                                        {brandTheme === theme.code && (
                                            <div
                                                className="absolute inset-0 opacity-20"
                                                style={{ backgroundColor: theme.color }}
                                            />
                                        )}

                                        {/* Corner dots */}
                                        <div
                                            className="absolute top-0 left-0 w-[2px] h-[2px]"
                                            style={{ backgroundColor: brandTheme === theme.code ? theme.color : '#555' }}
                                        />
                                        <div
                                            className="absolute top-0 right-0 w-[2px] h-[2px]"
                                            style={{ backgroundColor: brandTheme === theme.code ? theme.color : '#555' }}
                                        />
                                        <div
                                            className="absolute bottom-0 left-0 w-[2px] h-[2px]"
                                            style={{ backgroundColor: brandTheme === theme.code ? theme.color : '#555' }}
                                        />
                                        <div
                                            className="absolute bottom-0 right-0 w-[2px] h-[2px]"
                                            style={{ backgroundColor: brandTheme === theme.code ? theme.color : '#555' }}
                                        />

                                        <div className="relative z-10 flex flex-col items-center gap-1">
                                            {/* Color swatch */}
                                            <div
                                                className="w-6 h-6 border border-white/20"
                                                style={{
                                                    backgroundColor: theme.color,
                                                    boxShadow: brandTheme === theme.code ? `0 0 12px ${theme.color}` : 'none'
                                                }}
                                            />
                                            <span
                                                className="text-[10px] tracking-widest uppercase mt-1"
                                                style={{ color: brandTheme === theme.code ? theme.color : '#888' }}
                                            >
                                                {theme.label}
                                            </span>
                                        </div>

                                        {/* Active indicator */}
                                        {brandTheme === theme.code && (
                                            <div
                                                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px]"
                                                style={{
                                                    backgroundColor: theme.color,
                                                    boxShadow: `0 0 8px ${theme.color}`
                                                }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Debug Mode Section */}
                        <div className="border-t border-[var(--color-text-subtle)]/30 pt-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <i className="ri-bug-line text-[var(--color-brand-primary)]/60" />
                                    <span className="text-xs font-semibold text-[var(--color-text-subtle)] tracking-widest uppercase">
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
                                    <div
                                        className={`
                                            absolute top-1 w-4 h-4 bg-[var(--color-brand-secondary)] transition-all duration-300
                                            ${debugMode ? 'left-7' : 'left-1'}
                                        `}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </HoloFrame>
            </MotionDiv>
        </MotionDiv>
    );
};
