import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CornerFrame } from '../ui/frames/CornerFrame';
import type { CSSProperties } from 'react';
import { BodyModel } from '../three/models/BodyModel';

interface HolographicAvatarProps {
    className?: string;
}

/**
 * HolographicAvatar - 全息人形形象容器组件
 */
export const HolographicAvatar = ({ className = '' }: HolographicAvatarProps) => {
    // Frame styles for theming
    const frameStyles = {
        '--frame-line-color': 'rgba(255, 80, 80, 0.5)',
        '--frame-deco-color': 'rgba(255, 100, 100, 0.8)',
    } as CSSProperties;

    return (
        <div className={`relative w-full h-full group ${className}`} style={frameStyles}>
            {/* FrameCorners 边框 */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <CornerFrame
                    strokeWidth={2}
                    cornerSize={24}
                    className="opacity-30 group-hover:opacity-100 transition-opacity duration-300"
                    color="rgba(255, 80, 80, 0.8)"
                />

            </div>

            {/* 背景光晕效果 */}
            <div className="absolute inset-0 bg-gradient-radial from-red-900/20 via-transparent to-transparent pointer-events-none" />

            {/* Three.js Canvas */}
            <Canvas
                camera={{
                    position: [0, 0, 3],
                    fov: 45
                }}
                style={{ background: 'transparent' }}
            >
                {/* 环境光 */}
                <ambientLight intensity={0.3} />

                {/* 主方向光 */}
                <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ff6666" />
                <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#ff4444" />

                {/* 人形模型 - 使用 GLB 模型 */}
                <Suspense fallback={null}>
                    <BodyModel />
                </Suspense>

                {/* 轨道控制 - 可旋转，不可缩放 */}
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

            {/* 扫描线覆盖效果 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent holo-scanline" />
            </div>
        </div>
    );
};

