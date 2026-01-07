/**
 * ContextContent - Section content component for Context section
 */
import { MotionDiv, MotionH2 } from '../../motion/MotionWrappers';
import type { ProjectDetail } from '../../../data/projectDetails';

interface ContentProps {
    detail: ProjectDetail;
}

export const ContextContent = ({ detail }: ContentProps) => {
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
