/**
 * ParticleMorphField — Lab 3D Morph Pilot
 *
 * Extracts vertices from CrystalCore_v2.glb and morphs particles
 * from random scattered positions to the model's shape.
 *
 * - Custom ShaderMaterial with uMorphFactor uniform (0 = scattered, 1 = model)
 * - AdditiveBlending for glow that matches NeuralParticleField
 * - Smooth lerp transition driven by morphActive prop
 */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useEffect } from 'react';

// ─── Config ────────────────────────────────────────────────
const MORPH_PARTICLE_COUNT = 1200;
const SCATTER_RADIUS = 8;
const MORPH_SPEED = 2.0; // factor 0→1 speed
const ROTATION_SPEED = 0.15;

// ─── Shaders ───────────────────────────────────────────────
const morphVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMorphFactor;
  uniform float uPixelRatio;
  attribute vec3 aTargetPosition;
  attribute float aSize;
  attribute float aPhase;
  varying float vAlpha;
  varying float vMorph;

  void main() {
    // Lerp between scattered and target positions
    vec3 scattered = position;
    vec3 target = aTargetPosition;

    // Add swirl to scattered state
    float t = uTime * 0.2;
    scattered.x += sin(t + aPhase * 6.283) * 0.3;
    scattered.y += cos(t * 0.8 + aPhase * 4.0) * 0.3;
    scattered.z += sin(t * 0.5 + aPhase * 2.0) * 0.2;

    // Smooth morph with easing
    float morph = smoothstep(0.0, 1.0, uMorphFactor);
    vec3 pos = mix(scattered, target, morph);

    // Add subtle breathing when fully morphed
    if (morph > 0.9) {
      float breath = sin(uTime * 1.5) * 0.03 * morph;
      pos *= 1.0 + breath;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Size shrinks slightly when morphed (denser look)
    float morphSize = mix(aSize, aSize * 0.6, morph);
    gl_PointSize = morphSize * (200.0 / -mvPosition.z) * uPixelRatio;

    // Alpha increases when morphed
    float zFade = clamp((-mvPosition.z - 5.0) / 20.0, 0.0, 1.0);
    vAlpha = mix(0.3, 0.85, morph) * mix(1.0, 0.3, zFade);
    vMorph = morph;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const morphFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uMorphColor;
  varying float vAlpha;
  varying float vMorph;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float core = 1.0 - smoothstep(0.0, 0.12, dist);
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    glow = pow(glow, 1.8);

    // Color shifts toward morph color when assembled
    vec3 color = mix(uColor, uMorphColor, vMorph * 0.7);
    color = mix(color, vec3(1.0), core * 0.4);

    float alpha = (core * 0.8 + glow * 0.5) * vAlpha;
    gl_FragColor = vec4(color, alpha);
  }
`;

// ─── Types ─────────────────────────────────────────────────
export interface ParticleMorphFieldProps {
    morphActive: boolean;
}

// ─── Helpers ───────────────────────────────────────────────
function sampleVertices(scene: THREE.Group, count: number): Float32Array {
    // Collect all vertices from meshes in the scene
    const allVertices: THREE.Vector3[] = [];
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry) {
            const geo = child.geometry;
            const posAttr = geo.getAttribute('position');
            if (posAttr) {
                // Apply object's world transform
                const worldMatrix = child.matrixWorld;
                for (let i = 0; i < posAttr.count; i++) {
                    const v = new THREE.Vector3(
                        posAttr.getX(i),
                        posAttr.getY(i),
                        posAttr.getZ(i)
                    );
                    v.applyMatrix4(worldMatrix);
                    allVertices.push(v);
                }
            }
        }
    });

    if (allVertices.length === 0) {
        // Fallback: sphere distribution
        const result = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            const r = 2;
            result[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            result[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            result[i * 3 + 2] = r * Math.cos(phi);
        }
        return result;
    }

    // Normalize model to fit in a target bounding sphere
    const bbox = new THREE.Box3();
    allVertices.forEach((v) => bbox.expandByPoint(v));
    const center = bbox.getCenter(new THREE.Vector3());
    const size = bbox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? 4.0 / maxDim : 1.0; // Fit within radius ~2

    // Sample `count` vertices (with repetition if needed)
    const result = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const v = allVertices[i % allVertices.length];
        result[i * 3] = (v.x - center.x) * scale;
        result[i * 3 + 1] = (v.y - center.y) * scale;
        result[i * 3 + 2] = (v.z - center.z) * scale;
    }
    return result;
}

// ─── Component ─────────────────────────────────────────────
export const ParticleMorphField = ({ morphActive }: ParticleMorphFieldProps) => {
    const pointsRef = useRef<THREE.Points>(null);
    const morphFactorRef = useRef(0);
    const { primary } = useThemeColors();

    const { scene } = useGLTF('/models/CrystalCore_v2.glb');

    // Ensure scene world matrices are computed
    useMemo(() => {
        scene.updateMatrixWorld(true);
    }, [scene]);

    // Build geometry with scatter + target positions
    const { geometry, material } = useMemo(() => {
        const targetPositions = sampleVertices(scene, MORPH_PARTICLE_COUNT);
        const scatterPositions = new Float32Array(MORPH_PARTICLE_COUNT * 3);
        const sizes = new Float32Array(MORPH_PARTICLE_COUNT);
        const phases = new Float32Array(MORPH_PARTICLE_COUNT);

        for (let i = 0; i < MORPH_PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            // Random scatter positions in a sphere
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            const r = Math.random() * SCATTER_RADIUS;
            scatterPositions[i3] = r * Math.sin(phi) * Math.cos(theta);
            scatterPositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            scatterPositions[i3 + 2] = r * Math.cos(phi);

            sizes[i] = 0.8 + Math.random() * 1.5;
            phases[i] = Math.random();
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(scatterPositions, 3));
        geo.setAttribute('aTargetPosition', new THREE.BufferAttribute(targetPositions, 3));
        geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

        const mat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uMorphFactor: { value: 0 },
                uColor: { value: new THREE.Color(primary) },
                uMorphColor: { value: new THREE.Color('#ffffff') },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
            },
            vertexShader: morphVertexShader,
            fragmentShader: morphFragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        return { geometry: geo, material: mat };
    }, [scene]);

    // Cleanup WebGL resources
    useEffect(() => {
        return () => {
            geometry.dispose();
            material.dispose();
        };
    }, [geometry, material]);

    useFrame((_, delta) => {
        if (!pointsRef.current) return;

        // Smooth morph factor lerp
        const target = morphActive ? 1 : 0;
        morphFactorRef.current += (target - morphFactorRef.current) * delta * MORPH_SPEED;
        morphFactorRef.current = Math.max(0, Math.min(1, morphFactorRef.current));

        material.uniforms.uTime.value += delta;
        material.uniforms.uMorphFactor.value = morphFactorRef.current;
        material.uniforms.uColor.value.set(primary);

        // Rotate when morphed
        if (morphFactorRef.current > 0.1) {
            pointsRef.current.rotation.y += delta * ROTATION_SPEED * morphFactorRef.current;
        }
    });

    return (
        <points ref={pointsRef} geometry={geometry} material={material} />
    );
};
