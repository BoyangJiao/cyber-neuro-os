import { Suspense } from 'react';
import { PolaroidCamera } from '../../models/PolaroidCamera';

export const CameraGeometry = () => {
    return (
        <Suspense fallback={null}>
            <PolaroidCamera />
        </Suspense>
    );
};
