import type { Project } from '../../data/projects';

interface ProjectInfoProps {
    project: Project;
}

export const ProjectInfo = ({ project }: ProjectInfoProps) => {
    return (
        <div className="flex flex-col items-center justify-center text-center">
            {/* Project Name */}
            <h2 className="text-lg lg:text-2xl font-display font-bold text-cyan-400 tracking-wider mb-2 uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
                {project.title}
            </h2>

            {/* Project Type */}
            <div className="mb-3 lg:mb-4">
                <span className="text-[10px] lg:text-xs font-mono text-cyan-600 tracking-[0.3em] uppercase border-b border-cyan-800/50 pb-1">
                    {project.status.replace('_', ' ')}
                </span>
            </div>

            {/* Project Description */}
            <p className="text-cyan-500/80 font-sans text-[11px] lg:text-[13px] leading-relaxed max-w-[240px] lg:max-w-[320px] mx-auto line-clamp-3">
                {project.description}
            </p>
        </div>
    );
};
