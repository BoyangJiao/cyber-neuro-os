import { useState, useCallback, useEffect } from 'react';
import { labApps } from '../data/lab';
import { LabAppViewer } from '../components/features/lab/LabAppViewer';
import { useTranslation } from '../i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { MotionDiv } from '../components/motion/MotionWrappers';
import { HoloFrame } from '../components/ui/HoloFrame';
import { CyberButton } from '../components/ui/CyberButton';
import { useNavigate } from 'react-router-dom';

export const LabLandingPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const handleNext = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % labApps.length);
    }, []);

    const handlePrev = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + labApps.length) % labApps.length);
    }, []);

    // Add keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev]);

    const variants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
            }
        },
        exit: (dir: number) => ({
            x: dir < 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
            }
        })
    } as any;

    return (
        <MotionDiv
            className="absolute top-0 left-0 w-full h-full z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.3, ease: "circOut" }}
        >
            <HoloFrame
                variant="lines"
                className="w-full h-full bg-black/40 backdrop-blur-[1px] relative overflow-hidden p-0"
                showAtmosphere={true}
                showMask={true}
            >
                <div className="w-full h-full flex flex-col">
                    {/* === HEADER === */}
                    <div className="w-full shrink-0 flex items-center justify-between relative z-[60] px-1 2xl:px-2 pt-1 2xl:pt-1 pb-1 2xl:pb-1">
                        <div className="w-16 2xl:w-20" />

                        <div className="flex flex-col items-center">
                            <h1 className="text-sm 2xl:text-lg font-bold text-brand-secondary tracking-[0.3em] uppercase">
                                {t('lab.title')}
                            </h1>
                        </div>

                        <div className="flex justify-end w-16 2xl:w-20">
                            <CyberButton
                                variant="ghost"
                                icon={<i className="ri-close-line text-xl 2xl:text-2xl" />}
                                onClick={() => navigate('/')}
                                className="text-brand-primary hover:text-brand-secondary transition-colors"
                                iconOnly
                            />
                        </div>
                    </div>

                    {/* Main Carousel Area */}
                    <div className="flex-1 w-full max-w-[1600px] mx-auto relative flex items-center justify-between px-2 md:px-8 relative py-8">

                        {/* Left Navigation */}
                        <div className="shrink-0 flex items-center justify-center w-12 md:w-20 z-20">
                            <CyberButton
                                variant="ghost"
                                icon={<i className="ri-arrow-left-s-line text-4xl" />}
                                onClick={handlePrev}
                                className="text-text-muted hover:text-brand-primary"
                                iconOnly
                            />
                        </div>

                        {/* App Viewer Container */}
                        <div className="flex-1 relative h-full flex items-center justify-center overflow-hidden">
                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="w-full flex justify-center px-4 md:px-8"
                                >
                                    <LabAppViewer app={labApps[currentIndex]} />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Right Navigation */}
                        <div className="shrink-0 flex items-center justify-center w-12 md:w-20 z-20">
                            <CyberButton
                                variant="ghost"
                                icon={<i className="ri-arrow-right-s-line text-4xl" />}
                                onClick={handleNext}
                                className="text-text-muted hover:text-brand-primary"
                                iconOnly
                            />
                        </div>

                        {/* Bottom Pagination Indicators */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                            {labApps.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setDirection(idx > currentIndex ? 1 : -1);
                                        setCurrentIndex(idx);
                                    }}
                                    className={`h-1 transition-all duration-300 ${idx === currentIndex
                                        ? 'w-8 bg-brand-primary shadow-[0_0_8px_var(--color-brand-primary)]'
                                        : 'w-4 bg-border-subtle hover:bg-text-muted'
                                        }`}
                                    aria-label={`View app ${idx + 1}`}
                                />
                            ))}
                        </div>

                    </div>
                </div>
            </HoloFrame>
        </MotionDiv>
    );
};
