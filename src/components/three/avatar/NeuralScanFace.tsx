/**
 * NeuralScanFace — dense depth-false-color point cloud (Kinect/Lusion vibe).
 *
 * Technique (per the proven WebGL point-cloud playbook):
 *  • Evenly RE-SAMPLE the head surface by triangle area → tens of thousands of
 *    uniformly-spaced points (fixes the sparse/uneven mesh-vertex look).
 *  • Each sample stores its triangle + barycentric coords, so when the head
 *    deforms via the real `jawOpen`/blink blendshapes (CPU delta-blend of the
 *    base verts) the samples follow exactly.
 *  • Custom point shader: additive glow + size attenuation + DEPTH FALSE-COLOR
 *    (near = bright cyan-white → far = dim deep blue) so the face reads as a 3D
 *    relief, not flat snow + a subtle high-freq jitter for the "scan" feel.
 *  • Bloom/chroma/grain (lab) supply the hazy veil.
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const HEAD_MODEL_URL = '/models/facecap-clean.glb';
const FIT_RADIUS = 2.4;
const SAMPLE_COUNT = 60000;

interface NeuralScanFaceProps {
    modelUrl?: string;
    jawOpen?: number;
    autoTalk?: boolean;
    intensity?: number;
    pointScale?: number;
    shimmer?: number;
}

function speechJaw(t: number): number {
    const syllable = Math.sin(t * 9.0) * 0.5 + 0.5;
    const flutter = Math.sin(t * 23.0) * 0.25 + 0.75;
    const gate = Math.sin(t * 1.7) > -0.3 ? 1.0 : 0.0;
    return Math.max(0, syllable * flutter * gate);
}
function blink(t: number): number {
    const phase = (t % 4.2) / 4.2;
    return phase > 0.06 ? 0 : Math.sin((phase / 0.06) * Math.PI);
}

const scanVert = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uPointScale;
  uniform float uShimmer;
  attribute float aSize;
  attribute float aPhase;
  varying float vZ;
  void main() {
    vec3 pos = position;
    pos.z += sin(uTime * 18.0 + aPhase * 90.0) * uShimmer;        // subtle scan jitter
    pos.x += cos(uTime * 14.0 + aPhase * 70.0) * uShimmer * 0.5;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vZ = -mv.z;
    float size = aSize * uPointScale * (190.0 / -mv.z) * uPixelRatio; // size attenuation
    gl_PointSize = clamp(size, 0.6, 3.4 * uPixelRatio);
    gl_Position = projectionMatrix * mv;
  }
`;
const scanFrag = /* glsl */ `
  uniform vec3 uNear;
  uniform vec3 uFar;
  uniform float uIntensity;
  uniform float uDepthNear;
  uniform float uDepthFar;
  varying float vZ;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float core = 1.0 - smoothstep(0.0, 0.12, d);
    float glow = pow(1.0 - smoothstep(0.0, 0.5, d), 2.2);
    float t = clamp((vZ - uDepthNear) / (uDepthFar - uDepthNear), 0.0, 1.0);
    vec3 col = mix(uNear, uFar, t);
    float bright = mix(1.25, 0.3, t);   // near bright, far dim → 3D relief read
    float a = (core * 0.55 + glow * 0.4) * uIntensity * bright;
    gl_FragColor = vec4(col * bright, a);
  }
`;

interface Built {
    geometry: THREE.BufferGeometry;
    material: THREE.ShaderMaterial;
    base: Float32Array;        // neutral local head verts (3×V)
    jaw: Float32Array | null;
    blinkL: Float32Array | null;
    blinkR: Float32Array | null;
    matrix: THREE.Matrix4;     // local → normalized world
    triA: Uint32Array;         // per-sample triangle vertex indices
    triB: Uint32Array;
    triC: Uint32Array;
    bary: Float32Array;        // per-sample (u,v,w)
    vCount: number;
}

