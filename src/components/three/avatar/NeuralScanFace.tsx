/**
 * NeuralScanFace — the "depth-scan" avatar (Kinect / Lusion technique).
 *
 * NOT mesh-vertex points. Instead, every frame the morphing head is rendered into
 * an off-screen POSITION map (each pixel stores the world-space position of the
 * surface it sees, alpha = hit mask). A REGULAR grid of points then samples that
 * map and places itself onto the surface — so the dots are evenly spaced in screen
 * space (the Lusion "halftone" look) and the cloud re-forms volumetrically as the
 * head moves or you orbit (the Kinect depth-grid look). Colored by depth.
 *
 * The head deforms via the real `jawOpen` blendshape (CPU delta-blend on the
 * render mesh), so the scan animates when it speaks.
 */
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const HEAD_MODEL_URL = '/models/facecap-clean.glb';
const FIT_RADIUS = 2.4;
const GRID = 230;   // 230×230 ≈ 53k grid points
const RT_SIZE = 1024;

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

// Position-map material: write world-space position (alpha=1 where surface is).
const posVert = /* glsl */ `
  varying vec3 vW;
  void main() {
    vW = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const posFrag = /* glsl */ `
  varying vec3 vW;
  void main() { gl_FragColor = vec4(vW, 1.0); }
`;

// Grid points: sample the position map, place + color by depth.
const gridVert = /* glsl */ `
  uniform sampler2D uPosMap;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uPointScale;
  uniform float uShimmer;
  attribute vec2 aUV;
  varying float vMask;
  varying float vDepth;
  float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec4 s = texture2D(uPosMap, aUV);
    vMask = s.a;
    if (vMask < 0.5) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
    vec3 w = s.xyz;
    if (uShimmer > 0.0001) {
      float tw = floor(uTime * 8.0);
      w += (vec3(h(aUV + tw), h(aUV + tw + 7.0), h(aUV + 3.0)) - 0.5) * uShimmer;
    }
    vec4 mv = viewMatrix * vec4(w, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
    float size = uPointScale * (170.0 / -mv.z) * uPixelRatio;
    gl_PointSize = clamp(size, 0.7, 3.0 * uPixelRatio);
  }
`;
const gridFrag = /* glsl */ `
  uniform vec3 uNear;
  uniform vec3 uFar;
  uniform float uIntensity;
  varying float vMask;
  varying float vDepth;
  void main() {
    if (vMask < 0.5) discard;
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float core = 1.0 - smoothstep(0.0, 0.12, d);
    float glow = pow(1.0 - smoothstep(0.0, 0.5, d), 2.2);
    float t = clamp((vDepth - 3.2) / 3.6, 0.0, 1.0);  // near → far
    vec3 col = mix(uNear, uFar, t);
    float a = (core * 0.55 + glow * 0.4) * uIntensity;
    gl_FragColor = vec4(col, a);
  }
