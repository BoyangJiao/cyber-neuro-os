import { ProjectDeck } from '../components/project/ProjectDeck';
import { motion } from 'framer-motion';
import { HoloFrame } from '../components/ui/HoloFrame';
import { CyberButton } from '../components/ui/CyberButton';
import { ProjectPagination } from '../components/project/ProjectPagination';
import { useProjectStore } from '../store/useProjectStore';
import { useNavigate } from 'react-router-dom';

export const ProjectLanding = () => {
    const MotionDiv = motion.div as any;
    const navigate = useNavigate();
    const { projects, activeProjectId, setActiveProject } = useProjectStore();

    return (
        <MotionDiv
            className="absolute top-0 left-0 w-full h-full z-50"
            layoutId="project-expand"
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

                    {/* === HEADER SECTION === */}
                    <div className="w-full shrink-0 flex items-center justify-between relative z-[60] px-4 pt-4">
                        {/* Left Spacer to balance layout */}
                        <div className="w-16"></div>

                        {/* Center Title */}
                        <div className="flex flex-col items-center">
                            <h1 className="text-[16px] font-bold text-cyan-400 tracking-[0.3em]">
                                PROJECT DIRECTORY
                            </h1>
                            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mt-1"></div>
                        </div>

                        {/* Right Close Button */}
                        <div className="flex justify-end w-16">
                            <CyberButton
                                variant="ghost"
                                icon={<i className="ri-close-line text-2xl"></i>}
                                onClick={() => navigate('/')}
                                className="text-cyan-500 hover:text-cyan-300 transition-colors"
                                iconOnly
                            />
                        </div>
                    </div>

                    {/* === MIDDLE SECTION (PROJECT DECK) === */}
                    <div className="flex-1 w-full relative min-h-0 flex items-center justify-center">
                        <ProjectDeck />
                    </div>

                    {/* === FOOTER SECTION (PAGINATION) === */}
                    <div className="w-full shrink-0 flex items-center justify-center z-[60] p-4">
                        <ProjectPagination
                            projects={projects.slice(0, 6)}
                            activeProjectId={activeProjectId}
                            onSelect={setActiveProject}
                        />
                    </div>

                </div>
            </HoloFrame>
        </MotionDiv>
    );
};

