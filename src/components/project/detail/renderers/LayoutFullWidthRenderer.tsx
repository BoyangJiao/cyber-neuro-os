/**
 * LayoutFullWidthRenderer
 * 
 * 全宽布局渲染器
 * Renders full-width single-column layout
 */
import { MotionDiv } from '../../../motion/MotionWrappers';
import { ContentSlotRenderer } from './ContentSlotRenderer';
import { useModulePadding } from './useModulePadding';
import type { LayoutFullWidth } from '../../../../data/projectDetails';

interface Props {
    module: LayoutFullWidth;
    sectionId: string;
    onViewportEnter?: () => void;
}

export const LayoutFullWidthRenderer = ({ module, sectionId, onViewportEnter }: Props) => {
    const viewportConfig = { once: true, margin: "-10% 0px -10% 0px" };

    const borderClass = (module.showBottomBorder ?? true) ? 'border-b border-border-subtle' : '';
    const padding = useModulePadding(module);

    return (
        <section
            id={sectionId}
            className={`${borderClass} min-h-[40vh] flex flex-col justify-center`}
            style={padding}
        >
            <MotionDiv
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                onViewportEnter={onViewportEnter}
                className={`w-full`}
            >
                <ContentSlotRenderer blocks={module.content || []} />
            </MotionDiv>
        </section>
    );
};
