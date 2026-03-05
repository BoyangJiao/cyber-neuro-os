import { sounds } from '../data/sounds';
import { SoundCard } from '../components/features/synthesis/SoundCard';
import { useTranslation } from '../i18n';
import { motion } from 'framer-motion';
import { MotionDiv } from '../components/motion/MotionWrappers';
import { HoloFrame } from '../components/ui/HoloFrame';
import { CyberButton } from '../components/ui/CyberButton';
import { useNavigate } from 'react-router-dom';

/**
 * SynthesisLandingPage - Soundboard 控制台落地页
 * 
 * 融合了成就展示墙的大阵列网格概念，与 RyoOS 音效板的可视化声波交互
 */
export const SynthesisLandingPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

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
                            <h1 className="text-sm 2xl:text-lg font-display font-bold text-brand-secondary tracking-[0.3em] uppercase">
                                {t('synthesis.title')}
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

                    {/* === MAIN CONTENT === */}
                    <div className="flex-1 w-full min-h-0 overflow-y-auto scrollbar-hide">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 max-w-[1500px] mx-auto px-6 lg:px-12 pt-8 pb-20 mt-4">

                            {/* Left Sidebar Info */}
                            <aside className="lg:w-1/4 pt-2 shrink-0">
                                <p className="text-xs 2xl:text-sm font-mono tracking-widest text-text-secondary leading-relaxed uppercase whitespace-pre-line opacity-70">
                                    {t('synthesis.sidebar')}
                                </p>
                            </aside>

                            {/* Right Sound Grid */}
                            <main className="lg:w-3/4 flex-1">
                                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                                    {sounds.map((sound, index) => (
                                        <motion.div
                                            key={sound.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                delay: index * 0.05,
                                                duration: 0.4,
                                                ease: "easeOut"
                                            }}
                                            className="w-full"
                                        >
                                            <SoundCard sound={sound} />
                                        </motion.div>
                                    ))}
                                </div>
                            </main>

                        </div>
                    </div>

                </div>
            </HoloFrame>
        </MotionDiv>
    );
};
