/**
 * OutcomeContent - Section content component for Outcome section
 */
import { MotionDiv, MotionH2, MotionLi } from '../../motion/MotionWrappers';
import type { ProjectDetail } from '../../../data/projectDetails';

interface ContentProps {
    detail: ProjectDetail;
}

export const OutcomeContent = ({ detail }: ContentProps) => {
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
