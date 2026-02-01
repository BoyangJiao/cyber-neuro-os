/**
 * HelmetReveal - Holographic Helmet Scan Effect
 * 
 * Creates a clean wireframe helmet progressively revealing over a solid head model
 * Scan progresses from TOP to BOTTOM, synced with boot progress
 * Wireframe stays visible after being scanned
 * [VERIFIED] Memory cleanup confirmed for geometry disposal
 */
import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// URLs for the 3D models
// Local compressed models
const HEAD_MODEL_URL = '/models/LeePerrySmith-draco.glb';
const HELMET_MODEL_URL = '/models/DamagedHelmet-geometry-draco.glb';

// Debug settings constants (hardcoded after debugging)
const HELMET_TRANSFORM = {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    posX: 0,
    posY: 0,
    posZ: 0.3,
    scale: 1.4
};

// Global uniforms
const globalUniforms = {
    time: { value: 0 },
    progress: { value: 0 }
};

// Solid Matcap Head (grey/white smooth head)
const SolidHead = () => {
    const { scene } = useGLTF(HEAD_MODEL_URL);
    // Remove meshRef as it's not strictly needed for the group logic here, or we can keep it if we want to add rotation later
    const meshRef = useRef<THREE.Group>(null);

    useEffect(() => {
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                // White/grey matcap material
                child.material = new THREE.MeshMatcapMaterial({
                    color: 0xcccccc,
                });
            }
        });
    }, [scene]);

    return (
        <primitive
            ref={meshRef}
            object={scene}
            scale={0.35}
            position={[0, -0.6, 0]}  // Lower position so bottom touches screen edge
            rotation={[0, 0, 0]}
        />
    );
};

