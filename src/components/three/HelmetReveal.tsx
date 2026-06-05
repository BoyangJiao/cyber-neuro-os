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
const HEAD_MODEL_URL = '/models/Borvis.glb';   // Boyang's own face (Avaturn, with hair)
const HELMET_MODEL_URL = '/models/DamagedHelmet-geometry-draco.glb';

// Avaturn is a full body. We keep the head + a bit of shoulders (a bust) but
// ANCHOR position/size to the HEAD only, so adding more body doesn't move/resize
// the face — the body just peeks out below.
const BODY_CUT_RATIO = 0.72;     // keep triangles above this fraction (lower = more body/shoulders)
const HEAD_ANCHOR_RATIO = 0.86;  // the head region used to anchor center + scale (keep this fixed)
const HEAD_FIT = 1.7;            // head height in scene units (visual size)
const HEAD_POS_Y = -0.1;         // fine vertical nudge

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

// Solid Matcap Head — extracts just the head from the full-body Avaturn model
// (keeps triangles above HEAD_CUT_RATIO of the height), recenters + auto-fits.
const SolidHead = () => {
    const { scene } = useGLTF(HEAD_MODEL_URL);

    const { geometry, fitScale } = useMemo(() => {
        scene.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(scene);
        const h = box.max.y - box.min.y;
        const keepCutY = box.min.y + h * BODY_CUT_RATIO;   // keep head + shoulders
        const headCutY = box.min.y + h * HEAD_ANCHOR_RATIO; // head-only, for anchoring

        const pts: THREE.Vector3[] = [];
        const headBox = new THREE.Box3();                   // bounds of the HEAD region only
        const va = new THREE.Vector3(), vb = new THREE.Vector3(), vc = new THREE.Vector3();
        scene.traverse((o) => {
            const m = o as THREE.Mesh;
            const pos = m.isMesh ? (m.geometry.getAttribute('position') as THREE.BufferAttribute) : null;
            if (!pos) return;
            const index = m.geometry.index;
            const mw = m.matrixWorld;
            const count = index ? index.count : pos.count;
            for (let i = 0; i < count; i += 3) {
                const a = index ? index.getX(i) : i;
                const b = index ? index.getX(i + 1) : i + 1;
                const c = index ? index.getX(i + 2) : i + 2;
                va.fromBufferAttribute(pos, a).applyMatrix4(mw);
                vb.fromBufferAttribute(pos, b).applyMatrix4(mw);
                vc.fromBufferAttribute(pos, c).applyMatrix4(mw);
                const cy = (va.y + vb.y + vc.y) / 3;
                if (cy > keepCutY) pts.push(va.clone(), vb.clone(), vc.clone());
                if (cy > headCutY) { headBox.expandByPoint(va); headBox.expandByPoint(vb); headBox.expandByPoint(vc); }
            }
        });

        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        geo.computeVertexNormals();
        // Anchor to the HEAD: recenter on the head's center, scale by head height —
        // so the shoulders we kept extend below without moving/resizing the face.
        const headCenter = headBox.getCenter(new THREE.Vector3());
        const headSizeY = (headBox.max.y - headBox.min.y) || 1;
        geo.translate(-headCenter.x, -headCenter.y, -headCenter.z);
        return { geometry: geo, fitScale: HEAD_FIT / headSizeY };
    }, [scene]);

    const material = useMemo(() => new THREE.MeshMatcapMaterial({ color: 0xcccccc }), []);
    useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

    return <mesh geometry={geometry} material={material} scale={fitScale} position={[0, HEAD_POS_Y, 0]} />;
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
            glowColor: { value: new THREE.Color('#00e5ff') }, // Cyan scan line glow
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
            uniform float time;
            uniform vec3 color;
            uniform vec3 glowColor;
            
            varying float vYVal;
            
            void main() {
                // Top-to-bottom scan: progress 0 = nothing, progress 1 = all visible
                float topY = 1.5;
                float bottomY = -1.5;
                float currentScanY = mix(topY, bottomY, progress);
                
                // Distance from scan line (positive = above/already scanned, negative = below/not yet)
                float dist = vYVal - currentScanY;
                
                // Soft gradient reveal: smoothstep over a small band instead of hard step
                // Fragments smoothly fade in as the scan line passes over them
                float fadeWidth = 0.15;
                float scanned = smoothstep(-fadeWidth, fadeWidth * 0.5, dist);
                
                // Scan line glow: bright band right at the scan edge
                // Gaussian-like glow centered on the scan line
                float glowWidth = 0.12;
                float glowIntensity = exp(-dist * dist / (2.0 * glowWidth * glowWidth));
                // Only show glow near the active scan region (not when fully scanned)
                glowIntensity *= step(0.001, progress) * step(progress, 0.999);
                // Subtle pulse on the glow
                glowIntensity *= 0.9 + 0.1 * sin(time * 6.0);
                
                // Base wireframe alpha
                float baseAlpha = scanned * 0.55;
                
                // Combine: base wireframe + additive scan line glow
                vec3 finalColor = mix(color, glowColor, glowIntensity * 0.8);
                float finalAlpha = baseAlpha + glowIntensity * 0.6;
                
                // Discard if nothing to show
                if (finalAlpha < 0.01) discard;
                
                gl_FragColor = vec4(finalColor, finalAlpha);
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
useGLTF.setDecoderPath('/draco/');

export default HelmetReveal;
