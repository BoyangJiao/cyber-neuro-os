import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, Octahedron, Float } from '@react-three/drei';
import * as THREE from 'three';

export const TechGeometry = () => {
    const coreRef = useRef<THREE.Mesh>(null);
    const shellRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();

        // Core rotates slowly
        if (coreRef.current) {
            coreRef.current.rotation.x = t * 0.2;
            coreRef.current.rotation.y = t * 0.3;
        }

        // Shell rotates faster, opposite direction
        if (shellRef.current) {
            shellRef.current.rotation.x = -t * 0.4;
            shellRef.current.rotation.z = t * 0.1;
        }

        // Ring wobbles
        if (ringRef.current) {
            ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.2;
            ringRef.current.rotation.y = t * 0.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group scale={0.7}>
                {/* 1. Inner Glowing Core */}
                <Icosahedron ref={coreRef} args={[1, 0]}>
                    <meshPhysicalMaterial
                        color="#00f0ff"
                        emissive="#00f0ff"
                        emissiveIntensity={2}
                        roughness={0.1}
                        metalness={0.9}
                        transparent
                        opacity={0.8}
                        side={THREE.DoubleSide}
                    />
                </Icosahedron>

                {/* 2. Wireframe Shell (Tech Cage) */}
                <Octahedron ref={shellRef} args={[1.5, 0]}>
                    <meshBasicMaterial
                        color="#ffffff"
                        wireframe
                        transparent
                        opacity={0.3}
                    />
                </Octahedron>

                {/* 3. Orbiting Data Ring (Torus) */}
                <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[2.2, 0.02, 16, 100]} />
                    <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} />
                </mesh>

                {/* 4. Ambient Particle Cloud (Simple Points) */}
                {/* For simplicity in this iteration, just using the shapes. 
                     Complex particles can be added if performance allows. */}
            </group>
        </Float>
    );
};
