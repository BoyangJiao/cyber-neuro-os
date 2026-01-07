/**
 * StrategyContent - Section content component for Strategy section
 */
import { MotionDiv, MotionH2, MotionLi } from '../../motion/MotionWrappers';
import type { ProjectDetail } from '../../../data/projectDetails';

interface ContentProps {
    detail: ProjectDetail;
}

export const StrategyContent = ({ detail }: ContentProps) => {
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
