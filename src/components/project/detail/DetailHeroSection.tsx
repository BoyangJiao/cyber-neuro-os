import { MotionDiv, MotionH1, MotionP } from '../../motion/MotionWrappers';
import type { Project } from '../../../data/projects';
import type { ProjectDetail } from '../../../data/projectDetails';

interface DetailHeroSectionProps {
    project: Project;
    detail: ProjectDetail;
}

export const DetailHeroSection = ({ project, detail }: DetailHeroSectionProps) => {

    return (
        <section className="w-full relative">
            {/* Content Container */}
            <div className="w-full px-6 lg:px-10 py-12">
                {/* Project Title */}
                <MotionH1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                    className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-wider mb-4"
                    style={{
                        color: '#00f0ff',
                        textShadow: `
                            0 0 30px rgba(0, 240, 255, 0.5),
                            0 0 60px rgba(0, 240, 255, 0.3)
                        `,
                    }}
                >
                    {project.title}
                </MotionH1>

                {/* Tagline - One sentence description */}
                <MotionP
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-lg md:text-xl text-neutral-300 max-w-3xl mb-8 leading-relaxed"
                >
                    {detail.tagline}
                </MotionP>

                {/* Core Metrics Row */}
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="flex flex-wrap gap-8 mb-10"
                >
                    {detail.coreMetrics.map((metric, index) => (
                        <div key={index} className="flex flex-col">
                            <div className="flex items-baseline gap-1">
                                <span
                                    className="text-3xl md:text-4xl font-display font-bold"
                                    style={{
                                        color: '#00f0ff',
                                        textShadow: '0 0 15px rgba(0, 240, 255, 0.6)',
                                    }}
                                >
                                    {metric.value}
                                </span>
                                {metric.unit && (
                                    <span className="text-lg text-cyan-500">{metric.unit}</span>
                                )}
                            </div>
                            <span className="text-[12px] font-mono text-neutral-400 uppercase tracking-wider mt-1">
                                {metric.label}
                            </span>
                        </div>
                    ))}
                </MotionDiv>

                {/* Hero Image - Full width below text */}
                <MotionDiv
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                    className="w-full aspect-[16/7] relative overflow-hidden"
                    style={{
                        border: '1px solid rgba(0, 240, 255, 0.15)',
                    }}
                >
                    {/* Gradient Placeholder Background */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `
                                linear-gradient(135deg, 
                                    rgba(0, 80, 100, 0.4) 0%,
                                    rgba(15, 23, 35, 0.9) 40%,
                                    rgba(6, 18, 26, 0.95) 60%,
                                    rgba(0, 100, 120, 0.3) 100%
                                )
                            `,
                        }}
                    />

                    {/* Scan Line Overlay */}
                    <div
                        className="absolute inset-0 opacity-40 pointer-events-none"
                        style={{
                            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.03) 2px, rgba(0, 240, 255, 0.03) 4px)',
                        }}
                    />

                    {/* Corner Decorations */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-500/50" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyan-500/50" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyan-500/50" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-500/50" />

                    {/* Center Icon Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="w-20 h-20 flex items-center justify-center opacity-30"
                            style={{
                                background: 'rgba(0, 240, 255, 0.05)',
                                border: '1px solid rgba(0, 240, 255, 0.2)',
                            }}
                        >
                            <i
                                className={`${project.thumbnail} text-4xl`}
                                style={{
                                    color: 'rgba(0, 240, 255, 0.5)',
                                }}
                            />
                        </div>
                    </div>
                </MotionDiv>
            </div>
        </section>
    );
};
