import { Suspense } from 'react';
import { CrystalCore } from '../../models/CrystalCore';

/**
 * VideoGeometry - 使用 CrystalCore 的菲涅尔全息效果
 * 支持 Glitch 和 Cyber RGB 效果层
 */
export const VideoGeometry = () => {
    return (
        <Suspense fallback={null}>
            <CrystalCore />
        </Suspense>
    );
};
