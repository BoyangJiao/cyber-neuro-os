/**
 * NarrativeSection - Main section wrapper component
 * Content components are now split into separate files for better maintainability.
 */
import { useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { MotionDiv } from '../../motion/MotionWrappers';
import type { ProjectDetail } from '../../../data/projectDetails';

// Content components (split from this file)
import { ContextContent } from './ContextContent';
import { StrategyContent } from './StrategyContent';
import { HighlightsContent } from './HighlightsContent';
import { OutcomeContent } from './OutcomeContent';

interface NarrativeSectionProps {
    id: string;
    detail: ProjectDetail;
    onVisible: (sectionId: string) => void;
}

export const NarrativeSection = ({ id, detail, onVisible }: NarrativeSectionProps) => {
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
