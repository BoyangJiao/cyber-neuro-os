import { HoloFrame } from '../components/ui/HoloFrame';
import { CyberButton } from '../components/ui/CyberButton';
import { MotionDiv } from '../components/motion/MotionWrappers';
import { HolographicAvatar } from '../components/about/HolographicAvatar';
import { useAppStore } from '../store/useAppStore';

// 硬编码的个人信息内容
const aboutContent = {
    workExperience: {
        label: 'THE SHORT INTRODUCTION OF JOURNEY IN ANT GROUP',
        content: 'I have tackled challenges for both consumer products Alipay+ Digital Wallet and Alipay+ Rewards, which provide accessible, customizable, and sustainable inclusive finance solutions in APAC and African markets.'
    },
    careerAndDesign: {
        label: 'CAREER AND DESIGN',
        content: 'I have experience across a large spectrum of projects ranging from mobile apps, websites, and new retail services for consumers, SMEs, corporations, and nonprofits. Areas include Fintech, social media, gaming, e-commerce, education, and automobile.'
    },
    educationAndPassions: {
        label: 'BRIEF OF EDUCATION AND PERSONAL PASSIONS',
        content: "I'm originally from Hangzhou, China, and I have a bachelor's degree in Psychology from the University of Missouri and a master's degree in Human-Computer Interaction design from California College of the Arts (CCA). My Passions are social Impact, systems thinking, accessibility, and lifetime learning."
    }
};

export const AboutMePage = () => {
    const { setAboutMeOpen } = useAppStore();

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
                className="w-full h-full bg-transparent relative overflow-hidden p-0"
            >
                {/* 主容器布局 */}
                <div className="w-full h-full flex flex-col">

                    {/* === 顶部标题栏 === */}
                    <div className="w-full shrink-0 flex items-center justify-between relative z-[60] px-4 pt-4">
                        {/* 左侧占位 */}
                        <div className="w-16"></div>

                        {/* 中间标题 */}
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                            <h1 className="text-[16px] font-bold text-cyan-400 tracking-[0.3em]">
                                WHO IS BOYANG JIAO
                            </h1>
                        </div>

                        {/* 右侧关闭按钮 */}
                        <div className="flex justify-end w-16">
                            <CyberButton
                                variant="ghost"
                                icon={<i className="ri-close-line text-2xl"></i>}
                                onClick={() => setAboutMeOpen(false)}
                                className="text-cyan-500 hover:text-cyan-300 transition-colors"
                                iconOnly
                            />
                        </div>
                    </div>

                    {/* === 内容区域 === */}
                    <div className="flex-1 w-full relative min-h-0 flex p-6 gap-8 overflow-hidden">

                        {/* 左侧：文字内容 */}
                        <div className="flex-1 flex flex-col gap-8 overflow-y-auto pr-4 scrollbar-hide">
                            {/* 工作经历 */}
                            <div className="flex gap-6">
                                <div className="w-48 shrink-0">
                                    <span className="text-xs font-semibold text-cyan-700 tracking-widest uppercase leading-relaxed">
                                        {aboutContent.workExperience.label}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-cyan-50 leading-relaxed">
                                        {aboutContent.workExperience.content}
                                    </p>
                                </div>
                            </div>

                            {/* 职业与设计 */}
                            <div className="flex gap-6">
                                <div className="w-48 shrink-0">
                                    <span className="text-xs font-semibold text-cyan-700 tracking-widest uppercase leading-relaxed">
                                        {aboutContent.careerAndDesign.label}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-cyan-50 leading-relaxed">
                                        {aboutContent.careerAndDesign.content}
                                    </p>
                                </div>
                            </div>

                            {/* 教育背景与热情 */}
                            <div className="flex gap-6">
                                <div className="w-48 shrink-0">
                                    <span className="text-xs font-semibold text-cyan-700 tracking-widest uppercase leading-relaxed">
                                        {aboutContent.educationAndPassions.label}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-cyan-50 leading-relaxed">
                                        {aboutContent.educationAndPassions.content}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 右侧：3D 全息形象 */}
                        <div className="w-[320px] xl:w-[380px] 2xl:w-[420px] h-full shrink-0">
                            <HolographicAvatar className="w-full h-full" />
                        </div>
                    </div>
                </div>
            </HoloFrame>
        </MotionDiv>
    );
};
