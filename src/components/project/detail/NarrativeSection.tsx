import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import type { ProjectDetail } from '../../../data/projectDetails';

interface NarrativeSectionProps {
    id: string;
    detail: ProjectDetail;
    onVisible: (sectionId: string) => void;
}

export const NarrativeSection = ({ id, detail, onVisible }: NarrativeSectionProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MotionDiv = motion.div as React.ComponentType<any>;

    const sectionRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isInView = useInView(sectionRef as any, { margin: '-40% 0px -40% 0px' });

    useEffect(() => {
        if (isInView) {
            onVisible(id);
        }
    }, [isInView, id, onVisible]);

    // Render different content based on section ID
    const renderContent = () => {
        switch (id) {
            case 'context':
                return <ContextContent detail={detail} />;
            case 'strategy':
                return <StrategyContent detail={detail} />;
            case 'highlights':
                return <HighlightsContent detail={detail} />;
            case 'outcome':
                return <OutcomeContent detail={detail} />;
            default:
                return null;
        }
    };

    return (
        <div
            ref={sectionRef}
            id={id}
            className="relative py-16 md:py-24"
        >
            {/* Holographic projection glow effect on section boundary */}
            <MotionDiv
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.3), transparent)',
                }}
            />

            {renderContent()}
        </div>
    );
};

// === Section Content Components ===

const ContextContent = ({ detail }: { detail: ProjectDetail }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MotionDiv = motion.div as React.ComponentType<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MotionH2 = motion.h2 as React.ComponentType<any>;

    return (
        <div className="space-y-8">
            <MotionH2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-xl font-display font-bold tracking-wider"
                style={{ color: '#00f0ff' }}
            >
                {detail.sections.context.title}
            </MotionH2>

            {/* Challenge Block */}
            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="relative pl-6"
                style={{
                    borderLeft: '2px solid rgba(255, 0, 85, 0.5)',
                }}
            >
                <span className="text-[12px] font-mono text-red-500 tracking-widest uppercase mb-2 block">
                    The Challenge
                </span>
                <p className="text-lg text-neutral-300 leading-relaxed">
                    {detail.sections.context.challenge}
                </p>
            </MotionDiv>

            {/* Background Block */}
            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative pl-6"
                style={{
                    borderLeft: '2px solid rgba(0, 240, 255, 0.3)',
                }}
            >
                <span className="text-[12px] font-mono text-cyan-600 tracking-widest uppercase mb-2 block">
                    Background
                </span>
                <p className="text-base text-neutral-400 leading-relaxed">
                    {detail.sections.context.background}
                </p>
            </MotionDiv>
        </div>
    );
};

const StrategyContent = ({ detail }: { detail: ProjectDetail }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MotionDiv = motion.div as React.ComponentType<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MotionH2 = motion.h2 as React.ComponentType<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MotionLi = motion.li as React.ComponentType<any>;

    return (
        <div className="space-y-8">
            <MotionH2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-xl font-display font-bold tracking-wider"
                style={{ color: '#00f0ff' }}
            >
                {detail.sections.strategy.title}
            </MotionH2>

            {/* Insights List */}
            <div className="space-y-4">
                <span className="text-[12px] font-mono text-cyan-600 tracking-widest uppercase">
                    Key Insights
                </span>
                <ul className="space-y-3">
                    {detail.sections.strategy.insights.map((insight, index) => (
                        <MotionLi
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            viewport={{ once: true }}
                            className="flex items-start gap-3"
                        >
                            <div
                                className="w-1.5 h-1.5 mt-2 flex-shrink-0"
                                style={{
                                    background: '#00f0ff',
                                    boxShadow: '0 0 8px rgba(0, 240, 255, 0.6)',
                                }}
                            />
                            <span className="text-neutral-300">{insight}</span>
                        </MotionLi>
                    ))}
                </ul>
            </div>

            {/* Approach */}
            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="p-6 relative"
                style={{
                    background: 'rgba(0, 240, 255, 0.03)',
                    border: '1px solid rgba(0, 240, 255, 0.1)',
                }}
            >
                <span className="text-[12px] font-mono text-cyan-600 tracking-widest uppercase mb-3 block">
                    Our Approach
                </span>
                <p className="text-neutral-300 leading-relaxed">
                    {detail.sections.strategy.approach}
                </p>
            </MotionDiv>
        </div>
    );
};

