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
import { avatarSignal, useAvatarStore } from '../../../store/useAvatarStore';

const HEAD_MODEL_URL = '/models/facecap-clean.glb';
const FIT_RADIUS = 2.2;

interface Props {
    modelUrl?: string;
    jawOpen?: number;
    autoTalk?: boolean;
    intensity?: number;
    grid?: number;     // cells across the width
    maxYaw?: number;   // max left/right head turn (radians)
    maxPitch?: number; // max up/down head tilt (radians)
    headScale?: number; // overall head size on screen (1 = fills frame)
    scanAngle?: number;     // scanline direction (degrees)
    scanIntensity?: number; // 0..1
    glitch?: number;        // 0..1
    intro?: boolean;        // play the grid entrance ramp on mount
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
  uniform vec3 uNear;         // bright (high luminance)
  uniform vec3 uFar;          // dim  (low luminance)
  uniform float uScanAngle;   // scanline direction (degrees)
  uniform float uScanIntensity;
  uniform float uScanFreq;
  uniform float uScanSpeed;
  uniform float uGlitch;      // 0..1
  varying vec2 vUv;

  float luma(vec3 c){ return dot(c, vec3(0.299, 0.587, 0.114)); }
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    float aspect = uResolution.x / uResolution.y;
    float cellPx = uResolution.x / uGrid;     // square cell size in px
    vec2 cells = uResolution / cellPx;        // cell counts (x,y)
    vec2 cellId = floor(vUv * cells);
    vec2 cellCenter = (cellId + 0.5) / cells;

    // ── Glitch: an UNSTABLE-SIGNAL feel — a faint constant micro-jitter plus
    //    rare, IRREGULAR (non-periodic) burst displacements on random bands. ──
    float gActive = 0.0;
    if (uGlitch > 0.0001) {
      // (a) always-on faint instability
      float micro = hash(vec2(floor(vUv.y * 70.0), floor(uTime * 26.0))) - 0.5;
      cellCenter.x += micro * 0.004 * uGlitch;

      // (b) irregular bursts: two incommensurate clocks → non-repeating timing
      float tA = floor(uTime * 11.0);
      float tB = floor(uTime * 7.0 + 13.0);
      float burst = hash(vec2(tA, tB));
      float fire = step(1.02 - uGlitch * 0.45, burst);   // sparse; rarer at low uGlitch
      if (fire > 0.5) {
        float band = floor(vUv.y * 30.0);
        gActive = step(0.55, hash(vec2(band, tA)));        // only some bands jump
        cellCenter.x += gActive * (hash(vec2(band, tB)) - 0.5) * (0.03 + uGlitch * 0.05);
      }
    }

    vec4 s = texture2D(uFace, cellCenter);
    float lum = luma(s.rgb) * s.a;            // mask out background

    vec2 d = (vUv - cellCenter) * cells;      // square local coords [-0.5,0.5]
    float dist = length(d);
    float radius = clamp(lum, 0.0, 1.0) * 0.62;
    float pt = 1.0 - smoothstep(radius - 0.08, radius, dist);   // dot mask (don't shadow dot())

    vec3 col = mix(uFar, uNear, clamp(lum, 0.0, 1.0));
    float a = pt * (0.25 + lum) * uIntensity;

    // ── Directional scanlines (adjustable angle) ──
    float ang = radians(uScanAngle);
    vec2 dir = vec2(cos(ang), sin(ang));
    float sl = 0.5 + 0.5 * sin(dot(vUv * vec2(aspect, 1.0), dir) * uScanFreq - uTime * uScanSpeed);
    a *= mix(1.0, sl, uScanIntensity);

