/**
 * NeuralEntity — the holographic particle/wireframe AI avatar.
 *
 * Morph model (e.g. facecap.glb, ARKit blendshapes):
 *   • a deforming WIREFRAME of the head mesh (native morph targets — the whole
 *     surface moves coherently when the jaw opens) → reads clearly as a face and
 *     looks like an intentional digital construct (escapes the uncanny valley).
 *   • an optional layer of glowing POINTS on the same vertices for sparkle
 *     (CPU delta-blend of the same morphs).
 *   • driven by the real `jawOpen` blendshape + idle eye-blink. Eyes/teeth meshes
 *     are dropped (the realistic eyeball topology reads as creepy spirals).
 * Static model (LeePerrySmith): sampled points + a procedural jaw stand-in.
 */
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { avatarVertexShader, avatarFragmentShader } from './avatarShader';

const HEAD_MODEL_URL = '/models/LeePerrySmith-draco.glb';

const FIT_RADIUS = 2.4;
const MAX_POINTS = 28000;

interface NeuralEntityProps {
    jawOpen?: number;
    autoTalk?: boolean;
    breath?: number;
    intensity?: number;
    pointScale?: number;
    modelUrl?: string;
    showWire?: boolean;   // wireframe surface (morph models)
    showPoints?: boolean; // glowing point layer
}

function speechJaw(t: number): number {
    const syllable = Math.sin(t * 9.0) * 0.5 + 0.5;
    const flutter = Math.sin(t * 23.0) * 0.25 + 0.75;
    const gate = Math.sin(t * 1.7) > -0.3 ? 1.0 : 0.0;
    return Math.max(0, syllable * flutter * gate);
}

function blink(t: number): number {
    const phase = (t % 4.2) / 4.2;
    if (phase > 0.06) return 0;
    return Math.sin((phase / 0.06) * Math.PI);
}

interface MorphDrive {
    headCount: number;
    base: Float32Array;
    jaw: Float32Array | null;
    blinkL: Float32Array | null;
    blinkR: Float32Array | null;
    matrix: THREE.Matrix4;      // local → normalized world
    jawIdx?: number;
    blinkLIdx?: number;
    blinkRIdx?: number;
}

interface Built {
    geometry: THREE.BufferGeometry;
    material: THREE.ShaderMaterial;
    morph: MorphDrive | null;
    wireMesh: THREE.Mesh | null;
    wireMat: THREE.MeshBasicMaterial | null;
}

function collectMeshes(scene: THREE.Group): THREE.Mesh[] {
    const meshes: THREE.Mesh[] = [];
    scene.updateMatrixWorld(true);
    scene.traverse((c) => {
        const m = c as THREE.Mesh;
        if (m.isMesh && m.geometry?.getAttribute('position')) meshes.push(m);
    });
    return meshes;
}

/** Normalization matrix: local → (matrixWorld → center/scale-fit to FIT_RADIUS). */
function normMatrix(matrixWorld: THREE.Matrix4, center: THREE.Vector3, scale: number): THREE.Matrix4 {
    const M = new THREE.Matrix4().makeScale(scale, scale, scale).multiply(matrixWorld);
    return M.premultiply(new THREE.Matrix4().makeTranslation(-center.x * scale, -center.y * scale, -center.z * scale));
}

