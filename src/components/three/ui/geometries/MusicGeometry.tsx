import { Suspense } from 'react';
import { CrystalCore } from '../../models/CrystalCore';

/**
 * MusicGeometry - 使用 CrystalCore 的统一全息效果
 * 支持 Glitch 和 Cyber RGB 效果层
 */
export const MusicGeometry = () => {
    return (
        <Suspense fallback={null}>
            <CrystalCore />
        </Suspense>
    );
};
