import type { Project } from '../../data/projects';

interface ProjectInfoProps {
    project: Project;
}

export const ProjectInfo = ({ project }: ProjectInfoProps) => {
    return (
        <div className="flex flex-col items-center justify-center text-center gap-4">
            {/* Project Name */}
            <h2 className="text-[16px] font-bold font-sans text-cyan-400 tracking-wider uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
                {project.title}
            </h2>

            {/* Project Type */}
            <div className="flex items-center">
                <span className="text-[14px] font-semibold font-sans text-cyan-600 tracking-[0.2em] uppercase">
                    {project.status.replace('_', ' ')}
                </span>
            </div>

            {/* Project Description */}
            <p className="text-[12px] font-normal font-sans text-cyan-500/80 leading-relaxed max-w-[320px] mx-auto line-clamp-3">
                {project.description}
            </p>
        </div>
    );
};
