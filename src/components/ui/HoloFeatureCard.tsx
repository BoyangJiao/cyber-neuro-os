import { useState } from 'react';
import { View, Environment, PerspectiveCamera } from '@react-three/drei';
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
 * Updated to use @react-three/drei View for shared WebGL context performance.
 */
export const HoloFeatureCard = ({
    title,
    icon,
    geometryType = 'project',
    onClick,
}: HoloFeatureCardProps) => {
    const { debugMode, debugGeometryType } = useAppStore();
    const activeGeometryType = debugMode ? debugGeometryType : geometryType;
    const [isHovered, setIsHovered] = useState(false);

    return (
        <HoloTiltCard
            title={title}
            icon={icon}
            onClick={onClick}
            onHoverChange={setIsHovered}
            content3d={isHovered ? (
                <View className="w-full h-full">
                    <group>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
                        <HoloGeometry type={activeGeometryType} />
                        <Environment preset="city" />
                    </group>
                    <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
                </View>
            ) : null}
        />
    );
};
