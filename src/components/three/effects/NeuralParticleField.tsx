/**
 * NeuralParticleField v3.3 — Full-Screen WebGL Particle System
 *
 * v3.3 changes:
 * ① Instant mouse displacement (no lerp/lag — direct position offset)
 * ③ Ambient drift-inward: when morphed, outer particles slowly drift toward center
 *    then respawn at their scatter position when they get close — continuous flow
 */
import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../../store/useAppStore';
import { useThemeColors } from '../../../hooks/useThemeColors';

// ─── Config ────────────────────────────────────────────────
const PARTICLE_COUNT = 6000;
const SPHERE_RADIUS = 22;
const MORPH_RATIO = 0.4;
const MORPH_COUNT = Math.floor(PARTICLE_COUNT * MORPH_RATIO);
const MORPH_LERP = 0.05;
const SCATTER_LERP = 0.02;
const MOUSE_PUSH_RADIUS = 3.5;
const MOUSE_PUSH_STRENGTH = 1.5; // Instant push, not lerped

// Drift-inward config
const DRIFT_SPEED = 0.15; // How fast ambient particles drift toward center
const DRIFT_RESPAWN_DIST = 3.0; // When this close to center, respawn at scatter pos

// ─── Shape generators ──────────────────────────────────────
function generateSpherePositions(count: number, radius: number): Float32Array {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = radius * (0.7 + Math.random() * 0.3);
        arr[i3] = r * Math.sin(phi) * Math.cos(theta);
        arr[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        arr[i3 + 2] = r * Math.cos(phi);
    }
    return arr;
}

function generateShape(type: string, count: number): Float32Array {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        let x = 0, y = 0, z = 0;

        switch (type) {
            case 'project': {
                const face = Math.floor(Math.random() * 6);
                const u = (Math.random() - 0.5) * 8;
                const v = (Math.random() - 0.5) * 8;
                if (face === 0) { x = 4; y = u; z = v; }
                else if (face === 1) { x = -4; y = u; z = v; }
                else if (face === 2) { x = u; y = 4; z = v; }
                else if (face === 3) { x = u; y = -4; z = v; }
                else if (face === 4) { x = u; y = v; z = 4; }
                else { x = u; y = v; z = -4; }
                break;
            }
            case 'game': {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const r = 5.5;
                const facets = Math.floor(Math.random() * 20);
                const facetAngle = (facets / 20) * Math.PI * 2;
                const rr = r + Math.sin(facetAngle * 3) * 0.6;
                x = rr * Math.sin(phi) * Math.cos(theta);
                y = rr * Math.sin(phi) * Math.sin(theta);
                z = rr * Math.cos(phi);
                break;
            }
            case 'music': {
                const t = Math.random() * Math.PI * 2;
                const p = Math.random() * Math.PI * 2;
                const R = 5;
                const r = 1.5;
                x = (R + r * Math.cos(p)) * Math.cos(t);
                y = (R + r * Math.cos(p)) * Math.sin(t);
                z = r * Math.sin(p);
                break;
            }
            case 'sound': {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const baseR = 5;
                const wave = Math.sin(phi * 8) * 0.8;
                const r = baseR + wave;
                x = r * Math.sin(phi) * Math.cos(theta);
                y = r * Math.sin(phi) * Math.sin(theta);
                z = r * Math.cos(phi);
                break;
            }
            case 'video': {
                const t = Math.random();
                const angle = Math.random() * Math.PI * 2;
                if (t < 0.5) {
                    const h = t * 2;
                    const r = (1 - h) * 5;
                    x = r * Math.cos(angle);
                    z = r * Math.sin(angle);
                    y = h * 7;
                } else {
                    const h = (t - 0.5) * 2;
                    const r = h * 5;
                    x = r * Math.cos(angle);
                    z = r * Math.sin(angle);
                    y = -h * 7;
                }
                break;
            }
            case 'lab': {
                const t = (i / count) * Math.PI * 6;
                const strand = i % 2 === 0 ? 1 : -1;
                const helixR = 3.5;
                x = Math.cos(t + strand * Math.PI / 2) * helixR;
                y = ((i / count) - 0.5) * 14;
                z = Math.sin(t + strand * Math.PI / 2) * helixR;
                if (i % 20 < 3) {
                    const progress = (i % 20) / 2;
                    x *= (1 - progress);
                    z *= (1 - progress);
                }
                break;
            }
            default: {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const r = 5;
                x = r * Math.sin(phi) * Math.cos(theta);
                y = r * Math.sin(phi) * Math.sin(theta);
                z = r * Math.cos(phi);
            }
        }

        arr[i3] = x;
        arr[i3 + 1] = y;
        arr[i3 + 2] = z;
    }
    return arr;
}

