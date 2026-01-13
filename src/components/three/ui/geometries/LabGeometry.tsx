import { Suspense } from 'react';
import { CrystalCore } from '../../models/CrystalCore';

/**
 * LabGeometry - 使用 CrystalCore 的统一全息效果
 * 支持 Glitch 和 Cyber RGB 效果层
 */
export const LabGeometry = () => {
    return (
        <Suspense fallback={null}>
            <CrystalCore />
        </Suspense>
    );
};