export const NeuralScanFace = ({
    modelUrl = HEAD_MODEL_URL,
    jawOpen = 0,
    autoTalk = false,
    intensity = 1.0,
    pointScale = 1.0,
    shimmer = 0.01,
}: NeuralScanFaceProps) => {
    const { scene } = useGLTF(modelUrl);
    const jawRef = useRef(0);
    const morphed = useRef<Float32Array>(new Float32Array(0));

    const built = useMemo<Built | null>(() => {
        scene.updateMatrixWorld(true);
        let head: THREE.Mesh | undefined;
        scene.traverse((c) => {
            const m = c as THREE.Mesh;
            if (m.isMesh && m.morphTargetDictionary && 'jawOpen' in m.morphTargetDictionary) head = m;
        });
        if (!head) return null;

        const geo = head.geometry;
        const pos = geo.getAttribute('position');
        const vCount = pos.count;
        const index = geo.index ? (geo.index.array as ArrayLike<number>) : null;
        const triCount = index ? index.length / 3 : vCount / 3;

        // Base local verts.
        const base = new Float32Array(vCount * 3);
        for (let i = 0; i < vCount; i++) {
            base[i * 3] = pos.getX(i); base[i * 3 + 1] = pos.getY(i); base[i * 3 + 2] = pos.getZ(i);
        }
        const triIdx = (t: number, c: number) => (index ? index[t * 3 + c] : t * 3 + c);

        // Normalization (local → fit world).
        const tmp = new THREE.Vector3();
        const bbox = new THREE.Box3();
        for (let i = 0; i < vCount; i++) {
            tmp.set(base[i * 3], base[i * 3 + 1], base[i * 3 + 2]).applyMatrix4(head.matrixWorld);
            bbox.expandByPoint(tmp);
        }
        const center = bbox.getCenter(new THREE.Vector3());
        const size = bbox.getSize(new THREE.Vector3());
        const scale = (FIT_RADIUS * 2) / (Math.max(size.x, size.y, size.z) || 1);
        const matrix = new THREE.Matrix4().makeScale(scale, scale, scale).multiply(head.matrixWorld);
        matrix.premultiply(new THREE.Matrix4().makeTranslation(-center.x * scale, -center.y * scale, -center.z * scale));

        // Cumulative triangle areas (base pose) for area-weighted sampling.
        const cum = new Float32Array(triCount);
        const a = new THREE.Vector3(), b = new THREE.Vector3(), cv = new THREE.Vector3();
        let acc = 0;
        for (let t = 0; t < triCount; t++) {
            const ia = triIdx(t, 0), ib = triIdx(t, 1), ic = triIdx(t, 2);
            a.set(base[ia * 3], base[ia * 3 + 1], base[ia * 3 + 2]);
            b.set(base[ib * 3], base[ib * 3 + 1], base[ib * 3 + 2]);
            cv.set(base[ic * 3], base[ic * 3 + 1], base[ic * 3 + 2]);
            acc += b.sub(a).cross(cv.sub(a)).length() * 0.5;
            cum[t] = acc;
        }
        const total = acc || 1;

        // Sample SAMPLE_COUNT points across the surface (uniform by area).
        const N = SAMPLE_COUNT;
        const triA = new Uint32Array(N), triB = new Uint32Array(N), triC = new Uint32Array(N);
        const bary = new Float32Array(N * 3);
        const sizes = new Float32Array(N);
        const phases = new Float32Array(N);
        const pickTri = (r: number) => {
            // binary search in cumulative areas
            let lo = 0, hi = triCount - 1;
            const target = r * total;
            while (lo < hi) { const mid = (lo + hi) >> 1; if (cum[mid] < target) lo = mid + 1; else hi = mid; }
            return lo;
        };
        for (let i = 0; i < N; i++) {
            const t = pickTri(Math.random());
            triA[i] = triIdx(t, 0); triB[i] = triIdx(t, 1); triC[i] = triIdx(t, 2);
            let u = Math.random(), v = Math.random();
            if (u + v > 1) { u = 1 - u; v = 1 - v; }
            bary[i * 3] = 1 - u - v; bary[i * 3 + 1] = u; bary[i * 3 + 2] = v;
            sizes[i] = 0.5 + Math.random() * 0.55;
            phases[i] = Math.random();
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uPointScale: { value: pointScale },
                uShimmer: { value: shimmer },
                uIntensity: { value: intensity },
                uNear: { value: new THREE.Color('#d6ffff') },
                uFar: { value: new THREE.Color('#0b2db0') },
                uDepthNear: { value: 3.2 },
                uDepthFar: { value: 7.4 },
            },
            vertexShader: scanVert,
            fragmentShader: scanFrag,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const dict = head.morphTargetDictionary!;
        const mp = geo.morphAttributes.position;
        const deltaOf = (name: string) => {
            const idx = dict[name];
            return idx !== undefined && mp?.[idx] ? (mp[idx].array as Float32Array) : null;
        };

        morphed.current = new Float32Array(vCount * 3);

        return {
            geometry, material, base,
            jaw: deltaOf('jawOpen'), blinkL: deltaOf('eyeBlink_L'), blinkR: deltaOf('eyeBlink_R'),
            matrix, triA, triB, triC, bary, vCount,
        };
    }, [scene]); // eslint-disable-line react-hooks/exhaustive-deps

    useFrame((_, delta) => {
        if (!built) return;
        const { geometry, material, base, jaw, blinkL, blinkR, matrix, triA, triB, triC, bary, vCount } = built;
        const u = material.uniforms;

        const target = autoTalk ? speechJaw(u.uTime.value) : jawOpen;
        jawRef.current += (target - jawRef.current) * Math.min(1, delta * 18);
        const bl = blink(u.uTime.value);
        u.uTime.value += delta;
        u.uIntensity.value = intensity;
        u.uPointScale.value = pointScale;

        // 1) Morph base verts (local).
        const mref = morphed.current;
        const jw = jawRef.current;
        for (let i = 0; i < vCount; i++) {
            const i3 = i * 3;
            let x = base[i3], y = base[i3 + 1], z = base[i3 + 2];
            if (jaw) { x += jw * jaw[i3]; y += jw * jaw[i3 + 1]; z += jw * jaw[i3 + 2]; }
            if (blinkL) { x += bl * blinkL[i3]; y += bl * blinkL[i3 + 1]; z += bl * blinkL[i3 + 2]; }
            if (blinkR) { x += bl * blinkR[i3]; y += bl * blinkR[i3 + 1]; z += bl * blinkR[i3 + 2]; }
            mref[i3] = x; mref[i3 + 1] = y; mref[i3 + 2] = z;
        }

        // 2) Barycentric-interpolate samples from morphed verts, then normalize.
        const out = (geometry.getAttribute('position') as THREE.BufferAttribute).array as Float32Array;
        const e = matrix.elements;
        const N = triA.length;
        for (let i = 0; i < N; i++) {
            const a3 = triA[i] * 3, b3 = triB[i] * 3, c3 = triC[i] * 3;
            const w0 = bary[i * 3], w1 = bary[i * 3 + 1], w2 = bary[i * 3 + 2];
            const lx = w0 * mref[a3] + w1 * mref[b3] + w2 * mref[c3];
            const ly = w0 * mref[a3 + 1] + w1 * mref[b3 + 1] + w2 * mref[c3 + 1];
            const lz = w0 * mref[a3 + 2] + w1 * mref[b3 + 2] + w2 * mref[c3 + 2];
            // apply 4x4 matrix (column-major elements)
            const o = i * 3;
            out[o] = e[0] * lx + e[4] * ly + e[8] * lz + e[12];
            out[o + 1] = e[1] * lx + e[5] * ly + e[9] * lz + e[13];
            out[o + 2] = e[2] * lx + e[6] * ly + e[10] * lz + e[14];
        }
        (geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    });

    if (!built) return null;
    return <points geometry={built.geometry} material={built.material} frustumCulled={false} />;
};

useGLTF.preload(HEAD_MODEL_URL);
