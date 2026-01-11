import { ProjectDeck } from '../components/project/ProjectDeck';
import { ProjectInfo } from '../components/project/ProjectInfo';
import { MotionDiv } from '../components/motion/MotionWrappers';
import { HoloFrame } from '../components/ui/HoloFrame';
import { CyberButton } from '../components/ui/CyberButton';
import { ProjectPagination } from '../components/project/ProjectPagination';
import { useProjectStore } from '../store/useProjectStore';
import { useNavigate } from 'react-router-dom';

export const ProjectLanding = () => {
    const navigate = useNavigate();
    const { projects, activeProjectId, setActiveProject } = useProjectStore();

    // Get active project for ProjectInfo
    const visibleProjects = projects.slice(0, 6);
    const activeProject = visibleProjects.find(p => p.id === activeProjectId);

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
                {/* Main Flex Layout - Full Width/Height */}
                <div className="w-full h-full flex flex-col">

                    {/* === HEADER === */}
                    <div className="w-full shrink-0 flex items-center justify-between relative z-[60] px-4 2xl:px-6 pt-4 2xl:pt-6">
                        {/* Left Spacer to balance layout */}
                        <div className="w-16 2xl:w-20"></div>

                        {/* Center Title */}
                        <div className="flex flex-col items-center">
                            <h1 className="text-[16px] 2xl:text-[20px] font-bold text-cyan-400 tracking-[0.3em]">
                                PROJECT DIRECTORY
                            </h1>
                            <div className="w-32 2xl:w-40 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mt-1"></div>
                        </div>

                        {/* Right Close Button */}
                        <div className="flex justify-end w-16 2xl:w-20">
                            <CyberButton
                                variant="ghost"
                                icon={<i className="ri-close-line text-2xl 2xl:text-3xl"></i>}
                                onClick={() => navigate('/')}
                                className="text-cyan-500 hover:text-cyan-300 transition-colors"
                                iconOnly
                            />
                        </div>
                    </div>

                    {/* === PROJECT DECK AREA (flex-1 自适应) === */}
                    <div className="flex-1 w-full relative min-h-0 flex flex-col items-center justify-center">
                        {/* 3D Carousel 容器 (自适应缩放，不超出边界) */}
                        <div className="flex-1 w-full min-h-0 flex items-center justify-center">
                            <ProjectDeck />
                        </div>

                        {/* ProjectInfo (固定高度，紧贴 carousel) */}
                        <div className="w-full shrink-0 flex justify-center items-start z-40 h-[130px] 2xl:h-[145px]">
                            {activeProject && <ProjectInfo project={activeProject} />}
                        </div>
                    </div>

                    {/* === PAGINATION === */}
                    <div className="w-full shrink-0 flex items-center justify-center z-[60] p-4 2xl:p-5">
                        <ProjectPagination
                            projects={visibleProjects}
                            activeProjectId={activeProjectId}
                            onSelect={setActiveProject}
                        />
                    </div>

                </div>
            </HoloFrame>
        </MotionDiv>
    );
};

