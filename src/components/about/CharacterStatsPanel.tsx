import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../i18n';
import { useAppStore } from '../../store/useAppStore';
import { HolographicAvatar } from './HolographicAvatar';
import { HexRadarChart } from './HexRadarChart';
import { StatCard } from './StatCard';
import { CyberButton } from '../ui/CyberButton';
import { useEffect } from 'react';

export const CharacterStatsPanel = () => {
    const { t } = useTranslation();
    const { isCharacterStatsOpen, setCharacterStatsOpen } = useAppStore();

    // Keydown for ESC to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isCharacterStatsOpen) {
                setCharacterStatsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isCharacterStatsOpen, setCharacterStatsOpen]);

    // Character Data Configuration
    const statsData = [
        { key: 'productDesign', value: 92 },
        { key: 'leadership', value: 78 },
        { key: 'designSystems', value: 88 },
        { key: 'engineering', value: 75 },
        { key: 'research', value: 85 },
        { key: 'strategicThinking', value: 80 },
    ];

    const radarData = statsData.map(d => d.value);
    const radarLabels = statsData.map(d => t(`about.stats.${d.key}.name`));

    return (
        <AnimatePresence>
            {isCharacterStatsOpen && (
                <motion.div
                    className="absolute inset-0 z-[100] bg-neutral-950/95 backdrop-blur-xl flex flex-col overflow-hidden"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.3 } }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                >
                    {/* Header */}
                    <div className="w-full shrink-0 flex items-center justify-between px-8 py-6 relative z-10 border-b border-brand-primary/20 bg-neutral-900/50">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 bg-brand-primary animate-pulse" />
                            <h2 className="text-brand-primary font-bold tracking-[0.3em] uppercase text-sm md:text-base">
                                OPERATOR PROFILE [ J. BOYANG ]
                            </h2>
                        </div>
                        <CyberButton
                            variant="ghost"
                            onClick={() => setCharacterStatsOpen(false)}
                            className="text-brand-primary hover:text-brand-secondary"
                        >
                            [ ESC ] RETURN
                        </CyberButton>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 w-full max-w-[1440px] mx-auto relative flex flex-col lg:flex-row items-center justify-between px-6 lg:px-16 py-8">

                        {/* Left Column Stats */}
                        <div className="flex flex-col gap-10 lg:gap-16 w-full lg:w-[320px] order-2 lg:order-1 relative z-10 mt-8 lg:mt-0">
                            {statsData.slice(0, 3).map((stat, i) => (
                                <StatCard
                                    key={stat.key}
                                    title={t(`about.stats.${stat.key}.name`)}
                                    desc={t(`about.stats.${stat.key}.desc`)}
                                    value={stat.value}
                                    aligned="left"
                                    delay={0.3 + i * 0.1}
                                />
                            ))}
                        </div>

                        {/* Center Column: Avatar & Radar */}
                        <div className="relative w-[340px] h-[400px] lg:w-[500px] lg:h-[600px] order-1 lg:order-2 flex items-center justify-center select-none pointer-events-none">
                            {/* Background Radar */}
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center opacity-60"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 0.6 }}
                                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                            >
                                <HexRadarChart
                                    data={radarData}
                                    labels={radarLabels}
                                    className="w-[120%] h-[120%] lg:w-[130%] lg:h-[130%]"
                                />
                            </motion.div>

                            {/* 3D Avatar (Rendered larger and centered) */}
                            <motion.div
                                className="absolute inset-0"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                            >
                                <HolographicAvatar className="w-full h-full" />
                            </motion.div>
                        </div>

                        {/* Right Column Stats */}
                        <div className="flex flex-col gap-10 lg:gap-16 w-full lg:w-[320px] order-3 relative z-10 mt-8 lg:mt-0">
                            {statsData.slice(3, 6).map((stat, i) => (
                                <StatCard
                                    key={stat.key}
                                    title={t(`about.stats.${stat.key}.name`)}
                                    desc={t(`about.stats.${stat.key}.desc`)}
                                    value={stat.value}
                                    aligned="right"
                                    delay={0.35 + i * 0.1}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Footer Metrics */}
                    <div className="shrink-0 w-full px-8 py-4 border-t border-brand-primary/20 flex justify-between items-center bg-neutral-900/50">
                        <div className="flex gap-8">
                            <span className="text-xs font-mono text-brand-primary/60 tracking-widest"><span className="text-brand-secondary">CLASS:</span> STAFF DESIGNER</span>
                            <span className="text-xs font-mono text-brand-primary/60 tracking-widest"><span className="text-brand-secondary">BASE:</span> ANT GROUP</span>
                        </div>
                        <div className="text-xs font-mono text-brand-primary animate-pulse tracking-widest">
                            SYSTEM DIAGNOSTICS: NOMINAL
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