const HighlightsContent = ({ detail }: { detail: ProjectDetail }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MotionDiv = motion.div as React.ComponentType<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MotionH2 = motion.h2 as React.ComponentType<any>;

    // Gradient variations for image placeholders - matching a cinematic/editorial feel
    const gradients = [
        'linear-gradient(160deg, rgba(0, 60, 80, 0.7) 0%, rgba(10, 25, 40, 0.95) 40%, rgba(0, 100, 120, 0.5) 100%)',
        'linear-gradient(160deg, rgba(20, 50, 80, 0.7) 0%, rgba(10, 25, 40, 0.95) 40%, rgba(0, 80, 100, 0.5) 100%)',
        'linear-gradient(160deg, rgba(0, 80, 100, 0.7) 0%, rgba(10, 25, 40, 0.95) 40%, rgba(20, 60, 80, 0.5) 100%)',
    ];

    return (
        <div className="space-y-16">
            <MotionH2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-xl font-display font-bold tracking-wider"
                style={{ color: '#00f0ff' }}
            >
                {detail.sections.highlights.title}
            </MotionH2>

            {/* Highlight Items - Large Image + Text Below */}
            <div className="space-y-20">
                {detail.sections.highlights.items.map((item, index) => (
                    <MotionDiv
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 * index }}
                        viewport={{ once: true, margin: '-50px' }}
                        className="group"
                    >
                        {/* Large Image Area - Full Width (10 columns equivalent) */}
                        <div
                            className="relative w-full overflow-hidden"
                            style={{
                                aspectRatio: '16 / 9',
                                background: gradients[index % gradients.length],
                            }}
                        >
                            {/* Scan line overlay for cyberpunk aesthetic */}
                            <div
                                className="absolute inset-0 opacity-20 pointer-events-none"
                                style={{
                                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.03) 2px, rgba(0, 240, 255, 0.03) 4px)',
                                }}
                            />

                            {/* Corner decorations */}
                            <div
                                className="absolute top-0 left-0 w-12 h-12 pointer-events-none"
                                style={{
                                    borderTop: '2px solid rgba(0, 240, 255, 0.4)',
                                    borderLeft: '2px solid rgba(0, 240, 255, 0.4)',
                                }}
                            />
                            <div
                                className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none"
                                style={{
                                    borderBottom: '2px solid rgba(0, 240, 255, 0.4)',
                                    borderRight: '2px solid rgba(0, 240, 255, 0.4)',
                                }}
                            />

                            {/* Index badge */}
                            <div
                                className="absolute top-4 left-4 px-3 py-1 text-sm font-mono flex items-center gap-2"
                                style={{
                                    background: 'rgba(0, 0, 0, 0.6)',
                                    border: '1px solid rgba(0, 240, 255, 0.3)',
                                    color: '#00f0ff',
                                }}
                            >
                                <span className="opacity-50">#</span>
                                {String(index + 1).padStart(2, '0')}
                            </div>

                            {/* Hover overlay */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                    background: 'radial-gradient(ellipse at center, rgba(0, 240, 255, 0.08), transparent 70%)',
                                }}
                            />
                        </div>

                        {/* Content Below Image */}
                        <div className="mt-6 space-y-3">
                            {/* Title with subtle left accent */}
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-[2px] h-6 mt-1 flex-shrink-0"
                                    style={{
                                        background: 'linear-gradient(to bottom, rgba(0, 240, 255, 0.8), rgba(0, 240, 255, 0.2))',
                                        boxShadow: '0 0 8px rgba(0, 240, 255, 0.4)',
                                    }}
                                />
                                <h3 className="text-xl md:text-2xl font-display font-semibold text-cyan-400">
                                    {item.title}
                                </h3>
                            </div>

                            {/* Description */}
                            <p className="text-base md:text-lg text-neutral-300 leading-relaxed max-w-3xl pl-6">
                                {item.description}
                            </p>
                        </div>
                    </MotionDiv>
                ))}
            </div>
        </div>
    );
};

const OutcomeContent = ({ detail }: { detail: ProjectDetail }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MotionDiv = motion.div as React.ComponentType<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MotionH2 = motion.h2 as React.ComponentType<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MotionLi = motion.li as React.ComponentType<any>;

    return (
        <div className="space-y-8">
            <MotionH2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-xl font-display font-bold tracking-wider"
                style={{ color: '#00f0ff' }}
            >
                {detail.sections.outcome.title}
            </MotionH2>

            {/* Results */}
            <div className="space-y-4">
                <span className="text-[12px] font-mono text-green-500 tracking-widest uppercase">
                    Results
                </span>
                <ul className="space-y-3">
                    {detail.sections.outcome.results.map((result, index) => (
                        <MotionLi
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            viewport={{ once: true }}
                            className="flex items-start gap-3"
                        >
                            <i
                                className="ri-check-line text-green-500 mt-0.5"
                                style={{
                                    filter: 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.6))',
                                }}
                            />
                            <span className="text-neutral-300">{result}</span>
                        </MotionLi>
                    ))}
                </ul>
            </div>

            {/* Reflection Quote */}
            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="relative pl-6 py-4"
                style={{
                    borderLeft: '2px solid rgba(0, 240, 255, 0.5)',
                    background: 'linear-gradient(90deg, rgba(0, 240, 255, 0.03), transparent)',
                }}
            >
                <span className="text-[12px] font-mono text-cyan-600 tracking-widest uppercase mb-2 block">
                    Reflection
                </span>
                <p className="text-lg text-neutral-200 italic leading-relaxed">
                    "{detail.sections.outcome.reflection}"
                </p>
            </MotionDiv>
        </div>
    );
};
