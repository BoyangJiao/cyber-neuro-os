import type { Project } from '../../data/projects';

interface ProjectInfoProps {
    project: Project;
}

export const ProjectInfo = ({ project }: ProjectInfoProps) => {
    // Calculate fixed height for 3-line description: font-size * line-height * 3
    // For 12px font with leading-relaxed (1.625): 12 * 1.625 * 3 ≈ 58.5px
    // For 14px font with leading-relaxed (1.625): 14 * 1.625 * 3 ≈ 68.25px

    return (
        <div className="w-full max-w-[calc((100%-48px)/12*4)] 2xl:max-w-[calc((100%-60px)/12*4)] flex flex-col items-center justify-start text-center gap-2 2xl:gap-3">
            {/* Project Name */}
            <h2 className="text-[16px] 2xl:text-[20px] font-bold font-sans text-cyan-400 tracking-wider uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] truncate w-full">
                {project.title}
            </h2>

            {/* Project Type (Tech Stack) */}
            <div className="flex flex-wrap items-center justify-center gap-2 h-[24px] 2xl:h-[28px] overflow-hidden">
                {(project.techStack || []).map((tech, index) => (
                    <span
                        key={index}
                        className="px-2 py-0.5 text-[10px] 2xl:text-[12px] font-mono font-medium text-cyan-400 bg-cyan-950/30 border border-cyan-500/20"
                    >
                        {tech}
                    </span>
                ))}
            </div>

            {/* Project Description - Fixed height for exactly 3 lines */}
            <p
                className="text-[12px] 2xl:text-[14px] font-normal font-sans text-cyan-500/80 leading-relaxed w-full overflow-hidden h-[59px] 2xl:h-[68px]"
                style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                }}
            >
                {project.description}
            </p>
        </div>
    );
};
