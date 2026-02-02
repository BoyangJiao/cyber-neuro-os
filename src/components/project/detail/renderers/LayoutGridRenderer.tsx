/**
 * LayoutGridRenderer
 * 
 * 网格布局渲染器
 * Renders gallery/grid layout with configurable columns
 */
import { MotionDiv } from '../../../motion/MotionWrappers';
import { ContentSlotRenderer } from './ContentSlotRenderer';
import type { LayoutGrid } from '../../../../data/projectDetails';

interface Props {
    module: LayoutGrid;
    sectionId: string;
    onViewportEnter?: () => void;
}

const columnClasses: Record<number, string> = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

// Helper for dynamic padding classes
// Helper for dynamic padding classes (REMOVED in favor of inline styles for number support)

export const LayoutGridRenderer = ({ module, sectionId, onViewportEnter }: Props) => {
    const viewportConfig = { once: true, margin: "-10% 0px -10% 0px" };
    const gridClass = columnClasses[module.columns] || columnClasses[3];

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
                className={`grid ${gridClass} gap-6 2xl:gap-8`}
            >
                {(module.items || []).map((item) => (
                    <div key={item._key} className="w-full">
                        <ContentSlotRenderer blocks={[item]} />
                    </div>
                ))}
            </MotionDiv>
        </section>
    );
};
