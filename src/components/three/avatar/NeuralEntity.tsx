/**
 * NeuralEntity — the holographic particle AI avatar.
 *
 * Two paths:
 *  • Morph model (e.g. facecap.glb, ARKit blendshapes): render the model's OWN
 *    vertices (head + eyes + teeth) as a glowing point cloud and deform the head
 *    points with the REAL `jawOpen` blendshape (+ idle blink) — manual delta blend
 *    of the morph targets, so it's cheap and allocation-free per frame.
 *  • Static model (LeePerrySmith): sample vertices + a procedural jaw stand-in.
 *
 * Either way the look is the shared additive-glow shader.
 */
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { avatarVertexShader, avatarFragmentShader } from './avatarShader';

const HEAD_MODEL_URL = '/models/LeePerrySmith-draco.glb';

const FIT_RADIUS = 2.4;
const MAX_POINTS = 28000; // fallback sampling cap (morph models use all vertices)

interface NeuralEntityProps {
    jawOpen?: number;        // 0..1, driven later by audio/visemes
    autoTalk?: boolean;      // self-animate a speech-like jaw waveform
    breath?: number;         // idle breathing amplitude
    intensity?: number;      // global luminance
    pointScale?: number;     // global point-size multiplier
    modelUrl?: string;       // GLB to load
}

/** Pseudo-speech jaw envelope in [0,1] — layered sines + a syllable gate. */
function speechJaw(t: number): number {
    const syllable = Math.sin(t * 9.0) * 0.5 + 0.5;
    const flutter = Math.sin(t * 23.0) * 0.25 + 0.75;
    const gate = Math.sin(t * 1.7) > -0.3 ? 1.0 : 0.0;
    return Math.max(0, syllable * flutter * gate);
}

/** Periodic eye-blink envelope in [0,1] (quick close, quick open, long gaps). */
function blink(t: number): number {
    const phase = (t % 4.2) / 4.2;           // a blink roughly every ~4s
    if (phase > 0.06) return 0;
    const x = phase / 0.06;                   // 0..1 across the blink
    return Math.sin(x * Math.PI);             // up then down
}

// ── Morph-model driving data (built once per model) ──────────────────────────
interface MorphDrive {
    headMesh: THREE.Mesh;
    headMatrix: THREE.Matrix4;
    headStart: number;          // point index where head vertices begin
    headCount: number;          // number of head vertices
    base: Float32Array;         // neutral local positions (3×headCount)
    jaw: Float32Array | null;   // jawOpen deltas
    blinkL: Float32Array | null;
    blinkR: Float32Array | null;
    center: THREE.Vector3;
    scale: number;
}

interface Built {
    geometry: THREE.BufferGeometry;
    material: THREE.ShaderMaterial;
    morph: MorphDrive | null;
}

/** Collect every mesh's world-space vertices (deduped traversal). */
function collectMeshes(scene: THREE.Group): THREE.Mesh[] {
    const meshes: THREE.Mesh[] = [];
    scene.updateMatrixWorld(true);
    scene.traverse((c) => {
        const m = c as THREE.Mesh;
        if (m.isMesh && m.geometry?.getAttribute('position')) meshes.push(m);
    });
    return meshes;
}

