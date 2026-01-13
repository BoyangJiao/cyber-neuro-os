import { Suspense } from 'react';
import { CrystalCore } from '../../models/CrystalCore';

/**
 * ProjectGeometry - 使用 CrystalCore GLB 模型的菲涅尔全息效果
 */
export const ProjectGeometry = () => {
    return (
        <Suspense fallback={null}>
            <CrystalCore />
        </Suspense>
    );
};
