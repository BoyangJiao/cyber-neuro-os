/**
 * NeuralEntity — the holographic particle AI avatar (Phase 0).
 *
 * Samples a head model's vertices into a glowing point cloud and exposes a
 * `jawOpen` control (0..1) that procedurally opens the mouth — proving the
 * morph-driven pipeline before real ARKit/Viseme blendshapes are wired in.
 *
 * Reuses the proven vertex-sampling + additive-glow approach from
 * ParticleMorphField. Draco decoder is the localized /draco/ path.
 */
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { avatarVertexShader, avatarFragmentShader } from './avatarShader';

const HEAD_MODEL_URL = '/models/LeePerrySmith-draco.glb';

// Target normalized size (fit head within ~this radius) and max vertices sampled.
// More points + smaller sizes = a finer, more delicate cloud.
const FIT_RADIUS = 2.4;
const MAX_POINTS = 28000;

interface NeuralEntityProps {
    /** 0 = mouth closed, 1 = fully open. Driven later by audio/visemes. */
    jawOpen?: number;
    /** When true, ignore `jawOpen` and self-animate a speech-like jaw waveform. */
    autoTalk?: boolean;
    /** Idle breathing amplitude (0 disables). */
    breath?: number;
    /** Global luminance (0..1.5). Lower = subtler, avoids additive blow-out. */
    intensity?: number;
    /** Global point-size multiplier (finer ↔ chunkier). */
    pointScale?: number;
}

/** Pseudo-speech jaw envelope in [0,1] — layered sines + a syllable gate. */
function speechJaw(t: number): number {
    const syllable = Math.sin(t * 9.0) * 0.5 + 0.5;          // ~1.4 syllables/sec
    const flutter = Math.sin(t * 23.0) * 0.25 + 0.75;        // faster mouth flutter
    const gate = Math.sin(t * 1.7) > -0.3 ? 1.0 : 0.0;       // pauses between phrases
    return Math.max(0, syllable * flutter * gate);
}

interface SampledHead {
    positions: Float32Array;
    sizes: Float32Array;
    phases: Float32Array;
    jawWeights: Float32Array;
    hinge: THREE.Vector3;
}

/** Collect, normalize, and weight head vertices for the point cloud. */
function sampleHead(scene: THREE.Group): SampledHead {
    const verts: THREE.Vector3[] = [];
    scene.updateMatrixWorld(true);
    scene.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh && mesh.geometry) {
            const posAttr = mesh.geometry.getAttribute('position');
            if (posAttr) {
                for (let i = 0; i < posAttr.count; i++) {
                    verts.push(
                        new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i))
                            .applyMatrix4(mesh.matrixWorld),
                    );
                }
            }
        }
    });

    // Normalize: center + uniform scale to FIT_RADIUS.
    const bbox = new THREE.Box3();
    verts.forEach((v) => bbox.expandByPoint(v));
    const center = bbox.getCenter(new THREE.Vector3());
    const size = bbox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = (FIT_RADIUS * 2) / maxDim;

    // Downsample to MAX_POINTS with an even stride (keeps shape, caps cost).
    const stride = Math.max(1, Math.floor(verts.length / MAX_POINTS));
    const kept: THREE.Vector3[] = [];
    for (let i = 0; i < verts.length; i += stride) {
        kept.push(verts[i].sub(center).multiplyScalar(scale));
    }

    const n = kept.length;
    const positions = new Float32Array(n * 3);
    const sizes = new Float32Array(n);
    const phases = new Float32Array(n);
    const jawWeights = new Float32Array(n);

    // After normalization the head is centered at origin. The mouth/jaw sits in
    // the lower-front; weight points by how far below the mouth line and how
    // forward (+z) they are, with a smooth falloff so the motion looks organic.
    const MOUTH_Y = -0.15 * FIT_RADIUS; // mouth line a touch below center
    const JAW_BOTTOM = -1.0 * FIT_RADIUS;
    for (let i = 0; i < n; i++) {
        const v = kept[i];
        positions[i * 3] = v.x;
        positions[i * 3 + 1] = v.y;
        positions[i * 3 + 2] = v.z;
        sizes[i] = 0.55 + Math.random() * 0.6;
        phases[i] = Math.random();

        const belowMouth = THREE.MathUtils.smoothstep(v.y, MOUTH_Y, JAW_BOTTOM); // 1 at/below jaw bottom
        const frontish = THREE.MathUtils.smoothstep(v.z, -0.2 * FIT_RADIUS, 0.6 * FIT_RADIUS);
        jawWeights[i] = belowMouth * frontish;
    }

    // Hinge: behind & slightly above the jaw (near the ears).
    const hinge = new THREE.Vector3(0, MOUTH_Y + 0.15 * FIT_RADIUS, -0.35 * FIT_RADIUS);

    return { positions, sizes, phases, jawWeights, hinge };
}

export const NeuralEntity = ({
    jawOpen = 0,
    autoTalk = false,
    breath = 0.012,
    intensity = 0.9,
    pointScale = 1.0,
}: NeuralEntityProps) => {
    const pointsRef = useRef<THREE.Points>(null);
    const jawRef = useRef(0);
    const { primary } = useThemeColors();
    const { scene } = useGLTF(HEAD_MODEL_URL);

    const { geometry, material } = useMemo(() => {
        const { positions, sizes, phases, jawWeights, hinge } = sampleHead(scene);

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
        geo.setAttribute('aJawWeight', new THREE.BufferAttribute(jawWeights, 1));

        const mat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uJawOpen: { value: 0 },
                uJawMaxAngle: { value: 0.5 }, // ~28° at full open
                uJawHinge: { value: hinge },
                uBreath: { value: breath },
                uPointScale: { value: 1.0 },
                uIntensity: { value: 0.9 },
                uColor: { value: new THREE.Color(primary) },
                uAccent: { value: new THREE.Color('#ffffff') },
            },
            vertexShader: avatarVertexShader,
            fragmentShader: avatarFragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        return { geometry: geo, material: mat };
    }, [scene, breath]);

    useEffect(() => () => {
        geometry.dispose();
        material.dispose();
    }, [geometry, material]);

    // Keep color in sync with theme only when it changes (not per frame).
    useEffect(() => {
        material.uniforms.uColor.value.set(primary);
    }, [material, primary]);

    useFrame((_, delta) => {
        material.uniforms.uTime.value += delta;
        material.uniforms.uIntensity.value = intensity;
        material.uniforms.uPointScale.value = pointScale;
        const target = autoTalk ? speechJaw(material.uniforms.uTime.value) : jawOpen;
        // Smooth the jaw toward the target so speech motion isn't jittery.
        jawRef.current += (target - jawRef.current) * Math.min(1, delta * 18);
        material.uniforms.uJawOpen.value = jawRef.current;
    });

    return <points ref={pointsRef} geometry={geometry} material={material} />;
};

useGLTF.preload(HEAD_MODEL_URL);
useGLTF.setDecoderPath('/draco/');