export const NeuralEntity = ({
    jawOpen = 0,
    autoTalk = false,
    breath = 0.012,
    intensity = 1.0,
    pointScale = 1.0,
    modelUrl = HEAD_MODEL_URL,
}: NeuralEntityProps) => {
    const pointsRef = useRef<THREE.Points>(null);
    const jawRef = useRef(0);
    const { primary } = useThemeColors();
    const { scene } = useGLTF(modelUrl);

    const { geometry, material, morph } = useMemo<Built>(() => {
        const meshes = collectMeshes(scene);
        const headMesh = meshes.find((m) => m.morphTargetDictionary && 'jawOpen' in m.morphTargetDictionary);

        // ── Shared material ──
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uJawOpen: { value: 0 },
                uJawMaxAngle: { value: 0.32 },
                uJawHinge: { value: new THREE.Vector3(0, 0, 0) },
                uBreath: { value: breath },
                uPointScale: { value: pointScale },
                uIntensity: { value: intensity },
                uColor: { value: new THREE.Color(primary) },
                uAccent: { value: new THREE.Color('#ffffff') },
            },
            vertexShader: avatarVertexShader,
            fragmentShader: avatarFragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        // ════════════════════════════════════════════════════════════════════
        // MORPH MODEL — use the real geometry + real blendshapes
        // ════════════════════════════════════════════════════════════════════
        if (headMesh) {
            // Order meshes so the head block is contiguous and first.
            const ordered = [headMesh, ...meshes.filter((m) => m !== headMesh)];

            // Neutral world positions of every vertex (for normalization + statics).
            const tmp = new THREE.Vector3();
            const bbox = new THREE.Box3();
            const meshWorldVerts: THREE.Vector3[][] = ordered.map((m) => {
                const pos = m.geometry.getAttribute('position');
                const out: THREE.Vector3[] = [];
                for (let i = 0; i < pos.count; i++) {
                    tmp.set(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(m.matrixWorld);
                    out.push(tmp.clone());
                    bbox.expandByPoint(tmp);
                }
                return out;
            });

            const center = bbox.getCenter(new THREE.Vector3());
            const size = bbox.getSize(new THREE.Vector3());
            const scale = (FIT_RADIUS * 2) / (Math.max(size.x, size.y, size.z) || 1);

            const total = meshWorldVerts.reduce((s, v) => s + v.length, 0);
            const positions = new Float32Array(total * 3);
            const sizes = new Float32Array(total);
            const phases = new Float32Array(total);
            const jawWeights = new Float32Array(total); // unused for morph path (0)

            let w = 0;
            for (const verts of meshWorldVerts) {
                for (const v of verts) {
                    positions[w * 3] = (v.x - center.x) * scale;
                    positions[w * 3 + 1] = (v.y - center.y) * scale;
                    positions[w * 3 + 2] = (v.z - center.z) * scale;
                    sizes[w] = 0.55 + Math.random() * 0.6;
                    phases[w] = Math.random();
                    w++;
                }
            }

            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
            geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
            geo.setAttribute('aJawWeight', new THREE.BufferAttribute(jawWeights, 1));

            // Head morph deltas (glTF morph targets are relative deltas).
            const dict = headMesh.morphTargetDictionary!;
            const morphPos = headMesh.geometry.morphAttributes.position;
            const deltaOf = (name: string): Float32Array | null => {
                const idx = dict[name];
                if (idx === undefined || !morphPos?.[idx]) return null;
                return morphPos[idx].array as Float32Array;
            };
            const headPos = headMesh.geometry.getAttribute('position');
            const base = new Float32Array(headPos.count * 3);
            for (let i = 0; i < headPos.count; i++) {
                base[i * 3] = headPos.getX(i);
                base[i * 3 + 1] = headPos.getY(i);
                base[i * 3 + 2] = headPos.getZ(i);
            }

            const morph: MorphDrive = {
                headMesh,
                headMatrix: headMesh.matrixWorld.clone(),
                headStart: 0, // head is first block
                headCount: headPos.count,
                base,
                jaw: deltaOf('jawOpen'),
                blinkL: deltaOf('eyeBlink_L'),
                blinkR: deltaOf('eyeBlink_R'),
                center,
                scale,
            };

            return { geometry: geo, material: mat, morph };
        }

        // ════════════════════════════════════════════════════════════════════
        // STATIC MODEL — sample + procedural jaw (LeePerrySmith fallback)
        // ════════════════════════════════════════════════════════════════════
        const verts: THREE.Vector3[] = [];
        for (const m of meshes) {
            const pos = m.geometry.getAttribute('position');
            for (let i = 0; i < pos.count; i++) {
                verts.push(new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(m.matrixWorld));
            }
        }
        const bbox = new THREE.Box3();
        verts.forEach((v) => bbox.expandByPoint(v));
        const center = bbox.getCenter(new THREE.Vector3());
        const size = bbox.getSize(new THREE.Vector3());
        const scale = (FIT_RADIUS * 2) / (Math.max(size.x, size.y, size.z) || 1);

        const stride = Math.max(1, Math.floor(verts.length / MAX_POINTS));
        const kept: THREE.Vector3[] = [];
        for (let i = 0; i < verts.length; i += stride) kept.push(verts[i].sub(center).multiplyScalar(scale));

        const n = kept.length;
        const positions = new Float32Array(n * 3);
        const sizes = new Float32Array(n);
        const phases = new Float32Array(n);
        const jawWeights = new Float32Array(n);

        const MOUTH_D = 0.10 * FIT_RADIUS;
        const CHIN_D = 0.42 * FIT_RADIUS;
        const NECK_D = 0.66 * FIT_RADIUS;
        for (let i = 0; i < n; i++) {
            const v = kept[i];
            positions[i * 3] = v.x;
            positions[i * 3 + 1] = v.y;
            positions[i * 3 + 2] = v.z;
            sizes[i] = 0.55 + Math.random() * 0.6;
            phases[i] = Math.random();
            const d = -v.y;
            const open = THREE.MathUtils.smoothstep(d, MOUTH_D, CHIN_D);
            const notNeck = 1 - THREE.MathUtils.smoothstep(d, CHIN_D, NECK_D);
            const frontish = THREE.MathUtils.smoothstep(v.z, -0.1 * FIT_RADIUS, 0.5 * FIT_RADIUS);
            jawWeights[i] = open * notNeck * frontish;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
        geo.setAttribute('aJawWeight', new THREE.BufferAttribute(jawWeights, 1));
        mat.uniforms.uJawHinge.value.set(0, -MOUTH_D, -0.25 * FIT_RADIUS);

        return { geometry: geo, material: mat, morph: null };
    }, [scene]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => () => {
        geometry.dispose();
        material.dispose();
    }, [geometry, material]);

    useEffect(() => {
        material.uniforms.uColor.value.set(primary);
    }, [material, primary]);

    // Reusable scratch to avoid per-frame allocation in the morph path.
    const scratch = useRef(new THREE.Vector3());

    useFrame((_, delta) => {
        const u = material.uniforms;
        u.uTime.value += delta;
        u.uIntensity.value = intensity;
        u.uPointScale.value = pointScale;

        const target = autoTalk ? speechJaw(u.uTime.value) : jawOpen;
        jawRef.current += (target - jawRef.current) * Math.min(1, delta * 18);

        if (morph) {
            // Real blendshape deform: morphed = base + jaw*Δjaw + blink*Δblink.
            const { base, jaw, blinkL, blinkR, headMatrix, center, scale, headCount } = morph;
            const bl = blink(u.uTime.value);
            const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
            const arr = posAttr.array as Float32Array;
            const m = headMatrix;
            const v = scratch.current;
            for (let i = 0; i < headCount; i++) {
                const i3 = i * 3;
                let lx = base[i3], ly = base[i3 + 1], lz = base[i3 + 2];
                if (jaw) { lx += jawRef.current * jaw[i3]; ly += jawRef.current * jaw[i3 + 1]; lz += jawRef.current * jaw[i3 + 2]; }
                if (blinkL) { lx += bl * blinkL[i3]; ly += bl * blinkL[i3 + 1]; lz += bl * blinkL[i3 + 2]; }
                if (blinkR) { lx += bl * blinkR[i3]; ly += bl * blinkR[i3 + 1]; lz += bl * blinkR[i3 + 2]; }
                v.set(lx, ly, lz).applyMatrix4(m);
                arr[i3] = (v.x - center.x) * scale;
                arr[i3 + 1] = (v.y - center.y) * scale;
                arr[i3 + 2] = (v.z - center.z) * scale;
            }
            posAttr.needsUpdate = true;
        } else {
            u.uJawOpen.value = jawRef.current; // procedural path
        }
    });

    return <points ref={pointsRef} geometry={geometry} material={material} />;
};

useGLTF.preload(HEAD_MODEL_URL);
useGLTF.setDecoderPath('/draco/');
