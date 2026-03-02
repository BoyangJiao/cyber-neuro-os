import { AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { HoloFrame } from '../HoloFrame';
import { MotionDiv } from '../../motion/MotionWrappers';
import { NeuroButton } from '../buttons/NeuroButton';
import { useTranslation } from '../../../i18n';

interface InterceptModalProps {
    isOpen: boolean;
    onClose: () => void;
    moduleName: string | null;
}

export const InterceptModal = ({ isOpen, onClose, moduleName }: InterceptModalProps) => {
    const { t } = useTranslation();

    const translatedMessage = t('intercept.message').replace('{{moduleName}}', moduleName?.toUpperCase() || 'VISION');

    // Portal rendering to ensure full-screen backdrop regardless of parent container constraints
    const renderModal = () => (
        <AnimatePresence>
            {isOpen && (
                <MotionDiv
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-[var(--color-bg-overlay)] backdrop-blur-[2px]"
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <MotionDiv
                        className="relative w-full max-w-[420px] [--color-brand-primary:var(--color-red-500)] [--color-brand-secondary:var(--color-red-900)] [--color-brand-glow:rgba(255,0,85,0.6)]"
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "circOut" }}
                    >
                        <HoloFrame variant="dots" active={true} filled={true} className="p-0 border border-red-500/20 shadow-[0_0_30px_rgba(255,0,85,0.15)] flex flex-col">
                            {/* Top Striped Border */}
                            <div className="w-full px-6 pt-6">
                                <div className="w-full relative h-[22px]">
                                    {/* Thick diagonal stripes without the solid bounding line */}
                                    <div
                                        className="absolute inset-0 opacity-80"
                                        style={{
                                            backgroundImage: 'linear-gradient(45deg, var(--color-red-600) 25%, transparent 25%, transparent 50%, var(--color-red-600) 50%, var(--color-red-600) 75%, transparent 75%, transparent)',
                                            backgroundSize: '16px 16px',
                                            maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                                            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex flex-col items-center justify-center py-8 px-8 text-center space-y-6">

                                {/* Warning Icon & Label */}
                                <div className="flex flex-col items-center gap-2">
                                    <i className="ri-alert-line text-[72px] text-red-500 drop-shadow-[0_0_12px_rgba(255,0,85,0.8)]" />
                                    <span className="text-red-500 text-sm font-bold tracking-[0.2em] font-mono shadow-red-500 drop-shadow-[0_0_8px_rgba(255,0,85,0.8)]">
                                        {t('intercept.warning')}
                                    </span>
                                </div>

                                {/* Main Message */}
                                <p className="text-red-500 text-sm font-mono tracking-wider leading-relaxed py-4">
                                    {translatedMessage}
                                </p>

                                {/* Exit Button using NeuroButton (dot button style) */}
                                <div className="pt-2 pb-2">
                                    {/* Wrapper to override text colors specifically for this button */}
                                    <div className="[--color-text-brand:var(--color-red-500)] [--color-text-accent:#fff]">
                                        <NeuroButton onClick={onClose} size="md" className="px-8 min-w-[140px]">
                                            {t('intercept.exit')}
                                        </NeuroButton>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Striped Border */}
                            <div className="w-full px-6 pb-6">
                                <div className="w-full relative h-[22px]">
                                    {/* Thick diagonal stripes without the solid bounding line */}
                                    <div
                                        className="absolute inset-0 opacity-80"
                                        style={{
                                            backgroundImage: 'linear-gradient(45deg, var(--color-red-600) 25%, transparent 25%, transparent 50%, var(--color-red-600) 50%, var(--color-red-600) 75%, transparent 75%, transparent)',
                                            backgroundSize: '16px 16px',
                                            maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                                            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
                                        }}
                                    />
                                </div>
                            </div>
                        </HoloFrame>
                    </MotionDiv>
                </MotionDiv>
            )}
        </AnimatePresence>
    );

    // Provide a fallback if document isn't available (e.g. initial SSR render if there was one)
    if (typeof document !== 'undefined') {
        return createPortal(renderModal(), document.body);
    }

    return null;
};
