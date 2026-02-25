import { useState } from 'react';
import { type Game, games } from '../data/games';
import { GameCard } from '../components/features/game/GameCard';
import { RetroEmulator } from '../components/features/game/RetroEmulator';
import { useTranslation } from '../i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { MotionDiv } from '../components/motion/MotionWrappers';
import { HoloFrame } from '../components/ui/HoloFrame';
import { CyberButton } from '../components/ui/CyberButton';
import { useNavigate } from 'react-router-dom';

/**
 * GameLandingPage - Simulation 模块落地页
 * 
 * 符合参考图与系统一致性的设计：
 * - 全屏遮罩层（MotionDiv + HoloFrame）
 * - 顶部居中标题 "MINI GAMES"
 * - 左侧描述文字边栏，右侧游戏卡片网格
 * - 点击卡片后，卡片采用 shared layout 动画无缝扩展为全屏游戏播放器。
 */
export const GameLandingPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // State to hold the actively expanded game modal
    const [activeGame, setActiveGame] = useState<Game | null>(null);

    return (
        <MotionDiv
            className="absolute top-0 left-0 w-full h-full z-50 pointer-events-auto"
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
                {/* 主容器 - Flex 垂直布局 */}
                <div className="w-full h-full flex flex-col">

                    {/* === HEADER === */}
                    <div className="w-full shrink-0 flex items-center justify-between relative z-[60] px-1 2xl:px-2 pt-1 2xl:pt-1 pb-1 2xl:pb-1">
                        {/* 左侧占位 */}
                        <div className="w-16 2xl:w-20" />

                        {/* 中央标题 */}
                        <div className="flex flex-col items-center">
                            <h1 className="text-sm 2xl:text-lg font-bold text-status-error tracking-[0.3em] uppercase">
                                {t('simulation.title')}
                            </h1>
                        </div>

                        {/* 右侧关闭按钮 */}
                        <div className="flex justify-end w-16 2xl:w-20">
                            <CyberButton
                                variant="ghost"
                                icon={<i className="ri-close-line text-xl 2xl:text-2xl" />}
                                onClick={() => navigate('/')}
                                className="text-status-error hover:text-red-400 transition-colors"
                                iconOnly
                            />
                        </div>
                    </div>

                    {/* === MAIN CONTENT === */}
                    <div className="flex-1 w-full min-h-0 overflow-y-auto scrollbar-hide">
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 max-w-[1400px] mx-auto px-6 lg:px-12 pt-10 pb-20">
                            {/* Left Sidebar Info */}
                            <aside className="lg:w-1/4 pt-2">
                                <p className="text-xs 2xl:text-sm font-mono tracking-widest text-text-secondary leading-relaxed uppercase whitespace-pre-line opacity-70">
                                    {t('simulation.sidebar')}
                                </p>
                            </aside>

                            {/* Right Game Grid */}
                            <main className="lg:w-3/4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
                                    {games.map((game, index) => (
                                        <motion.div
                                            key={game.id}
                                            layoutId={`game-card-${game.id}`}
                                            className="relative"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                delay: index * 0.08,
                                                duration: 0.5,
                                                ease: "easeOut"
                                            }}
                                        >
                                            <GameCard
                                                game={game}
                                                onClick={() => setActiveGame(game)}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </main>
                        </div>
                    </div>

                </div>
            </HoloFrame>

            {/* EXPANDED IN-PLACE EMULATOR OVERLAY */}
            <AnimatePresence>
                {activeGame && (
                    <motion.div
                        layoutId={`game-card-${activeGame.id}`}
                        className="absolute inset-0 z-[100] bg-black flex flex-col overflow-hidden"
                        initial={{ opacity: 0, borderRadius: 24 }}
                        animate={{ opacity: 1, borderRadius: 0 }}
                        exit={{ opacity: 0, borderRadius: 24, transition: { duration: 0.4, ease: "anticipate" } }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Overlay Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: 0.2 }}
                            className="w-full shrink-0 flex items-center justify-between relative z-[60] px-4 py-3 bg-black/80 backdrop-blur-md border-b border-border-subtle"
                        >
                            <div className="flex-1 flex items-center justify-start">
                                <CyberButton
                                    variant="ghost"
                                    icon={<i className="ri-arrow-left-line text-xl" />}
                                    onClick={() => setActiveGame(null)}
                                    className="text-text-secondary hover:text-white"
                                >
                                    <span className="ml-2 font-mono tracking-widest text-sm uppercase">CLOSE</span>
                                </CyberButton>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center">
                                <h1 className="text-sm md:text-base font-display tracking-[0.3em] text-status-error uppercase">
                                    {t(activeGame.titleKey)}
                                </h1>
                            </div>

                            <div className="flex-1 flex justify-end">
                                <div className="text-[10px] font-mono tracking-widest text-text-muted uppercase">
                                    {activeGame.core.toUpperCase()} / LOCAL
                                </div>
                            </div>
                        </motion.div>

                        {/* Player Frame */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex-1 w-full h-full relative"
                        >
                            <RetroEmulator
                                gameUrl={activeGame.romUrl}
                                gameName={t(activeGame.titleKey)}
                                core={activeGame.core}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </MotionDiv>
    );
};
