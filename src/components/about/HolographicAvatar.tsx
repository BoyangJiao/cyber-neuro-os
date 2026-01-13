import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Animator, FrameCorners } from '@arwes/react';
import type { CSSProperties } from 'react';
import { BodyModel } from '../three/models/BodyModel';

interface HolographicAvatarProps {
    className?: string;
}

/**
 * HolographicAvatar - 全息人形形象容器组件
 * 
 * 特性：
 * - 可拖拽旋转（OrbitControls）
 * - 缓慢自动旋转
 * - 禁用缩放
 * - 设计为可替换：未来可导入 GLB 模型替换 ProceduralHumanoid
 */
export const HolographicAvatar = ({ className = '' }: HolographicAvatarProps) => {
    // FrameCorners 样式
    const frameStyles = {
        '--arwes-frames-bg-color': 'transparent',
        '--arwes-frames-line-color': 'rgba(255, 80, 80, 0.5)',
        '--arwes-frames-deco-color': 'rgba(255, 100, 100, 0.8)',
    } as CSSProperties;

    return (
        <Animator>
            <div className={`relative w-full h-full ${className}`} style={frameStyles}>
                {/* FrameCorners 边框 */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <FrameCorners
                        padding={0}
                        strokeWidth={2}
                        cornerLength={24}
                        style={{ filter: 'drop-shadow(0 0 4px rgba(255, 80, 80, 0.6))' }}
                    />
                </div>

                {/* 背景光晕效果 */}
                <div className="absolute inset-0 bg-gradient-radial from-red-900/20 via-transparent to-transparent pointer-events-none" />

                {/* Three.js Canvas */}
                <Canvas
                    camera={{
                        position: [0, 0, 3],  // 相机正对模型中心
                        fov: 45               // 稍微收窄视角以便更好地填充容器
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
                        autoRotate={false} // 由 useFrame 内部处理自动旋转
                        target={[0, 0, 0]}  // 控制器看向场景中心
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI / 1.5}
                    />
                </Canvas>

                {/* 扫描线覆盖效果 */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent holo-scanline" />
                </div>
            </div>
        </Animator>
    );
};

