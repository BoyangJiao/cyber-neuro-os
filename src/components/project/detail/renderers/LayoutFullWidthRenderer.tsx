/**
 * LayoutFullWidthRenderer
 * 
 * 全宽布局渲染器
 * Renders full-width single-column layout
 */
import { MotionDiv } from '../../../motion/MotionWrappers';
import { ContentSlotRenderer } from './ContentSlotRenderer';
import type { LayoutFullWidth } from '../../../../data/projectDetails';

interface Props {
    module: LayoutFullWidth;
    sectionId: string;
    onViewportEnter?: () => void;
}

const backgroundStyles: Record<string, string> = {
    'transparent': '',
    'dark-glass': 'bg-black/40 backdrop-blur-md border border-border-subtle rounded-xl p-8',
    'outline': 'border border-brand-primary/30 rounded-xl p-8',
};

export const LayoutFullWidthRenderer = ({ module, sectionId, onViewportEnter }: Props) => {
    const viewportConfig = { once: true, margin: "-10% 0px -10% 0px" };
    const bgClass = backgroundStyles[module.background || 'transparent'] || '';

    return (
        <section
            id={sectionId}
            className="pt-20 pb-20 mb-4 border-b border-border-subtle min-h-[40vh] flex flex-col justify-center"
        >
            <MotionDiv
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                onViewportEnter={onViewportEnter}
                className={`w-full ${bgClass}`}
            >
                <ContentSlotRenderer blocks={module.content || []} />
            </MotionDiv>
        </section>
    );
};