// ─── Vertex Shader ─────────────────────────────────────────
const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSize;
  attribute float aPhase;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Subtle organic drift
    float t = uTime * 0.15;
    pos.x += sin(t + aPhase * 6.283) * 0.12;
    pos.y += cos(t * 0.7 + aPhase * 4.0) * 0.10;
    pos.z += sin(t * 0.5 + aPhase * 2.0) * 0.08;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    gl_PointSize = aSize * (180.0 / -mvPosition.z) * uPixelRatio;
    gl_PointSize = max(gl_PointSize, 0.5);

    float zNorm = clamp((-mvPosition.z - 2.0) / 40.0, 0.0, 1.0);
    vAlpha = mix(0.9, 0.08, zNorm);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

// ─── Fragment Shader ───────────────────────────────────────
const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float core = 1.0 - smoothstep(0.0, 0.12, dist);
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    glow = pow(glow, 2.2);

    vec3 color = mix(uColor, vec3(1.0), core * 0.5);
    float alpha = (core * 0.8 + glow * 0.3) * vAlpha;

    gl_FragColor = vec4(color, alpha);
  }
`;

// ─── Inner Scene ─────────────────────────────────────────
const ParticleScene = () => {
    const pointsRef = useRef<THREE.Points>(null);
    const { primary } = useThemeColors();
    const { camera } = useThree();
    const activeNodeId = useAppStore((s) => s.activeNodeId);

    const morphAngle = useRef(0);

    // Scatter positions (sorted by distance — closest first)
    const sortedScatter = useMemo(() => {
        const raw = generateSpherePositions(PARTICLE_COUNT, SPHERE_RADIUS);
        const distances: { index: number; dist: number }[] = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            const dx = raw[i3], dy = raw[i3 + 1], dz = raw[i3 + 2];
            distances.push({ index: i, dist: Math.sqrt(dx * dx + dy * dy + dz * dz) });
        }
        distances.sort((a, b) => a.dist - b.dist);
        const sorted = new Float32Array(PARTICLE_COUNT * 3);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const src = distances[i].index * 3;
            const dst = i * 3;
            sorted[dst] = raw[src];
            sorted[dst + 1] = raw[src + 1];
            sorted[dst + 2] = raw[src + 2];
        }
        return sorted;
    }, []);

    // Per-particle attributes
    const { sizes, phases } = useMemo(() => {
        const siz = new Float32Array(PARTICLE_COUNT);
        const pha = new Float32Array(PARTICLE_COUNT);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            siz[i] = 0.8 + Math.random() * 2.0;
            pha[i] = Math.random();
        }
        return { sizes: siz, phases: pha };
    }, []);

    // Working positions
    const currentPositions = useMemo(
        () => new Float32Array(sortedScatter),
        [sortedScatter]
    );

    // Target positions
    const targetPositions = useRef<Float32Array>(new Float32Array(sortedScatter));

    // ① Mouse: store world-space position directly, no smoothing
    const mouseWorld = useRef(new THREE.Vector3(9999, 9999, 0)); // start offscreen

    useEffect(() => {
        const onMove = (e: PointerEvent) => {
            // NDC
            const ndcX = (e.clientX / window.innerWidth) * 2 - 1;
            const ndcY = -(e.clientY / window.innerHeight) * 2 + 1;

            // Unproject to z=0 plane
            const vec = new THREE.Vector3(ndcX, ndcY, 0.5);
            vec.unproject(camera);
            const dir = vec.sub(camera.position).normalize();
            const t = -camera.position.z / dir.z;
            mouseWorld.current.set(
                camera.position.x + dir.x * t,
                camera.position.y + dir.y * t,
                0
            );
        };
        window.addEventListener('pointermove', onMove);
        return () => window.removeEventListener('pointermove', onMove);
    }, [camera]);

    // Update target when activeNodeId changes
    useEffect(() => {
        const newTarget = new Float32Array(sortedScatter);
        if (activeNodeId) {
            const shapePositions = generateShape(activeNodeId, MORPH_COUNT);
            for (let i = 0; i < MORPH_COUNT; i++) {
                const i3 = i * 3;
                newTarget[i3] = shapePositions[i3];
                newTarget[i3 + 1] = shapePositions[i3 + 1];
                newTarget[i3 + 2] = shapePositions[i3 + 2];
            }
        }
        targetPositions.current = newTarget;
        morphAngle.current = 0;
    }, [activeNodeId, sortedScatter]);

    // Geometry
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
        geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
        return geo;
    }, [currentPositions, sizes, phases]);

    // Material
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(primary) },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
            },
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
    }, []);

    // Cleanup WebGL resources
    useEffect(() => {
        return () => {
            geometry.dispose();
            material.dispose();
        };
    }, [geometry, material]);

    // Animation loop
    useFrame((_, delta) => {
        if (!pointsRef.current) return;

        const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;
        const target = targetPositions.current;

        material.uniforms.uTime.value += delta;
        material.uniforms.uColor.value.set(primary);

        const mx = mouseWorld.current.x;
        const my = mouseWorld.current.y;

        const isMorphing = !!activeNodeId;

        // Accumulate morph rotation
        if (isMorphing) {
            morphAngle.current += delta * 0.15;
        }
        const cosA = Math.cos(morphAngle.current);
        const sinA = Math.sin(morphAngle.current);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            const isMorphParticle = i < MORPH_COUNT;

            let tx = target[i3];
            let ty = target[i3 + 1];
            let tz = target[i3 + 2];

            if (isMorphing && isMorphParticle) {
                // Morph particles: rotate target around Y, then lerp
                const rx = tx * cosA + tz * sinA;
                const rz = -tx * sinA + tz * cosA;
                posArray[i3] += (rx - posArray[i3]) * MORPH_LERP;
                posArray[i3 + 1] += (ty - posArray[i3 + 1]) * MORPH_LERP;
                posArray[i3 + 2] += (rz - posArray[i3 + 2]) * MORPH_LERP;
            } else if (isMorphing && !isMorphParticle) {
                // ③ Ambient particles during morph: drift slowly toward center (0,0,0)
                const cx = posArray[i3];
                const cy = posArray[i3 + 1];
                const cz = posArray[i3 + 2];
                const distToCenter = Math.sqrt(cx * cx + cy * cy + cz * cz);

                if (distToCenter < DRIFT_RESPAWN_DIST) {
                    // Respawn at scatter position (loop the drift)
                    posArray[i3] = sortedScatter[i3];
                    posArray[i3 + 1] = sortedScatter[i3 + 1];
                    posArray[i3 + 2] = sortedScatter[i3 + 2];
                } else {
                    // Drift inward
                    const driftFactor = DRIFT_SPEED * delta;
                    posArray[i3] -= (cx / distToCenter) * driftFactor * distToCenter * 0.08;
                    posArray[i3 + 1] -= (cy / distToCenter) * driftFactor * distToCenter * 0.08;
                    posArray[i3 + 2] -= (cz / distToCenter) * driftFactor * distToCenter * 0.08;
                }
            } else {
                // Scattered state: lerp back to scatter targets
                posArray[i3] += (tx - posArray[i3]) * SCATTER_LERP;
                posArray[i3 + 1] += (ty - posArray[i3 + 1]) * SCATTER_LERP;
                posArray[i3 + 2] += (tz - posArray[i3 + 2]) * SCATTER_LERP;
            }

            // ① Instant mouse displacement — direct push, no lerp
            const dx = posArray[i3] - mx;
            const dy = posArray[i3 + 1] - my;
            const distSq = dx * dx + dy * dy;
            const radiusSq = MOUSE_PUSH_RADIUS * MOUSE_PUSH_RADIUS;
            if (distSq < radiusSq && distSq > 0.001) {
                const dist = Math.sqrt(distSq);
                const normalizedForce = 1 - dist / MOUSE_PUSH_RADIUS;
                const force = normalizedForce * normalizedForce * MOUSE_PUSH_STRENGTH; // quadratic falloff
                posArray[i3] += (dx / dist) * force * delta * 60; // frame-rate independent
                posArray[i3 + 1] += (dy / dist) * force * delta * 60;
            }
        }

        posAttr.needsUpdate = true;

        // Keep rotation at zero (per-particle rotation above)
        if (pointsRef.current) {
            pointsRef.current.rotation.y = 0;
        }
    });

    return (
        <points ref={pointsRef} geometry={geometry} material={material} />
    );
};

// ─── Exported full-screen component ────────────────────────
export const NeuralParticleField = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Radial vignette: bright center → dark edges */}
            <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 70% 65% at 50% 50%, transparent 20%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.65) 85%, rgba(0,0,0,0.85) 100%)',
                }}
            />
            <Canvas
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                }}
                camera={{ position: [0, 0, 15], fov: 60, near: 0.1, far: 100 }}
                style={{ pointerEvents: 'none' }}
                dpr={[1, 2]}
            >
                <ParticleScene />
            </Canvas>
        </div>
    );
};
