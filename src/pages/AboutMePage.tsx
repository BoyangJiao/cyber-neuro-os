import { HoloFrame } from '../components/ui/HoloFrame';
import { CyberButton } from '../components/ui/CyberButton';
import { MotionDiv } from '../components/motion/MotionWrappers';
import { HolographicAvatar } from '../components/about/HolographicAvatar';
import { StatCard } from '../components/about/StatCard';
import { CornerFrame } from '../components/ui/frames/CornerFrame';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { SystemInfoBlockAlpha, SystemInfoBlockBeta } from '../components/ui/decos/SystemInfoBlock';
import { useSoundSystem } from '../hooks/useSoundSystem';

/**
 * AboutMePage — with purely decoupled WebGL Canvas layout.
 *
 * Animation fix: The Canvas wrapper is now `absolute inset-0` and NEVER resizes its 
 * DOM bounding box, bypassing the WebGL ResizeObserver completely.
 * 
 * Instead of auto-flexing the canvas boundaries, we native-translate (`x`) the entire 
 * fixed-size canvas layer linearly to perfectly align with the Right Panel DOM elements.
 * This guarantees a structurally flawless 60fps trajectory.
 */
export const AboutMePage = () => {
    const { setAboutMeOpen, isCharacterStatsOpen, setCharacterStatsOpen } = useAppStore();
    const { playTransition } = useSoundSystem();
    const { t } = useTranslation();

    // ESC to close stats
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isCharacterStatsOpen) {
                setCharacterStatsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isCharacterStatsOpen, setCharacterStatsOpen]);

    // Stats data
    const statsData = [
        { key: 'productDesign', value: 92 },
        { key: 'leadership', value: 78 },
        { key: 'designSystems', value: 88 },
        { key: 'engineering', value: 75 },
        { key: 'research', value: 85 },
        { key: 'strategicThinking', value: 80 },
    ];

    // Perfect fluid ease
    const springTransition = { ease: [0.22, 1, 0.36, 1] as const, duration: 0.8 };

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
                className="w-full h-full bg-[var(--color-bg-app)] relative overflow-hidden p-0"
                active={true}
                showAtmosphere={true}
                showMask={true}
            >
                <div className="w-full h-full flex flex-col relative z-10">

                    {/* === HEADER === */}
                    <div className="w-full shrink-0 flex items-center justify-between relative z-[60] px-1 2xl:px-2 pt-1 2xl:pt-1 pb-1 2xl:pb-1">
                        <div className="w-16 2xl:w-20 flex justify-start">
                            <AnimatePresence>
                                {isCharacterStatsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <CyberButton
                                            variant="ghost"
                                            icon={<i className="ri-arrow-left-line text-xl 2xl:text-2xl" />}
                                            onClick={() => setCharacterStatsOpen(false)}
                                            className="text-brand-primary hover:text-brand-secondary transition-colors"
                                            iconOnly
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center gap-3 justify-center">
                            <div id="about-title-dot" className="w-1.5 h-1.5 bg-brand-secondary/50 rounded-full" />
                            <h1 className="text-sm 2xl:text-lg font-bold text-brand-secondary tracking-[0.3em] uppercase">
                                {t('about.title')}
                            </h1>
                        </div>

                        <div className="flex justify-end w-16 2xl:w-20">
                            <CyberButton
                                variant="ghost"
                                icon={<i className="ri-close-line text-xl 2xl:text-2xl" />}
                                onClick={() => {
                                    setCharacterStatsOpen(false);
                                    setAboutMeOpen(false);
                                }}
                                className="text-brand-primary hover:text-brand-secondary transition-colors"
                                iconOnly
                            />
                        </div>
                    </div>

                    {/* === CANVAS BACKGROUND LAYER (Never changes size) === */}
                    <motion.div
                        className="absolute inset-x-0 bottom-0 top-[60px] z-[5] pointer-events-none"
                        initial={false}
                        // Move 30% to the right (plus half the 3rem gap) to perfectly center within the right HUD column
                        animate={{
                            x: isCharacterStatsOpen ? "0%" : "calc(30% + 1.5rem)",
                            y: isCharacterStatsOpen ? -60 : 0
                        }}
                        transition={springTransition}
                    >
                        <HolographicAvatar className="pointer-events-auto" />
                    </motion.div>

                    {/* === DOM HUD LAYER === */}
                    <div className="flex-1 w-full relative min-h-0 flex p-6 2xl:p-10 overflow-hidden pointer-events-none z-[20]">

                        {/* LEFT: Text Content Window */}
                        <motion.div
                            className="shrink-0 h-full overflow-y-auto overflow-x-hidden scrollbar-hide pointer-events-auto"
                            initial={false}
                            animate={{
                                width: isCharacterStatsOpen ? "0%" : "60%",
                                opacity: isCharacterStatsOpen ? 0 : 1,
                                marginRight: isCharacterStatsOpen ? "0rem" : "3rem",
                            }}
                            transition={{
                                ...springTransition,
                                opacity: { duration: 0.25, delay: isCharacterStatsOpen ? 0 : 0.3 }
                            }}
                        >
                            {/* Inner wrapper prevents text reflow constraint bugs during shrink */}
                            <div className="min-w-[500px] w-full pr-4 2xl:pr-6 flex flex-col gap-8 2xl:gap-12 pb-10">
                                {/* 工作经历 */}
                                <div className="flex gap-6 2xl:gap-10">
                                    <div className="w-48 2xl:w-64 shrink-0">
                                        <span className="text-xs 2xl:text-sm font-semibold text-brand-secondary tracking-widest uppercase leading-relaxed">
                                            {t('about.workExperience.label')}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm 2xl:text-base text-text-primary leading-relaxed 2xl:leading-loose">
                                            {t('about.workExperience.content')}
                                        </p>
                                    </div>
                                </div>

                                {/* 职业与设计 */}
                                <div className="flex gap-6 2xl:gap-10">
                                    <div className="w-48 2xl:w-64 shrink-0">
                                        <span className="text-xs 2xl:text-sm font-semibold text-cyan-700 tracking-widest uppercase leading-relaxed">
                                            {t('about.careerAndDesign.label')}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm 2xl:text-base text-cyan-50 leading-relaxed 2xl:leading-loose">
                                            {t('about.careerAndDesign.content')}
                                        </p>
                                    </div>
                                </div>

                                {/* 教育背景与热情 */}
                                <div className="flex gap-6 2xl:gap-10">
                                    <div className="w-48 2xl:w-64 shrink-0">
                                        <span className="text-xs 2xl:text-sm font-semibold text-cyan-700 tracking-widest uppercase leading-relaxed">
                                            {t('about.educationAndPassions.label')}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm 2xl:text-base text-cyan-50 leading-relaxed 2xl:leading-loose">
                                            {t('about.educationAndPassions.content')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* RIGHT: HUD Interaction Column */}
                        <motion.div
                            className="h-full relative flex-1 min-w-0"
                            layout
                            transition={springTransition}
                        >
                            {/* Base Interaction Surface & CornerFrame */}
                            <div
                                className={`absolute inset-0 ${!isCharacterStatsOpen ? 'pointer-events-auto cursor-pointer group' : 'pointer-events-none'}`}
                                onClick={() => {
                                    if (!isCharacterStatsOpen) {
                                        playTransition();
                                        setCharacterStatsOpen(true);
                                    }
                                }}
                            >
                                <div className={`absolute inset-0 z-0 transition-opacity duration-500 pointer-events-none ${isCharacterStatsOpen ? 'opacity-0' : 'opacity-100'}`}>
                                    <CornerFrame
                                        strokeWidth={2}
                                        cornerSize={24}
                                        className="opacity-30 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(255,80,80,1)] transition-opacity duration-300"
                                        color="rgba(255, 80, 80, 0.8)"
                                    />
                                </div>
                            </div>

                            {/* Expanded Stats Panels */}
                            <AnimatePresence>
                                {isCharacterStatsOpen && (
                                    <>
                                        <motion.div
                                            className="absolute left-4 top-0 bottom-16 2xl:bottom-20 w-[220px] flex flex-col justify-center gap-8 2xl:gap-10 z-[10] pointer-events-none"
                                            initial={{ opacity: 0, y: -40 }}
                                            animate={{ opacity: 1, y: -60, transition: { duration: 0.4, delay: 0.5 } }}
                                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                        >
                                            {statsData.slice(0, 3).map((stat, i) => (
                                                <StatCard
                                                    key={stat.key}
                                                    title={t(`about.stats.${stat.key}.name`)}
                                                    desc={t(`about.stats.${stat.key}.desc`)}
                                                    value={stat.value}
                                                    aligned="left"
                                                    delay={0.6 + i * 0.1}
                                                />
                                            ))}
                                        </motion.div>

                                        {/* Right stats */}
                                        <motion.div
                                            className="absolute right-4 top-0 bottom-16 2xl:bottom-20 w-[220px] flex flex-col justify-center gap-8 2xl:gap-10 z-[10] pointer-events-none"
                                            initial={{ opacity: 0, y: -40 }}
                                            animate={{ opacity: 1, y: -60, transition: { duration: 0.4, delay: 0.5 } }}
                                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                        >
                                            {statsData.slice(3, 6).map((stat, i) => (
                                                <StatCard
                                                    key={stat.key}
                                                    title={t(`about.stats.${stat.key}.name`)}
                                                    desc={t(`about.stats.${stat.key}.desc`)}
                                                    value={stat.value}
                                                    aligned="right"
                                                    delay={0.65 + i * 0.1}
                                                />
                                            ))}
                                        </motion.div>

                                        {/* Bottom System Info deco blocks */}
                                        <div className="absolute bottom-4 2xl:bottom-6 left-4 right-4 z-10 flex justify-between items-end gap-12">
                                            <SystemInfoBlockAlpha className="w-[330px] 2xl:w-[400px]" />
                                            <SystemInfoBlockBeta className="w-[330px] 2xl:w-[400px]" />
                                        </div>
                                    </>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </HoloFrame>
        </MotionDiv>
    );
};
