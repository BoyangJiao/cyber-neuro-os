/**
 * HighlightsContent - Section content component for Key Highlights
 */
import { MotionDiv, MotionH2 } from '../../motion/MotionWrappers';
import type { ProjectDetail } from '../../../data/projectDetails';

interface ContentProps {
    detail: ProjectDetail;
}

// Gradient variations for image placeholders
const gradients = [
    'linear-gradient(160deg, rgba(0, 60, 80, 0.7) 0%, rgba(10, 25, 40, 0.95) 40%, rgba(0, 100, 120, 0.5) 100%)',
    'linear-gradient(160deg, rgba(20, 50, 80, 0.7) 0%, rgba(10, 25, 40, 0.95) 40%, rgba(0, 80, 100, 0.5) 100%)',
    'linear-gradient(160deg, rgba(0, 80, 100, 0.7) 0%, rgba(10, 25, 40, 0.95) 40%, rgba(20, 60, 80, 0.5) 100%)',
];

export const HighlightsContent = ({ detail }: ContentProps) => {
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
                        {/* Large Image Area */}
                        <div
                            className="relative w-full overflow-hidden"
                            style={{
                                aspectRatio: '16 / 9',
                                background: gradients[index % gradients.length],
                            }}
                        >
                            {/* Scan line overlay */}
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
