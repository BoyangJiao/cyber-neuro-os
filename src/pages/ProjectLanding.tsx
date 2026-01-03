import { ProjectDeck } from '../components/project/ProjectDeck';
import { motion } from 'framer-motion';
import { HoloFrame } from '../components/ui/HoloFrame';
import { CyberButton } from '../components/ui/CyberButton';
import { useNavigate } from 'react-router-dom';

export const ProjectLanding = () => {
    const MotionDiv = motion.div as any;
    const navigate = useNavigate();

    return (
        <MotionDiv
            className="absolute top-0 left-0 w-full h-full p-1 z-50"
            layoutId="project-expand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.3, ease: "circOut" }}
        >
            <HoloFrame
                variant="lines"
                className="w-full h-full bg-cyber-950/90 backdrop-blur-md relative overflow-hidden"
            >
                {/* Close Button */}
                <div className="absolute top-4 right-4 z-50">
                    <CyberButton
                        variant="ghost"
                        icon={<i className="ri-close-line text-2xl"></i>}
                        onClick={() => navigate('/')}
                        className="text-cyan-500 hover:text-cyan-300"
                        iconOnly
                    />
                </div>

                {/* Main Deck Area */}
                <ProjectDeck />
            </HoloFrame>
        </MotionDiv>
    );
};
