import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { TechGeometry } from '../three/ui/TechGeometry';
import { HoloTiltCard } from './HoloTiltCard';

export interface HoloFeatureCardProps {
    title: string;
    icon?: string;
    imageFlatUrl?: string; // Kept for API compat
    onClick?: () => void;
}

/**
 * HoloFeatureCard
 * Now strictly a composition of the generic HoloTiltCard and the specific TechGeometry.
 */
export const HoloFeatureCard = ({
    title,
    icon,
    onClick,
}: HoloFeatureCardProps) => {
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
                    <TechGeometry />
                    <Environment preset="city" />
                </Canvas>
            }
        />
    );
};
