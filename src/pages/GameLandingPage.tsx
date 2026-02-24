import { games } from '../data/games';
import { GameCard } from '../components/features/game/GameCard';
import { useTranslation } from '../i18n';
import { motion } from 'framer-motion';
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
 * - 暗黑主题配合红色强调色（由组件内部管理）
 */
export const GameLandingPage = () => {
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
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
                                    {games.map((game, index) => (
                                        <motion.div
                                            key={game.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                delay: index * 0.08,
                                                duration: 0.5,
                                                ease: "easeOut"
                                            }}
                                        >
                                            <GameCard game={game} />
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
