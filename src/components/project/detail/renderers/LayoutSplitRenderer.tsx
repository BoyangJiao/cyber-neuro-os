/**
 * LayoutSplitRenderer
 * 
 * 双栏布局渲染器
 * Renders two-column split layout with configurable ratio
 */
import { MotionDiv } from '../../../motion/MotionWrappers';
import { ContentSlotRenderer } from './ContentSlotRenderer';
import type { LayoutSplit } from '../../../../data/projectDetails';

interface Props {
    module: LayoutSplit;
    sectionId: string;
    onViewportEnter?: () => void;
}

const ratioGridClasses: Record<string, { left: string; right: string }> = {
    '50-50': { left: 'lg:col-span-6', right: 'lg:col-span-6' },
    '40-60': { left: 'lg:col-span-5', right: 'lg:col-span-7' },
    '60-40': { left: 'lg:col-span-7', right: 'lg:col-span-5' },
};

export const LayoutSplitRenderer = ({ module, sectionId, onViewportEnter }: Props) => {
    const viewportConfig = { once: true, margin: "-10% 0px -10% 0px" };
    const ratio = ratioGridClasses[module.ratio] || ratioGridClasses['50-50'];

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
            className={`${borderClass}`}
            style={{ paddingTop: `${pt}px`, paddingBottom: `${pb}px` }}
        >
            <MotionDiv
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                onViewportEnter={onViewportEnter}
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start"
            >
                {/* Left Column */}
                <div className={`${ratio.left}`}>
                    <ContentSlotRenderer blocks={module.leftSlot || []} />
                </div>

                {/* Right Column */}
                <div className={`${ratio.right}`}>
                    <ContentSlotRenderer blocks={module.rightSlot || []} />
                </div>
            </MotionDiv>
        </section>
    );
};
