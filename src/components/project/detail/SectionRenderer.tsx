/**
 * SectionRenderer
 * 
 * 布局模块分发器 - 根据 _type 渲染不同的布局
 * Layout module dispatcher - renders different layouts based on _type
 */
import { LayoutFullWidthRenderer } from './renderers/LayoutFullWidthRenderer';
import { LayoutSplitRenderer } from './renderers/LayoutSplitRenderer';
import { LayoutGridRenderer } from './renderers/LayoutGridRenderer';
import type { LayoutModule } from '../../../data/projectDetails';

interface SectionRendererProps {
    module: LayoutModule;
    onVisible?: (id: string) => void;
}

export const SectionRenderer = ({ module, onVisible }: SectionRendererProps) => {
    // Generate section ID from anchorId or fallback to _key
    const sectionId = module.anchorId || module._key;

    const handleViewportEnter = () => {
        onVisible?.(sectionId);
    };

    // Dispatch to appropriate layout renderer based on _type
    switch (module._type) {
        case 'layoutFullWidth':
            return (
                <LayoutFullWidthRenderer
                    module={module}
                    sectionId={sectionId}
                    onViewportEnter={handleViewportEnter}
                />
            );
        case 'layoutSplit':
            return (
                <LayoutSplitRenderer
                    module={module}
                    sectionId={sectionId}
                    onViewportEnter={handleViewportEnter}
                />
            );
        case 'layoutGrid':
            return (
                <LayoutGridRenderer
                    module={module}
                    sectionId={sectionId}
                    onViewportEnter={handleViewportEnter}
                />
            );
        default:
            // Unknown module type - render nothing
            console.warn('Unknown layout module type:', (module as any)?._type);
            return null;
    }
};

