/**
 * NeuralHalftoneFace — Lusion-style screen-space HALFTONE (not a 3D point cloud).
 *
 * The dots are a uniform SCREEN grid (even spacing even at the face edges — the
 * Lusion signature). Technique:
 *  1. Render the morphing, front-lit head into an off-screen texture (luminance =
 *     lit shape; real jawOpen/blink blendshapes animate it).
 *  2. A full-screen fragment shader divides the screen into circular cells; each
 *     cell samples the face luminance at its center and draws a dot whose size +
 *     brightness ∝ luminance (bright forehead/nose → big white-cyan dots; shadow →
 *     small/none). Background = no dots.
 * Bloom / chromatic aberration / grain (lab EffectComposer) add the hazy veil.
 */
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const HEAD_MODEL_URL = '/models/facecap-clean.glb';
const FIT_RADIUS = 2.2;

interface Props {
    modelUrl?: string;
    jawOpen?: number;
    autoTalk?: boolean;
    intensity?: number;
    grid?: number;     // cells across the width
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

const quadVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
const halftoneFrag = /* glsl */ `
  precision highp float;
  uniform sampler2D uFace;
  uniform vec2 uResolution;
  uniform float uGrid;        // cells across width
  uniform float uTime;
  uniform float uIntensity;
  uniform float uShimmer;
  uniform vec3 uNear;         // bright (high luminance)
  uniform vec3 uFar;          // dim  (low luminance)
  varying vec2 vUv;

  float luma(vec3 c){ return dot(c, vec3(0.299, 0.587, 0.114)); }

  void main() {
    float cellPx = uResolution.x / uGrid;     // square cell size in px
    vec2 cells = uResolution / cellPx;        // cell counts (x,y)
    vec2 cellId = floor(vUv * cells);
    vec2 cellCenter = (cellId + 0.5) / cells;

    vec4 s = texture2D(uFace, cellCenter);
    float lum = luma(s.rgb) * s.a;            // mask out background

    // subtle per-cell scan flicker
    lum *= 0.9 + 0.1 * sin(uTime * 6.0 + cellId.x * 0.7 + cellId.y * 1.3);

    vec2 d = (vUv - cellCenter) * cells;      // square local coords [-0.5,0.5]
    float dist = length(d);
    float radius = clamp(lum, 0.0, 1.0) * 0.62;
    float dot = 1.0 - smoothstep(radius - 0.08, radius, dist);

    vec3 col = mix(uFar, uNear, clamp(lum, 0.0, 1.0));
    float a = dot * (0.25 + lum) * uIntensity;
    if (a < 0.002) discard;
    gl_FragColor = vec4(col, a);
  }
`;

export const NeuralHalftoneFace = ({
    modelUrl = HEAD_MODEL_URL,
    jawOpen = 0,
    autoTalk = false,
    intensity = 1.0,
    grid = 150,
    shimmer = 0.0,
}: Props) => {
    const { gl, size } = useThree();
    const { scene } = useGLTF(modelUrl);
    const jawRef = useRef(0);

    const built = useMemo(() => {
        scene.updateMatrixWorld(true);
        let head: THREE.Mesh | undefined;
        scene.traverse((c) => {
            const m = c as THREE.Mesh;
            if (m.isMesh && m.morphTargetDictionary && 'jawOpen' in m.morphTargetDictionary) head = m;
        });
        if (!head) return null;

        // Centered/scaled clone, lit white, for the luminance pass.
        const pos = head.geometry.getAttribute('position');
        const tmp = new THREE.Vector3();
        const bbox = new THREE.Box3();
        for (let i = 0; i < pos.count; i++) {
            tmp.set(pos.getX(i), pos.getY(i), pos.getZ(i)).applyMatrix4(head.matrixWorld);
            bbox.expandByPoint(tmp);
        }
        const center = bbox.getCenter(new THREE.Vector3());
        const sz = bbox.getSize(new THREE.Vector3());
        const scale = (FIT_RADIUS * 2) / (Math.max(sz.x, sz.y, sz.z) || 1);
        const matrix = new THREE.Matrix4().makeScale(scale, scale, scale).multiply(head.matrixWorld);
        matrix.premultiply(new THREE.Matrix4().makeTranslation(-center.x * scale, -center.y * scale, -center.z * scale));

        const faceMesh = head.clone();
        faceMesh.material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0.0 });
        faceMesh.matrixAutoUpdate = false;
        faceMesh.matrix.copy(matrix);
        faceMesh.updateMatrixWorld(true);

        const headScene = new THREE.Scene();
        headScene.add(faceMesh);
        const key = new THREE.DirectionalLight(0xffffff, 2.6);
        key.position.set(0, 0.4, 4);
        headScene.add(key);
        headScene.add(new THREE.AmbientLight(0xffffff, 0.35));

        const w = Math.max(2, Math.floor(size.width));
        const h = Math.max(2, Math.floor(size.height));
        const headCam = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
        headCam.position.set(0, 0.15, 6);
        headCam.lookAt(0, 0.1, 0);

        const fbo = new THREE.WebGLRenderTarget(w, h, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uFace: { value: fbo.texture },
                uResolution: { value: new THREE.Vector2(w, h) },
                uGrid: { value: grid },
                uTime: { value: 0 },
                uIntensity: { value: intensity },
                uShimmer: { value: shimmer },
                uNear: { value: new THREE.Color('#e6ffff') },
                uFar: { value: new THREE.Color('#0e3fb0') },
            },
            vertexShader: quadVert,
            fragmentShader: halftoneFrag,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const dict = head.morphTargetDictionary!;
        return {
            faceMesh, headScene, headCam, fbo, material,
            jawIdx: dict['jawOpen'], blinkLIdx: dict['eyeBlink_L'], blinkRIdx: dict['eyeBlink_R'],
        };
    }, [scene, size.width, size.height]); // eslint-disable-line react-hooks/exhaustive-deps

    useFrame((_, delta) => {
        if (!built) return;
        const { faceMesh, headScene, headCam, fbo, material } = built;
        const u = material.uniforms;

        const target = autoTalk ? speechJaw(u.uTime.value) : jawOpen;
        jawRef.current += (target - jawRef.current) * Math.min(1, delta * 18);
        const bl = blink(u.uTime.value);
        u.uTime.value += delta;
        u.uIntensity.value = intensity;
        u.uGrid.value = grid;

        const inf = faceMesh.morphTargetInfluences;
        if (inf) {
            if (built.jawIdx !== undefined) inf[built.jawIdx] = jawRef.current;
            if (built.blinkLIdx !== undefined) inf[built.blinkLIdx] = bl;
            if (built.blinkRIdx !== undefined) inf[built.blinkRIdx] = bl;
        }
        const prevTarget = gl.getRenderTarget();
        const prevColor = gl.getClearColor(new THREE.Color());
        const prevAlpha = gl.getClearAlpha();
        gl.setRenderTarget(fbo);
        gl.setClearColor(0x000000, 0);
        gl.clear();
        gl.render(headScene, headCam);
        gl.setRenderTarget(prevTarget);
        gl.setClearColor(prevColor, prevAlpha);
    });

    if (!built) return null;
    return (
        <mesh frustumCulled={false} renderOrder={1}>
            <planeGeometry args={[2, 2]} />
            <primitive object={built.material} attach="material" />
        </mesh>
    );
};

useGLTF.preload(HEAD_MODEL_URL);