`;

export const NeuralScanFace = ({
    modelUrl = HEAD_MODEL_URL,
    jawOpen = 0,
    autoTalk = false,
    intensity = 1.0,
    pointScale = 1.0,
    shimmer = 0.015,
}: NeuralScanFaceProps) => {
    const { gl, camera } = useThree();
    const { scene } = useGLTF(modelUrl);
    const jawRef = useRef(0);

    const built = useMemo(() => {
        scene.updateMatrixWorld(true);
        let head: THREE.Mesh | null = null;
        scene.traverse((c) => {
            const m = c as THREE.Mesh;
            if (m.isMesh && m.morphTargetDictionary && 'jawOpen' in m.morphTargetDictionary) head = m;
        });
        if (!head) return null;
        const headMesh = head as THREE.Mesh;

        const hpos = headMesh.geometry.getAttribute('position');
        const count = hpos.count;

        // Normalization: local → fit-to-FIT_RADIUS world.
        const tmp = new THREE.Vector3();
        const bbox = new THREE.Box3();
        for (let i = 0; i < count; i++) {
            tmp.set(hpos.getX(i), hpos.getY(i), hpos.getZ(i)).applyMatrix4(headMesh.matrixWorld);
            bbox.expandByPoint(tmp);
        }
        const center = bbox.getCenter(new THREE.Vector3());
        const size = bbox.getSize(new THREE.Vector3());
        const scale = (FIT_RADIUS * 2) / (Math.max(size.x, size.y, size.z) || 1);
        const M = new THREE.Matrix4().makeScale(scale, scale, scale).multiply(headMesh.matrixWorld);
        M.premultiply(new THREE.Matrix4().makeTranslation(-center.x * scale, -center.y * scale, -center.z * scale));

        // Render mesh (CPU-morphed positions, same triangles) → position map.
        const base = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            base[i * 3] = hpos.getX(i); base[i * 3 + 1] = hpos.getY(i); base[i * 3 + 2] = hpos.getZ(i);
        }
        const renderGeo = new THREE.BufferGeometry();
        renderGeo.setAttribute('position', new THREE.BufferAttribute(base.slice(), 3));
        if (headMesh.geometry.index) renderGeo.setIndex(headMesh.geometry.index.clone());

        const posMat = new THREE.ShaderMaterial({ vertexShader: posVert, fragmentShader: posFrag });
        const renderMesh = new THREE.Mesh(renderGeo, posMat);
        renderMesh.matrixAutoUpdate = false;
        renderMesh.matrix.copy(M);
        renderMesh.updateMatrixWorld(true);
        const headScene = new THREE.Scene();
        headScene.add(renderMesh);

        const dict = headMesh.morphTargetDictionary!;
        const mp = headMesh.geometry.morphAttributes.position;
        const deltaOf = (name: string) => {
            const idx = dict[name];
            return idx !== undefined && mp?.[idx] ? (mp[idx].array as Float32Array) : null;
        };

        // Position-map render target (HalfFloat stores world coords fine).
        const rt = new THREE.WebGLRenderTarget(RT_SIZE, RT_SIZE, {
            type: THREE.HalfFloatType,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            depthBuffer: true,
        });

        // Regular grid of points (positions are dummy; aUV drives the lookup).
        const n = GRID * GRID;
        const dummy = new Float32Array(n * 3);
        const uv = new Float32Array(n * 2);
        let k = 0;
        for (let y = 0; y < GRID; y++) {
            for (let x = 0; x < GRID; x++) {
                uv[k * 2] = (x + 0.5) / GRID;
                uv[k * 2 + 1] = (y + 0.5) / GRID;
                k++;
            }
        }
        const gridGeo = new THREE.BufferGeometry();
        gridGeo.setAttribute('position', new THREE.BufferAttribute(dummy, 3));
        gridGeo.setAttribute('aUV', new THREE.BufferAttribute(uv, 2));

        const gridMat = new THREE.ShaderMaterial({
            uniforms: {
                uPosMap: { value: rt.texture },
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uPointScale: { value: pointScale },
                uShimmer: { value: shimmer },
                uIntensity: { value: intensity },
                uNear: { value: new THREE.Color('#cffaff') },
                uFar: { value: new THREE.Color('#1140d0') },
            },
            vertexShader: gridVert,
            fragmentShader: gridFrag,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        return {
            renderGeo, renderMesh, headScene, posMat, rt, gridGeo, gridMat,
            base, jaw: deltaOf('jawOpen'), blinkL: deltaOf('eyeBlink_L'), blinkR: deltaOf('eyeBlink_R'),
            count,
        };
    }, [scene]); // eslint-disable-line react-hooks/exhaustive-deps

    useFrame((_, delta) => {
        if (!built) return;
        const { renderGeo, headScene, rt, gridMat, base, jaw, blinkL, blinkR, count } = built;

        const target = autoTalk ? speechJaw(gridMat.uniforms.uTime.value) : jawOpen;
        jawRef.current += (target - jawRef.current) * Math.min(1, delta * 18);
        const bl = blink(gridMat.uniforms.uTime.value);
        gridMat.uniforms.uTime.value += delta;
        gridMat.uniforms.uIntensity.value = intensity;
        gridMat.uniforms.uPointScale.value = pointScale;

        // CPU morph the render mesh (base + jaw·Δ + blink·Δ).
        const arr = (renderGeo.getAttribute('position') as THREE.BufferAttribute).array as Float32Array;
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            let x = base[i3], y = base[i3 + 1], z = base[i3 + 2];
            if (jaw) { x += jawRef.current * jaw[i3]; y += jawRef.current * jaw[i3 + 1]; z += jawRef.current * jaw[i3 + 2]; }
            if (blinkL) { x += bl * blinkL[i3]; y += bl * blinkL[i3 + 1]; z += bl * blinkL[i3 + 2]; }
            if (blinkR) { x += bl * blinkR[i3]; y += bl * blinkR[i3 + 1]; z += bl * blinkR[i3 + 2]; }
            arr[i3] = x; arr[i3 + 1] = y; arr[i3 + 2] = z;
        }
        (renderGeo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;

        // Render the head's world-position map from the live camera.
        const prevTarget = gl.getRenderTarget();
        const prevClear = gl.getClearColor(new THREE.Color());
        const prevAlpha = gl.getClearAlpha();
        gl.setRenderTarget(rt);
        gl.setClearColor(0x000000, 0);
        gl.clear();
        gl.render(headScene, camera);
        gl.setRenderTarget(prevTarget);
        gl.setClearColor(prevClear, prevAlpha);
    });

    if (!built) return null;
    return <points geometry={built.gridGeo} material={built.gridMat} frustumCulled={false} />;
};

useGLTF.preload(HEAD_MODEL_URL);
