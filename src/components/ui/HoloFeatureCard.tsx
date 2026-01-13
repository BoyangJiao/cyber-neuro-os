import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { HoloGeometry, type GeometryType } from '../three/ui/HoloGeometry';
import { HoloTiltCard } from './HoloTiltCard';
import { useAppStore } from '../../store/useAppStore';

export interface HoloFeatureCardProps {
    title: string;
    icon?: string;
    geometryType?: GeometryType;
    onClick?: () => void;
}

/**
 * HoloFeatureCard
 * 
 * 支持通过 geometryType 切换不同的 3D 几何体
 * Debug Mode 开启时使用 store 中的 debugGeometryType
 */
export const HoloFeatureCard = ({
    title,
    icon,
    geometryType = 'project',
    onClick,
}: HoloFeatureCardProps) => {
    const { debugMode, debugGeometryType } = useAppStore();

    // Debug mode 时使用 store 中的几何体类型
    const activeGeometryType = debugMode ? debugGeometryType : geometryType;

    return (
        <HoloTiltCard
            title={title}
            icon={icon}
            onClick={onClick}
            content3d={
                <Canvas
                    camera={{ position: [0, 0, 7], fov: 45 }}
                    gl={{ alpha: true, antialias: true }}
                >
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
                    <HoloGeometry type={activeGeometryType} />
                    <Environment preset="city" />
                </Canvas>
            }
        />
    );
};
