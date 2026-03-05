import { MotionDiv, MotionH1, MotionP } from '../../motion/MotionWrappers';
import { ChamferFrame } from '../../ui/frames/ChamferFrame';
import type { Project } from '../../../data/projects';
import type { ProjectDetailData } from '../../../data/projectDetails';

interface DetailHeroSectionProps {
    project: Project;
    detail: ProjectDetailData;
}

export const DetailHeroSection = ({ project, detail }: DetailHeroSectionProps) => {

    return (
        <section className="w-full relative">
            {/* Content Container */}
            <div className="w-full px-4 lg:px-6 xl:px-10 2xl:px-12 py-12 2xl:py-16">
                {/* Project Title */}
                <MotionH1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                    className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-display font-bold tracking-wider mb-4 2xl:mb-6 text-brand-primary drop-shadow-glow-strong"
                >
                    {project.title}
                </MotionH1>

                {/* Tagline - One sentence description */}
                <MotionP
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-lg md:text-xl 2xl:text-2xl text-text-primary max-w-3xl 2xl:max-w-4xl mb-8 2xl:mb-10 leading-relaxed 2xl:leading-loose"
                >
                    {detail.tagline}
                </MotionP>

                {/* Core Metrics Row */}
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap lg:gap-x-16 xl:gap-x-24 gap-y-8 mb-10 2xl:mb-14"
                >
                    {(detail.coreMetrics || []).map((metric: any, index: number) => (
                        <div key={index} className="flex flex-col lg:min-w-[160px] max-w-[240px]">
                            <div className="flex items-baseline gap-1.5">
                                <span
                                    className="text-3xl md:text-4xl 2xl:text-5xl font-mono font-bold text-brand-primary drop-shadow-glow"
                                >
                                    {metric.value}
                                </span>
                                {metric.unit && (
                                    <span className="text-lg md:text-xl 2xl:text-2xl text-brand-primary/80 font-mono font-medium tracking-wide">
                                        {metric.unit}
                                    </span>
                                )}
                            </div>
                            <span className="text-[11px] md:text-xs 2xl:text-[14px] font-mono text-text-secondary uppercase tracking-widest mt-2 2xl:mt-3 leading-snug opacity-80">
                                {metric.label}
                            </span>
                        </div>
                    ))}
                </MotionDiv>

                {/* Hero Image - 16:9 ChamferFrame */}
                <MotionDiv
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                    className="w-full aspect-video relative"
                >
                    <ChamferFrame
                        showEffects={false}
                        disableHover={true}
                        chamferSize={20}
                        bgClassName="bg-black/20"
                    >
                        {/* Check for Video first (from Sanity detail) */}
                        {(detail as any).heroVideoFile || (detail as any).heroVideoUrl ? (
                            <video
                                src={(detail as any).heroVideoFile || (detail as any).heroVideoUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            /* Fallback to Image */
                            project.thumbnail?.startsWith('http') || project.thumbnail?.startsWith('/') ? (
                                <img
                                    src={project.thumbnail}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-cyan-950/20">
                                    <i className={`${project.thumbnail} text-6xl text-cyan-500/30`} />
                                </div>
                            )
                        )}
                    </ChamferFrame>
                </MotionDiv>
            </div>
        </section>
    );
};
