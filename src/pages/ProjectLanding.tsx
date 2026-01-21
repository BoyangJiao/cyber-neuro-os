import { useCallback } from 'react';
import { MissionList } from '../components/project/MissionList';
import { MissionBriefing } from '../components/project/MissionBriefing';
import { MotionDiv } from '../components/motion/MotionWrappers';
import { HoloFrame } from '../components/ui/HoloFrame';
import { CyberButton } from '../components/ui/CyberButton';
import { useProjectStore } from '../store/useProjectStore';
import { useNavigate } from 'react-router-dom';

/**
 * ProjectLanding - Mission 风格的项目展示页
 * 
 * 布局：左侧任务列表 (2列) + 右侧任务简报 (6列)
 * 交互：click-to-select
 */
export const ProjectLanding = () => {
    const navigate = useNavigate();
    const { projects, activeProjectIndex, setActiveProjectIndex } = useProjectStore();

    // 获取所有项目
    const visibleProjects = projects;
    const activeProject = visibleProjects[activeProjectIndex] || null;

    // 选择任务
    const handleSelectMission = useCallback((index: number) => {
        setActiveProjectIndex(index);
    }, [setActiveProjectIndex]);

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
                            <h1 className="text-sm 2xl:text-lg font-bold text-brand-secondary tracking-[0.3em] uppercase">
                                PROJECT DIRECTORY
                            </h1>
                        </div>

                        {/* 右侧关闭按钮 */}
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

                    {/* === MAIN CONTENT - 8 Column Grid === */}
                    <div className="flex-1 w-full min-h-0 px-4 2xl:px-6 pb-4 2xl:pb-6">
                        <div className="w-full h-full grid grid-cols-8 gap-4 2xl:gap-6">

                            {/* 左侧：任务列表 (2 列) */}
                            <div className="col-span-2 h-full overflow-hidden">
                                <MissionList
                                    projects={visibleProjects}
                                    activeIndex={activeProjectIndex}
                                    onSelect={handleSelectMission}
                                />
                            </div>

                            {/* 右侧：任务简报 (6 列) */}
                            <div className="col-span-6 h-full overflow-hidden">
                                <MissionBriefing
                                    project={activeProject}
                                    missionNumber={activeProjectIndex + 1}
                                />
                            </div>

                        </div>
                    </div>

                </div>
            </HoloFrame>
        </MotionDiv>
    );
};
