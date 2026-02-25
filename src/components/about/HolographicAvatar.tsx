import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { BodyModel } from '../three/models/BodyModel';

interface HolographicAvatarProps {
    className?: string;
}

/**
 * HolographicAvatar - 全息人形形象容器组件 (Pure 3D Canvas Layer)
 * Detached from DOM layout shifts to prevent WebGL ResizeObserver stutter.
 */
export const HolographicAvatar = ({
    className = '',
}: HolographicAvatarProps) => {

    return (
        <div className={`relative w-full h-full ${className}`}>
            {/* 背景光晕效果 */}
            <div className="absolute inset-0 bg-gradient-radial from-red-900/20 via-transparent to-transparent pointer-events-none" />

            {/* Three.js Canvas */}
            <div className="absolute inset-0 w-full h-full z-[1]">
                <Canvas
                    camera={{
                        position: [0, 0, 3],
                        fov: 45
                    }}
                    style={{ background: 'transparent' }}
                >
                    <ambientLight intensity={0.3} />
                    <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ff6666" />
                    <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#ff4444" />

                    <Suspense fallback={null}>
                        <BodyModel />
                    </Suspense>

                    <OrbitControls
                        enableRotate={true}
                        enableZoom={false}
                        enablePan={false}
                        autoRotate={false}
                        target={[0, 0, 0]}
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI / 1.5}
                    />
                </Canvas>
            </div>

            {/* 扫描线覆盖效果 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent holo-scanline" />
            </div>
        </div>
    );
};