export const NeuralEntity = ({
    jawOpen = 0,
    autoTalk = false,
    breath = 0.012,
    intensity = 1.0,
    pointScale = 1.0,
    modelUrl = HEAD_MODEL_URL,
    showWire = true,
    showPoints = true,
}: NeuralEntityProps) => {
    const pointsRef = useRef<THREE.Points>(null);
    const jawRef = useRef(0);
    const { primary } = useThemeColors();
    const { scene } = useGLTF(modelUrl);

    const { geometry, material, morph, wireMesh, wireMat } = useMemo<Built>(() => {
        const meshes = collectMeshes(scene);
        const headMesh = meshes.find((m) => m.morphTargetDictionary && 'jawOpen' in m.morphTargetDictionary);

        const mat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uJawOpen: { value: 0 },
                uJawMaxAngle: { value: 0.32 },
                uJawHinge: { value: new THREE.Vector3(0, 0, 0) },
                uBreath: { value: breath },
                uPointScale: { value: pointScale },
                uShimmer: { value: 0.02 },
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

        // ── MORPH MODEL: head-only wireframe + points, native + CPU morph ──
        if (headMesh) {
            const headGeo = headMesh.geometry;
            const headPos = headGeo.getAttribute('position');
            const count = headPos.count;

            // Neutral bounds (world space) for normalization.
            const tmp = new THREE.Vector3();
            const bbox = new THREE.Box3();
            for (let i = 0; i < count; i++) {
                tmp.set(headPos.getX(i), headPos.getY(i), headPos.getZ(i)).applyMatrix4(headMesh.matrixWorld);
                bbox.expandByPoint(tmp);
            }
            const center = bbox.getCenter(new THREE.Vector3());
            const size = bbox.getSize(new THREE.Vector3());
            const scale = (FIT_RADIUS * 2) / (Math.max(size.x, size.y, size.z) || 1);
            const matrix = normMatrix(headMesh.matrixWorld, center, scale);

            // Points geometry (neutral normalized positions of head verts).
            const positions = new Float32Array(count * 3);
            const sizes = new Float32Array(count);
            const phases = new Float32Array(count);
            const jawWeights = new Float32Array(count);
            for (let i = 0; i < count; i++) {
                tmp.set(headPos.getX(i), headPos.getY(i), headPos.getZ(i)).applyMatrix4(matrix);
                positions[i * 3] = tmp.x;
                positions[i * 3 + 1] = tmp.y;
                positions[i * 3 + 2] = tmp.z;
                sizes[i] = 0.5 + Math.random() * 0.5;
                phases[i] = Math.random();
            }
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
            geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
            geo.setAttribute('aJawWeight', new THREE.BufferAttribute(jawWeights, 1));

            // Morph deltas (relative) for the CPU-driven point layer.
            const dict = headMesh.morphTargetDictionary!;
            const morphPos = headGeo.morphAttributes.position;
            const deltaOf = (name: string) => {
                const idx = dict[name];
                return idx !== undefined && morphPos?.[idx] ? (morphPos[idx].array as Float32Array) : null;
            };
            const base = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                base[i * 3] = headPos.getX(i);
                base[i * 3 + 1] = headPos.getY(i);
                base[i * 3 + 2] = headPos.getZ(i);
            }

            // Deforming wireframe of the SAME head geometry (native morph).
            const wMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(primary),
                wireframe: true,
                transparent: true,
                opacity: 0.55,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            });
            const wMesh = new THREE.Mesh(headGeo, wMat);
            wMesh.matrixAutoUpdate = false;
            wMesh.matrix.copy(matrix);

            const morph: MorphDrive = {
                headCount: count,
                base,
                jaw: deltaOf('jawOpen'),
                blinkL: deltaOf('eyeBlink_L'),
                blinkR: deltaOf('eyeBlink_R'),
                matrix,
                jawIdx: dict['jawOpen'],
                blinkLIdx: dict['eyeBlink_L'],
                blinkRIdx: dict['eyeBlink_R'],
            };

            return { geometry: geo, material: mat, morph, wireMesh: wMesh, wireMat: wMat };
        }

        // ── STATIC MODEL: sampled points + procedural jaw (LeePerrySmith) ──
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
        const MOUTH_D = 0.10 * FIT_RADIUS, CHIN_D = 0.42 * FIT_RADIUS, NECK_D = 0.66 * FIT_RADIUS;
        for (let i = 0; i < n; i++) {
            const v = kept[i];
            positions[i * 3] = v.x; positions[i * 3 + 1] = v.y; positions[i * 3 + 2] = v.z;
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

        return { geometry: geo, material: mat, morph: null, wireMesh: null, wireMat: null };
    }, [scene]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => () => {
        geometry.dispose();
        material.dispose();
        wireMat?.dispose();
    }, [geometry, material, wireMat]);

    useEffect(() => {
        material.uniforms.uColor.value.set(primary);
        wireMat?.color.set(primary);
    }, [material, wireMat, primary]);

    const scratch = useRef(new THREE.Vector3());

    useFrame((_, delta) => {
        const u = material.uniforms;
        u.uTime.value += delta;
        u.uIntensity.value = intensity;
        u.uPointScale.value = pointScale;

        const target = autoTalk ? speechJaw(u.uTime.value) : jawOpen;
        jawRef.current += (target - jawRef.current) * Math.min(1, delta * 18);
        const bl = morph ? blink(u.uTime.value) : 0;

        if (morph) {
            // Drive the wireframe's native morph influences.
            if (wireMesh?.morphTargetInfluences) {
                const inf = wireMesh.morphTargetInfluences;
                if (morph.jawIdx !== undefined) inf[morph.jawIdx] = jawRef.current;
                if (morph.blinkLIdx !== undefined) inf[morph.blinkLIdx] = bl;
                if (morph.blinkRIdx !== undefined) inf[morph.blinkRIdx] = bl;
            }
            // CPU delta-blend the point layer to match (only when visible).
            if (showPoints) {
                const { base, jaw, blinkL, blinkR, matrix, headCount } = morph;
                const arr = (geometry.getAttribute('position') as THREE.BufferAttribute).array as Float32Array;
                const v = scratch.current;
                for (let i = 0; i < headCount; i++) {
                    const i3 = i * 3;
                    let lx = base[i3], ly = base[i3 + 1], lz = base[i3 + 2];
                    if (jaw) { lx += jawRef.current * jaw[i3]; ly += jawRef.current * jaw[i3 + 1]; lz += jawRef.current * jaw[i3 + 2]; }
                    if (blinkL) { lx += bl * blinkL[i3]; ly += bl * blinkL[i3 + 1]; lz += bl * blinkL[i3 + 2]; }
                    if (blinkR) { lx += bl * blinkR[i3]; ly += bl * blinkR[i3 + 1]; lz += bl * blinkR[i3 + 2]; }
                    v.set(lx, ly, lz).applyMatrix4(matrix);
                    arr[i3] = v.x; arr[i3 + 1] = v.y; arr[i3 + 2] = v.z;
                }
                (geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
            }
        } else {
            u.uJawOpen.value = jawRef.current;
        }
    });

    return (
        <>
            {showPoints && <points ref={pointsRef} geometry={geometry} material={material} />}
            {showWire && wireMesh && <primitive object={wireMesh} />}
        </>
    );
};

useGLTF.preload(HEAD_MODEL_URL);
useGLTF.setDecoderPath('/draco/');