// Wireframe Helmet - progressively reveals from top to bottom
// Uses shader for precise control with finer, cleaner look
// Following reference: geometry is rotated directly, not the mesh
const WireframeHelmet = ({ progress }: { progress: number }) => {
    const { scene } = useGLTF(HELMET_MODEL_URL);
    const groupRef = useRef<THREE.Group>(null);
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);

    // Create wireframe shader material with finer appearance
    // Using position.y since geometry will be pre-rotated
    const wireframeMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            time: globalUniforms.time,
            progress: { value: 0 },
            color: { value: new THREE.Color('#ffffff') }, // White wireframe for dark background
        },
        vertexShader: `
            varying float vYVal;
            
            void main() {
                // Use World Space Y position to ensure scanning is always strictly vertical (Top to Bottom)
                // independent of the model's local orientation or rotation.
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vYVal = worldPosition.y;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float progress;
            uniform vec3 color;
            
            varying float vYVal;
            
            void main() {
                // Top-to-bottom scan: progress 0 = nothing, progress 1 = all visible
                // Use very wide range to ensure ALL parts of helmet are visible
                float topY = 1.5;
                float bottomY = -1.5;
                float currentScanY = mix(topY, bottomY, progress);
                
                // Show wireframe for parts ABOVE the scan line (already scanned)
                float scanned = step(currentScanY, vYVal);
                
                // Alpha: visible if scanned
                float alpha = scanned * 0.55;
                
                // Discard if not yet scanned
                if (alpha < 0.01) discard;
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        wireframe: true,
        wireframeLinewidth: 1,  // Thin lines for precision
        side: THREE.DoubleSide,
        depthWrite: false
    }), []);

    useEffect(() => {
        materialRef.current = wireframeMaterial;
    }, [wireframeMaterial]);

    useFrame(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.progress.value = progress;
            materialRef.current.uniforms.time.value = globalUniforms.time.value;
        }
    });

    // Clone scene and ROTATE GEOMETRY using hardcoded values
    const clonedScene = useMemo(() => {
        const clone = scene.clone();
        clone.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                // Clone and rotate the geometry directly
                const rotatedGeometry = child.geometry.clone();
                // Apply rotations from constants
                rotatedGeometry.rotateX(HELMET_TRANSFORM.rotateX);
                rotatedGeometry.rotateY(HELMET_TRANSFORM.rotateY);
                rotatedGeometry.rotateZ(HELMET_TRANSFORM.rotateZ);
                child.geometry = rotatedGeometry;
                child.material = wireframeMaterial;
            }
        });
        return clone;
    }, [scene, wireframeMaterial]);

    // Dispose of the cloned geometries when the component unmounts to prevent memory leaks
    useEffect(() => {
        return () => {
            wireframeMaterial.dispose();
            clonedScene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry.dispose();
                }
            });
        };
    }, [clonedScene, wireframeMaterial]);

    return (
        <primitive
            ref={groupRef}
            object={clonedScene}
            scale={HELMET_TRANSFORM.scale}
            position={[HELMET_TRANSFORM.posX, HELMET_TRANSFORM.posY, HELMET_TRANSFORM.posZ]}
            rotation={[0, 0, 0]}
        />
    );
};

// Animation controller
const AnimationController = ({ progress }: { progress: number }) => {
    useFrame((state) => {
        globalUniforms.time.value = state.clock.elapsedTime;
        globalUniforms.progress.value = progress;
    });
    return null;
};

// Camera setup - positioned for side view initially
const CameraSetup = () => {
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(0, 0, 6);  // Front view position
        camera.lookAt(0, 0, 0);
    }, [camera]);

    return null;
};

// Rotating container - stays at side view, rotates to front ONLY when complete
const RotatingContainer = ({ progress, children }: { progress: number; children: React.ReactNode }) => {
    const groupRef = useRef<THREE.Group>(null);
    const rotationRef = useRef(-Math.PI / 2);  // Current rotation (starts at side view)
    const isComplete = progress >= 1;  // Loading complete when progress reaches 100%

    useFrame((_, delta) => {
        if (groupRef.current) {
            const startRotation = -Math.PI / 2; // Side view
            const endRotation = 0; // Front view

            // Determine target rotation based on completion status
            const targetRotation = isComplete ? endRotation : startRotation;

            // Clamp delta to prevent smooth animation from breaking during lag spikes (e.g. heavy component mounting)
            const safeDelta = Math.min(delta, 0.1);

            // Smoothly interpolate towards the target rotation at all times
            // This prevents "snapping" and handles frame drops gracefully
            const speed = 2.5;
            rotationRef.current += (targetRotation - rotationRef.current) * speed * safeDelta;

            // Apply rotation
            groupRef.current.rotation.y = rotationRef.current;
        }
    });

    return (
        <group ref={groupRef}>
            {children}
        </group>
    );
};


// Main scene
const HelmetScene = ({ progress }: { progress: number }) => {
    return (
        <>
            <CameraSetup />
            <AnimationController progress={progress} />

            {/* Soft ambient lighting */}
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={0.5} />
            <directionalLight position={[-5, 3, -3]} intensity={0.3} />

            {/* Rotating container - holds both head and helmet */}
            <RotatingContainer progress={progress}>
                {/* Solid matcap head */}
                <SolidHead />

                {/* Wireframe helmet - progressively reveals */}
                <WireframeHelmet progress={progress} />
            </RotatingContainer>
        </>
    );
};


// Main component export
interface HelmetRevealProps {
    progress: number; // 0-100
    className?: string;
}

export const HelmetReveal = ({ progress, className = '' }: HelmetRevealProps) => {
    const normalizedProgress = Math.min(progress / 100, 1);

    return (
        <div className={`absolute inset-0 ${className}`} style={{ zIndex: 0 }}>
            <Canvas
                camera={{ position: [0, 0, 6], fov: 30 }}
                style={{ background: 'transparent' }}
                gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            >
                <HelmetScene progress={normalizedProgress} />
            </Canvas>
        </div>
    );
};

// Preload models
useGLTF.preload(HEAD_MODEL_URL);
useGLTF.preload(HELMET_MODEL_URL);

export default HelmetReveal;
