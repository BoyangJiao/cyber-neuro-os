import { HoloFrame } from './HoloFrame';
import { CyberButton } from './CyberButton';
import { MotionDiv } from '../motion/MotionWrappers';
import { useAppStore } from '../../store/useAppStore';
import { useLanguage } from '../../i18n';
import { useTranslation } from '../../i18n';
import type { Language } from '../../i18n';

interface LanguageOption {
    code: Language;
    label: string;
    labelNative: string;
}

const languages: LanguageOption[] = [
    { code: 'en', label: 'English', labelNative: 'EN' },
    { code: 'zh', label: '中文', labelNative: '中' },
];

export const SettingsModal = () => {
    const { setSettingsOpen, debugMode, setDebugMode } = useAppStore();
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
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
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
                    variant="lines"
                    className="bg-neutral-950 relative overflow-hidden"
                    active={true}
                >
                    {/* Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-[scanline_3s_linear_infinite]" />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-5 bg-cyan-500 shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
                            <h2 className="text-base font-bold text-cyan-400 tracking-[0.3em] uppercase">
                                {t('settings.title')}
                            </h2>
                        </div>
                        <CyberButton
                            variant="ghost"
                            size="sm"
                            iconOnly
                            onClick={() => setSettingsOpen(false)}
                            className="text-cyan-500 hover:text-cyan-300"
                        >
                            <i className="ri-close-line text-xl" />
                        </CyberButton>
                    </div>

                    {/* Settings Content */}
                    <div className="space-y-6">
                        {/* Language Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <i className="ri-global-line text-cyan-600" />
                                <span className="text-xs font-semibold text-cyan-700 tracking-widest uppercase">
                                    {t('settings.language')}
                                </span>
                            </div>
                            <p className="text-xs text-cyan-800 mb-3">
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
                                                ? 'border-cyan-500 bg-cyan-500/20 text-cyan-50'
                                                : 'border-cyan-800/50 bg-cyan-950/30 text-cyan-600 hover:border-cyan-600 hover:text-cyan-400'
                                            }
                                        `}
                                    >
                                        {/* Glow effect for active */}
                                        {language === lang.code && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-cyan-400/20 to-cyan-500/10" />
                                        )}

                                        {/* Corner dots */}
                                        <div className={`absolute top-0 left-0 w-[2px] h-[2px] ${language === lang.code ? 'bg-cyan-400' : 'bg-cyan-700'}`} />
                                        <div className={`absolute top-0 right-0 w-[2px] h-[2px] ${language === lang.code ? 'bg-cyan-400' : 'bg-cyan-700'}`} />
                                        <div className={`absolute bottom-0 left-0 w-[2px] h-[2px] ${language === lang.code ? 'bg-cyan-400' : 'bg-cyan-700'}`} />
                                        <div className={`absolute bottom-0 right-0 w-[2px] h-[2px] ${language === lang.code ? 'bg-cyan-400' : 'bg-cyan-700'}`} />

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
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Debug Mode Section */}
                        <div className="border-t border-cyan-900/30 pt-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <i className="ri-bug-line text-cyan-600" />
                                    <span className="text-xs font-semibold text-cyan-700 tracking-widest uppercase">
                                        DEBUG MODE
                                    </span>
                                </div>
                                <button
                                    onClick={() => setDebugMode(!debugMode)}
                                    className={`
                                        w-12 h-6 relative rounded-none border transition-all duration-300
                                        ${debugMode
                                            ? 'border-cyan-500 bg-cyan-500/30'
                                            : 'border-cyan-800/50 bg-cyan-950/30'
                                        }
                                    `}
                                >
                                    <div
                                        className={`
                                            absolute top-1 w-4 h-4 bg-cyan-400 transition-all duration-300
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
