/**
 * HalftoneAtmosphere — the Lusion-style ambience behind/below the halftone face.
 *   • a dim falling code-rain backdrop (full-screen, behind the face)
 *   • glowing flowing topographic contour lines pooled at the bottom
 * Both are full-screen clip-space quads (additive) so EffectComposer bloom makes
 * them glow. Rendered behind the face via renderOrder.
 */
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const quadVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const rainFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    float cols = 80.0;
    float col = floor(vUv.x * cols);
    float sp = 0.25 + hash(vec2(col, 11.0)) * 0.85;
    float rows = 46.0;
    // scrolling glyph cells (falling)
    float scroll = vUv.y + uTime * sp * 0.12;
    float cell = floor(scroll * rows);
    float glyph = step(0.55, hash(vec2(col * 0.7, cell)));
    // a bright "head" running down each column
    float headPos = fract(uTime * sp * 0.12 + hash(vec2(col, 5.0)));
    float dist = abs(fract(vUv.y + headPos + 0.5) - 0.5);
    float glow = smoothstep(0.5, 0.0, dist * 2.2);
    float b = glyph * glow;
    b += smoothstep(0.03, 0.0, dist) * 0.6 * glyph;
    gl_FragColor = vec4(uColor * b, b * 0.38);
  }
`;

const contourFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  void main() {
    float mask = smoothstep(0.42, 0.0, vUv.y);   // strongest at the bottom
    if (mask < 0.002) discard;
    vec2 p = vUv * vec2(9.0, 5.5);
    p.y -= uTime * 0.18;                          // flow upward/outward
    float n = noise(p) + 0.5 * noise(p * 2.1);
    float bands = abs(fract(n * 7.0) - 0.5);
    float line = smoothstep(0.07, 0.0, bands);
    float a = line * mask;
    gl_FragColor = vec4(uColor * (0.4 + line), a * 0.7);
  }
`;

export const HalftoneAtmosphere = () => {
    const { size } = useThree();
    const rainRef = useRef<THREE.ShaderMaterial>(null);
    const contourRef = useRef<THREE.ShaderMaterial>(null);

    const { rainMat, contourMat } = useMemo(() => {
        const common = { transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending };
        const rainMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#0aa0c8') } },
            vertexShader: quadVert, fragmentShader: rainFrag, ...common,
        });
        const contourMat = new THREE.ShaderMaterial({
            uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color('#22d3ee') } },
            vertexShader: quadVert, fragmentShader: contourFrag, ...common,
        });
        return { rainMat, contourMat };
    }, []);

    useFrame((_, delta) => {
        rainMat.uniforms.uTime.value += delta;
        contourMat.uniforms.uTime.value += delta;
    });

    void size; // (kept for future aspect-aware tuning)

    return (
        <>
            <mesh frustumCulled={false} renderOrder={-3}>
                <planeGeometry args={[2, 2]} />
                <primitive object={rainMat} attach="material" ref={rainRef} />
            </mesh>
            <mesh frustumCulled={false} renderOrder={-2}>
                <planeGeometry args={[2, 2]} />
                <primitive object={contourMat} attach="material" ref={contourRef} />
            </mesh>
        </>
    );
};
