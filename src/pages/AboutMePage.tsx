import { HoloFrame } from '../components/ui/HoloFrame';
import { CyberButton } from '../components/ui/CyberButton';
import { MotionDiv } from '../components/motion/MotionWrappers';
import { HolographicAvatar } from '../components/about/HolographicAvatar';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../i18n';

export const AboutMePage = () => {
    const { setAboutMeOpen } = useAppStore();
    const { t } = useTranslation();

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
                active={true}  // 触发 Arwes FrameLines 入场动效
                showAtmosphere={true}
                showMask={true}
            >
                {/* 主容器布局 */}
                <div className="w-full h-full flex flex-col">

                    {/* === 顶部标题栏 === */}
                    <div className="w-full shrink-0 flex items-center justify-between relative z-[60] px-4 2xl:px-6 pt-4 2xl:pt-6">
                        {/* 左侧占位 */}
                        <div className="w-16 2xl:w-20"></div>

                        {/* 中间标题 */}
                        <div className="flex items-center gap-3 2xl:gap-4">
                            {/* 连接线终点矩形 - 由 ConnectionLine 组件渲染 */}
                            <div id="about-title-dot" className="w-2 h-2 2xl:w-2.5 2xl:h-2.5 shrink-0"></div>
                            <h1 className="text-[16px] 2xl:text-[20px] font-bold text-brand-secondary tracking-[0.3em]">
                                {t('about.title')}
                            </h1>
                        </div>

                        {/* 右侧关闭按钮 */}
                        <div className="flex justify-end w-16 2xl:w-20">
                            <CyberButton
                                variant="ghost"
                                icon={<i className="ri-close-line text-2xl 2xl:text-3xl"></i>}
                                onClick={() => setAboutMeOpen(false)}
                                className="text-brand-primary hover:text-brand-secondary transition-colors"
                                iconOnly
                            />
                        </div>
                    </div>

                    {/* === 内容区域 === */}
                    <div className="flex-1 w-full relative min-h-0 flex p-6 2xl:p-10 gap-8 2xl:gap-12 overflow-hidden">

                        {/* 左侧：文字内容 - 占 5/8 */}
                        <div className="flex-[5] flex flex-col gap-8 2xl:gap-12 overflow-y-auto pr-4 2xl:pr-6 scrollbar-hide">
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

                        {/* 右侧：3D 全息形象 - 占 3/8，自适应 */}
                        <div className="flex-[3] h-full min-w-[200px] 2xl:min-w-[280px]">
                            <HolographicAvatar className="w-full h-full" />
                        </div>
                    </div>
                </div>
            </HoloFrame>
        </MotionDiv>
    );
};
