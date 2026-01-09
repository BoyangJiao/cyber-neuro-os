import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Animator, FrameCorners } from '@arwes/react';
import * as THREE from 'three';
import type { CSSProperties } from 'react';

/**
 * ProceduralHumanoid - 程序化生成的人形轮廓
 * 
 * 设计为可替换组件：未来可用 GLB 模型替换此组件，
 * 只需保持相同的旋转逻辑和材质接口。
 */
const ProceduralHumanoid = () => {
    const groupRef = useRef<THREE.Group>(null);

    // 自动旋转动画
    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.15;
        }
    });

    // 全息材质 - 青色发光线框效果
    const holoMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        color: new THREE.Color(0xff3333), // 红色基调匹配设计稿
        wireframe: true,
        transparent: true,
        opacity: 0.85,
    }), []);

    // 发光边缘材质
    const glowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        color: new THREE.Color(0xff5555),
        wireframe: true,
        transparent: true,
        opacity: 0.4,
    }), []);

    return (
        // 模型几何范围: 脚 y≈-0.2, 头 y≈1.75, 中心约 y≈0.75
        // 将整个组下移使几何中心对齐场景原点
        <group ref={groupRef} position={[0, -0.75, 0]}>
            {/* 头部 */}
            <mesh position={[0, 1.6, 0]} material={holoMaterial}>
                <sphereGeometry args={[0.15, 16, 16]} />
            </mesh>
            <mesh position={[0, 1.6, 0]} material={glowMaterial} scale={1.1}>
                <sphereGeometry args={[0.15, 16, 16]} />
            </mesh>

            {/* 颈部 */}
            <mesh position={[0, 1.4, 0]} material={holoMaterial}>
                <cylinderGeometry args={[0.05, 0.08, 0.1, 8]} />
            </mesh>

            {/* 躯干 */}
            <mesh position={[0, 1.05, 0]} material={holoMaterial}>
                <boxGeometry args={[0.35, 0.6, 0.18]} />
            </mesh>
            <mesh position={[0, 1.05, 0]} material={glowMaterial} scale={1.05}>
                <boxGeometry args={[0.35, 0.6, 0.18]} />
            </mesh>

            {/* 骨盆 */}
            <mesh position={[0, 0.7, 0]} material={holoMaterial}>
                <boxGeometry args={[0.32, 0.15, 0.15]} />
            </mesh>

            {/* 左臂 */}
            <group position={[-0.25, 1.2, 0]}>
                {/* 上臂 */}
                <mesh position={[-0.08, -0.12, 0]} rotation={[0, 0, 0.15]} material={holoMaterial}>
                    <cylinderGeometry args={[0.04, 0.035, 0.28, 8]} />
                </mesh>
                {/* 前臂 */}
                <mesh position={[-0.15, -0.38, 0]} rotation={[0, 0, 0.1]} material={holoMaterial}>
                    <cylinderGeometry args={[0.035, 0.03, 0.26, 8]} />
                </mesh>
                {/* 手 */}
                <mesh position={[-0.18, -0.55, 0]} material={holoMaterial}>
                    <boxGeometry args={[0.06, 0.08, 0.03]} />
                </mesh>
            </group>

            {/* 右臂 */}
            <group position={[0.25, 1.2, 0]}>
                {/* 上臂 */}
                <mesh position={[0.08, -0.12, 0]} rotation={[0, 0, -0.15]} material={holoMaterial}>
                    <cylinderGeometry args={[0.04, 0.035, 0.28, 8]} />
                </mesh>
                {/* 前臂 */}
                <mesh position={[0.15, -0.38, 0]} rotation={[0, 0, -0.1]} material={holoMaterial}>
                    <cylinderGeometry args={[0.035, 0.03, 0.26, 8]} />
                </mesh>
                {/* 手 */}
                <mesh position={[0.18, -0.55, 0]} material={holoMaterial}>
                    <boxGeometry args={[0.06, 0.08, 0.03]} />
                </mesh>
            </group>

            {/* 左腿 */}
            <group position={[-0.1, 0.6, 0]}>
                {/* 大腿 */}
                <mesh position={[0, -0.22, 0]} material={holoMaterial}>
                    <cylinderGeometry args={[0.055, 0.045, 0.4, 8]} />
                </mesh>
                {/* 小腿 */}
                <mesh position={[0, -0.6, 0]} material={holoMaterial}>
                    <cylinderGeometry args={[0.045, 0.035, 0.38, 8]} />
                </mesh>
                {/* 脚 */}
                <mesh position={[0.02, -0.82, 0.03]} material={holoMaterial}>
                    <boxGeometry args={[0.06, 0.05, 0.12]} />
                </mesh>
            </group>

            {/* 右腿 */}
            <group position={[0.1, 0.6, 0]}>
                {/* 大腿 */}
                <mesh position={[0, -0.22, 0]} material={holoMaterial}>
                    <cylinderGeometry args={[0.055, 0.045, 0.4, 8]} />
                </mesh>
                {/* 小腿 */}
                <mesh position={[0, -0.6, 0]} material={holoMaterial}>
                    <cylinderGeometry args={[0.045, 0.035, 0.38, 8]} />
                </mesh>
                {/* 脚 */}
                <mesh position={[-0.02, -0.82, 0.03]} material={holoMaterial}>
                    <boxGeometry args={[0.06, 0.05, 0.12]} />
                </mesh>
            </group>

            {/* 脊柱骨架线条 - 增加细节 */}
            <mesh position={[0, 1.05, -0.05]} material={glowMaterial}>
                <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
            </mesh>
        </group>
    );
};

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

                    {/* 人形模型 */}
                    <ProceduralHumanoid />

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

