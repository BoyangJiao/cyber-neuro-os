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

    return (
        <section
            id={sectionId}
            className="pt-4 pb-40 mb-4 border-b border-border-subtle"
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
