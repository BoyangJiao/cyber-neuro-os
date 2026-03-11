import { useState, Suspense } from 'react';
import { View, PerspectiveCamera } from '@react-three/drei';
import { HoloGeometry, type GeometryType } from '../three/ui/HoloGeometry';
import { HoloTiltCard } from './HoloTiltCard';
import { useAppStore } from '../../store/useAppStore';
import { useThemeColors } from '../../hooks/useThemeColors';

export interface HoloFeatureCardProps {
    title: string;
    icon?: string;
    geometryType?: GeometryType;
    subtitle?: string;
    glitchType?: 'heavy' | 'rgb' | 'slice' | 'vertical' | 'subtle' | 'standard';
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
    const { primary } = useThemeColors();

    const activeColor = primary;

    return (
        <HoloTiltCard
            title={title}
            icon={icon}
            onClick={onClick}
            onHoverChange={setIsHovered}
            content3d={isHovered ? (
                <Suspense fallback={null}>
                    <View className="w-full h-full">
                        <group>
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} intensity={1} color={activeColor} />
                            <HoloGeometry type={activeGeometryType} />
                            {/* Removed preset="city" to avoid CDN blocking, added more local lights */}
                            <pointLight position={[-10, -10, -10]} intensity={0.5} color={activeColor} />
                            <pointLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
                        </group>
                        <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
                    </View>
                </Suspense>
            ) : null}
        />
    );
};