    // ── Glitch colour split + flicker on active bands ──
    if (gActive > 0.5) {
      col = mix(col, col.gbr, 0.35 * (0.4 + uGlitch));  // mild channel shift
      a *= 1.0 - 0.25 * uGlitch;
      a += 0.06 * uGlitch * pt;
    }

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
    maxYaw = 0.45,
    maxPitch = 0.28,
    headScale = 0.8,
    scanAngle = 133,
    scanIntensity = 0.18,
    glitch = 0.06,
    intro = true,
}: Props) => {
    const { gl, size, pointer } = useThree();
    const { scene } = useGLTF(modelUrl);
    const jawRef = useRef(0);
    const introT = useRef(intro ? 0 : 1);

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

        // Pivot wraps the (origin-centered) face so we can rotate it in place
        // within limits while keeping the screen-space halftone.
        const pivot = new THREE.Group();
        pivot.add(faceMesh);

        const headScene = new THREE.Scene();
        headScene.add(pivot);
        const key = new THREE.DirectionalLight(0xffffff, 2.6);
        key.position.set(0, 0.4, 4);
        headScene.add(key);
        headScene.add(new THREE.AmbientLight(0xffffff, 0.35));

        const w = Math.max(2, Math.floor(size.width));
        const h = Math.max(2, Math.floor(size.height));
        const headCam = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
        headCam.position.set(0, 0, 6);   // dead-centered
        headCam.lookAt(0, 0, 0);

        const fbo = new THREE.WebGLRenderTarget(w, h, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uFace: { value: fbo.texture },
                uResolution: { value: new THREE.Vector2(w, h) },
                uGrid: { value: grid },
                uTime: { value: 0 },
                uIntensity: { value: intensity },
                uNear: { value: new THREE.Color('#e6ffff') },
                uFar: { value: new THREE.Color('#0e3fb0') },
                uScanAngle: { value: scanAngle },
                uScanIntensity: { value: scanIntensity },
                uScanFreq: { value: 140.0 },
                uScanSpeed: { value: 3.0 },
                uGlitch: { value: glitch },
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
            faceMesh, pivot, headScene, headCam, fbo, material,
            jawIdx: dict['jawOpen'], blinkLIdx: dict['eyeBlink_L'], blinkRIdx: dict['eyeBlink_R'],
        };
    }, [scene, size.width, size.height]); // eslint-disable-line react-hooks/exhaustive-deps

    useFrame((_, delta) => {
        if (!built) return;
        const { faceMesh, headScene, headCam, fbo, material } = built;
        const u = material.uniforms;

        // Agent state drives mouth + mood (read without subscribing — loop-safe).
        const status = useAvatarStore.getState().status;
        const speaking = status === 'speaking';
        const thinking = status === 'thinking';
        const listening = status === 'listening';

        // While speaking, the jaw follows the live audio/envelope signal.
        const target = speaking ? avatarSignal.jaw : (autoTalk ? speechJaw(u.uTime.value) : jawOpen);
        jawRef.current += (target - jawRef.current) * Math.min(1, delta * (speaking ? 26 : 18));
        const bl = blink(u.uTime.value);
        u.uTime.value += delta;

        // Mood: thinking → agitated (glitch up, scanlines up, gentle luminance pulse);
        // listening → soft breathing brighten; speaking/idle → calm baseline.
        const pulse = 1 + 0.12 * Math.sin(u.uTime.value * 6.0);
        u.uIntensity.value = intensity * (thinking ? pulse : listening ? 1.12 : 1.0);
        u.uScanAngle.value = scanAngle;
        u.uScanIntensity.value = scanIntensity + (thinking ? 0.18 : 0);
        u.uGlitch.value = glitch + (thinking ? 0.28 : 0);

        // Entrance ramp: grid builds 60 → target in rhythmic steps over ~2.2s.
        introT.current = Math.min(1, introT.current + delta / 2.2);
        const ease = 1 - Math.pow(1 - introT.current, 3);          // easeOutCubic
        const stepped = Math.floor(ease * 6 + 0.0001) / 6;          // 6 rhythmic steps
        u.uGrid.value = introT.current >= 1 ? grid : 60 + (grid - 60) * stepped;

        const inf = faceMesh.morphTargetInfluences;
        if (inf) {
            if (built.jawIdx !== undefined) inf[built.jawIdx] = jawRef.current;
            if (built.blinkLIdx !== undefined) inf[built.blinkLIdx] = bl;
            if (built.blinkRIdx !== undefined) inf[built.blinkRIdx] = bl;
        }

        // Limited head rotation: follow the cursor within ±maxYaw/±maxPitch,
        // plus a slow idle drift so it feels alive when the cursor is still.
        const t = u.uTime.value;
        const tYaw = pointer.x * maxYaw + Math.sin(t * 0.25) * 0.05;
        const tPitch = -pointer.y * maxPitch + Math.sin(t * 0.21) * 0.03;
        const pivot = built.pivot;
        pivot.rotation.y += (tYaw - pivot.rotation.y) * Math.min(1, delta * 4);
        pivot.rotation.x += (tPitch - pivot.rotation.x) * Math.min(1, delta * 4);
        pivot.scale.setScalar(headScale);
        pivot.updateMatrixWorld(true);

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
