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

export const LayoutGridRenderer = ({ module, sectionId, onViewportEnter }: Props) => {
    const viewportConfig = { once: true, margin: "-10% 0px -10% 0px" };
    const gridClass = columnClasses[module.columns] || columnClasses[3];

    return (
        <section
            id={sectionId}
            className="pt-4 pb-8 mb-4 border-b border-border-subtle"
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
