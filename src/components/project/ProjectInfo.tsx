import type { Project } from '../../data/projects';
import { motion } from 'framer-motion';

interface ProjectInfoProps {
    project: Project;
}

export const ProjectInfo = ({ project }: ProjectInfoProps) => {
    const MotionDiv = motion.div as any;

    return (
        <MotionDiv
            className="absolute top-full left-1/2 -translate-x-1/2 mt-8 w-[400px] text-center z-50 pointer-events-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
        >
            {/* Project Name */}
            <h2 className="text-3xl font-display font-bold text-cyan-100 tracking-wider mb-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                {project.title}
            </h2>

            {/* Project Type */}
            <div className="inline-block px-3 py-1 mb-4 border border-cyan-500/30 bg-cyan-900/20 rounded-sm">
                <span className="text-xs font-mono text-cyan-400 tracking-[0.2em] uppercase">
                    {project.status.replace('_', ' ')}
                </span>
            </div>

            {/* Project Description */}
            <p className="text-cyan-300/80 font-sans text-sm leading-relaxed max-w-sm mx-auto">
                {project.description}
            </p>

            {/* Decorative Line */}
            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mx-auto mt-6"></div>

        </MotionDiv>
    );
};
