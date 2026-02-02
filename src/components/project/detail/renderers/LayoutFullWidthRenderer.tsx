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

export const LayoutFullWidthRenderer = ({ module, sectionId, onViewportEnter }: Props) => {
    const viewportConfig = { once: true, margin: "-10% 0px -10% 0px" };

    const borderClass = (module.showBottomBorder ?? true) ? 'border-b border-border-subtle' : '';

    // Handle legacy string values by converting them to numbers or defaults
    const getPaddingValue = (val: number | string | undefined, defaultVal: number): number => {
        if (typeof val === 'number') return val;
        // Legacy string mappings
        if (val === 'small') return 16;
        if (val === 'medium') return 24;
        if (val === 'large') return 160;
        if (val === 'extra-large') return 240;
        if (val === 'none') return 0;
        return defaultVal;
    };

    const pt = getPaddingValue(module.paddingTop, 16);
    const pb = getPaddingValue(module.paddingBottom, 160);

    return (
        <section
            id={sectionId}
            className={`${borderClass} min-h-[40vh] flex flex-col justify-center`}
            style={{ paddingTop: `${pt}px`, paddingBottom: `${pb}px` }}
        >
            <MotionDiv
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                onViewportEnter={onViewportEnter}
                className={`w-full`}
            >
                <ContentSlotRenderer blocks={module.content || []} layout="full" />
            </MotionDiv>
        </section>
    );
};
