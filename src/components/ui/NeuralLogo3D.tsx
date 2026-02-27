/**
 * NeuralLogo3D — Neural Core / Nexus
 *
 * A true 3D polyhedron "neural core" rendered in Three.js:
 * - Outer icosahedron wireframe shell (slowly tumbling)
 * - Inner octahedron wireframe (counter-rotating, faster)
 * - Glowing vertex nodes at every polyhedron vertex
 * - Neural connection lines bridging inner ↔ outer vertices
 * - Bright pulsing core sphere at the center with glow
 * - Orbiting energy particles
 * - Full 360° continuous multi-axis rotation
 */

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Read CSS brand colors ───

function useBrandColors() {
    const [primary, setPrimary] = useState('#00f0ff');
    const [secondary, setSecondary] = useState('#00f0ff');

    useEffect(() => {
        const read = () => {
            const s = getComputedStyle(document.documentElement);
            const p = s.getPropertyValue('--color-brand-primary').trim();
            const sc = s.getPropertyValue('--color-brand-secondary').trim();
            if (p) setPrimary(p);
            if (sc) setSecondary(sc);
        };
        read();
        const observer = new MutationObserver(read);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
        return () => observer.disconnect();
    }, []);

    return { primary, secondary };
}

// ─── Vertex Nodes: Glowing spheres at each vertex of a geometry ───

function VertexNodes({ geometry, color, size = 0.04, pulseSpeed = 2 }: {
    geometry: THREE.BufferGeometry;
    color: string;
    size?: number;
    pulseSpeed?: number;
}) {
    const meshesRef = useRef<THREE.InstancedMesh>(null!);

    const positions = useMemo(() => {
        const posAttr = geometry.getAttribute('position');
        const unique = new Map<string, THREE.Vector3>();
        for (let i = 0; i < posAttr.count; i++) {
            const v = new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
            const key = `${v.x.toFixed(4)},${v.y.toFixed(4)},${v.z.toFixed(4)}`;
            if (!unique.has(key)) unique.set(key, v);
        }
        return Array.from(unique.values());
    }, [geometry]);

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const mat = useMemo(() => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 }), [color]);
    const sphereGeo = useMemo(() => new THREE.SphereGeometry(size, 6, 6), [size]);

    useFrame(() => {
        const time = Date.now() * 0.001;
        positions.forEach((pos, i) => {
            const scale = 0.6 + 0.4 * Math.sin(time * pulseSpeed + i * 0.8);
            dummy.position.copy(pos);
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();
            meshesRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshesRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshesRef} args={[sphereGeo, mat, positions.length]} />
    );
}

// ─── Neural Bridges: Lines connecting inner ↔ outer vertices ───

function NeuralBridges({ innerGeo, outerGeo, color }: {
    innerGeo: THREE.BufferGeometry;
    outerGeo: THREE.BufferGeometry;
    color: string;
}) {
    const groupRef = useRef<THREE.Group>(null!);

    const bridgeData = useMemo(() => {
        // Get unique vertices from inner geometry
        const getUnique = (geo: THREE.BufferGeometry) => {
            const posAttr = geo.getAttribute('position');
            const unique = new Map<string, THREE.Vector3>();
            for (let i = 0; i < posAttr.count; i++) {
                const v = new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
                const key = `${v.x.toFixed(4)},${v.y.toFixed(4)},${v.z.toFixed(4)}`;
                if (!unique.has(key)) unique.set(key, v);
            }
            return Array.from(unique.values());
        };

        const innerVerts = getUnique(innerGeo);
        const outerVerts = getUnique(outerGeo);

        // Connect each inner vertex to its nearest outer vertex
        const bridges: { from: THREE.Vector3; to: THREE.Vector3 }[] = [];
        innerVerts.forEach(iv => {
            let nearest = outerVerts[0];
            let minDist = iv.distanceTo(outerVerts[0]);
            outerVerts.forEach(ov => {
                const d = iv.distanceTo(ov);
                if (d < minDist) { minDist = d; nearest = ov; }
            });
            bridges.push({ from: iv, to: nearest });
        });

        return bridges;
    }, [innerGeo, outerGeo]);

    const lineGeo = useMemo(() => {
        const points: number[] = [];
        bridgeData.forEach(b => {
            points.push(b.from.x, b.from.y, b.from.z);
            points.push(b.to.x, b.to.y, b.to.z);
        });
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        return geo;
    }, [bridgeData]);

    const mat = useMemo(() => new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.2,
    }), [color]);

    // Pulse opacity
    useFrame(() => {
        const t = Date.now() * 0.001;
        mat.opacity = 0.1 + 0.15 * Math.sin(t * 1.5);
    });

    return (
        <group ref={groupRef}>
            <lineSegments geometry={lineGeo} material={mat} />
        </group>
    );
}

// ─── Orbiting Energy Particles ───

function EnergyParticles({ count = 40, radius = 1.2, color }: {
    count?: number;
    radius?: number;
    color: string;
}) {
    const ref = useRef<THREE.Points>(null!);

    const [geo, mat] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const speeds = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            // Random spherical distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = radius * (0.8 + Math.random() * 0.5);
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
            speeds[i] = 0.3 + Math.random() * 0.7;
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        g.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));

        const m = new THREE.PointsMaterial({
            color,
            size: 0.02,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        return [g, m];
    }, [count, radius, color]);

    useFrame(() => {
        const time = Date.now() * 0.0005;
        const pos = geo.getAttribute('position');
        const spd = geo.getAttribute('speed') as THREE.BufferAttribute;

        for (let i = 0; i < count; i++) {
            const speed = spd.getX(i);
            const angle = time * speed + i * 1.3;
            const r = radius * (0.85 + 0.15 * Math.sin(time * 2 + i));
            const phi = (i / count) * Math.PI + Math.sin(time + i * 0.5) * 0.3;

            pos.setXYZ(
                i,
                r * Math.sin(phi) * Math.cos(angle),
                r * Math.sin(phi) * Math.sin(angle),
                r * Math.cos(phi)
            );
        }
        pos.needsUpdate = true;
        ref.current.rotation.y = time * 0.1;
    });

    return <points ref={ref} geometry={geo} material={mat} />;
}

// ─── Outer Shell: Icosahedron wireframe ───

function OuterShell({ color }: { color: string }) {
    const ref = useRef<THREE.Group>(null!);

    const edgesGeo = useMemo(() => {
        const ico = new THREE.IcosahedronGeometry(1.2, 0);
        return new THREE.EdgesGeometry(ico);
    }, []);

    const icoGeo = useMemo(() => new THREE.IcosahedronGeometry(1.2, 0), []);

    const wireMat = useMemo(() => new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.3,
    }), [color]);

    const faceMat = useMemo(() => new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.02,
        side: THREE.DoubleSide,
        depthWrite: false,
    }), [color]);

    useFrame((_, delta) => {
        ref.current.rotation.x += delta * 0.06;
        ref.current.rotation.y += delta * 0.08;
        ref.current.rotation.z += delta * 0.03;

        // Subtle breathe
        const breathe = 1 + 0.02 * Math.sin(Date.now() * 0.0008);
        ref.current.scale.setScalar(breathe);
    });

    return (
        <group ref={ref}>
            <lineSegments geometry={edgesGeo} material={wireMat} />
            <mesh geometry={icoGeo} material={faceMat} />
            <VertexNodes geometry={icoGeo} color={color} size={0.035} pulseSpeed={1.5} />
        </group>
    );
}

// ─── Inner Core Structure: Octahedron wireframe ───

function InnerCore({ color, secondaryColor }: { color: string; secondaryColor: string }) {
    const ref = useRef<THREE.Group>(null!);

    const edgesGeo = useMemo(() => {
        const octa = new THREE.OctahedronGeometry(0.55, 0);
        return new THREE.EdgesGeometry(octa);
    }, []);

    const octaGeo = useMemo(() => new THREE.OctahedronGeometry(0.55, 0), []);

    const wireMat = useMemo(() => new THREE.LineBasicMaterial({
        color: secondaryColor,
        transparent: true,
        opacity: 0.6,
    }), [secondaryColor]);

    const faceMat = useMemo(() => new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide,
        depthWrite: false,
    }), [color]);

    useFrame((_, delta) => {
        // Counter-rotate on different axes, faster
        ref.current.rotation.x -= delta * 0.2;
        ref.current.rotation.y -= delta * 0.15;
        ref.current.rotation.z += delta * 0.12;
    });

    return (
        <group ref={ref}>
            <lineSegments geometry={edgesGeo} material={wireMat} />
            <mesh geometry={octaGeo} material={faceMat} />
            <VertexNodes geometry={octaGeo} color={secondaryColor} size={0.04} pulseSpeed={3} />
        </group>
    );
}

// ─── Center Nucleus: Glowing sphere + ring ───

function Nucleus({ color }: { color: string }) {
    const glowRef = useRef<THREE.Mesh>(null!);
    const coreRef = useRef<THREE.Mesh>(null!);
    const ringRef = useRef<THREE.Mesh>(null!);

    const glowGeo = useMemo(() => new THREE.SphereGeometry(0.2, 24, 24), []);
    const coreGeo = useMemo(() => new THREE.SphereGeometry(0.08, 16, 16), []);
    const ringGeo = useMemo(() => new THREE.TorusGeometry(0.3, 0.008, 8, 64), []);

    const glowMat = useMemo(() => new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    }), [color]);

    const coreMat = useMemo(() => new THREE.MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.95,
    }), []);

    const ringMat = useMemo(() => new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    }), [color]);

    useFrame(() => {
        const t = Date.now() * 0.001;
        // Breathing core
        const s = 1 + 0.3 * Math.sin(t * 2);
        glowRef.current.scale.setScalar(s);
        coreRef.current.scale.setScalar(0.8 + 0.2 * Math.sin(t * 3));

        // Rotating ring
        ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.4;
        ringRef.current.rotation.y += 0.01;
    });

    return (
        <group>
            <mesh ref={glowRef} geometry={glowGeo} material={glowMat} />
            <mesh ref={coreRef} geometry={coreGeo} material={coreMat} />
            <mesh ref={ringRef} geometry={ringGeo} material={ringMat} />
        </group>
    );
}

// ─── Complete Scene ───

function NeuralCoreScene({ primary, secondary }: { primary: string; secondary: string }) {
    const sceneRef = useRef<THREE.Group>(null!);

    // Slow overall scene drift for organic feel
    useFrame(() => {
        const t = Date.now() * 0.0002;
        sceneRef.current.rotation.x = Math.sin(t) * 0.1;
        sceneRef.current.rotation.y = t * 0.5;
    });

    // Geometries for bridge connections
    const outerIcoGeo = useMemo(() => new THREE.IcosahedronGeometry(1.2, 0), []);
    const innerOctaGeo = useMemo(() => new THREE.OctahedronGeometry(0.55, 0), []);

    return (
        <group ref={sceneRef}>
            <OuterShell color={primary} />
            <InnerCore color={primary} secondaryColor={secondary} />
            <NeuralBridges innerGeo={innerOctaGeo} outerGeo={outerIcoGeo} color={primary} />
            <Nucleus color={secondary} />
            <EnergyParticles count={50} radius={1.5} color={primary} />
        </group>
    );
}

// ─── Exported Component ───

interface NeuralLogo3DProps {
    size?: number;
    className?: string;
}

export const NeuralLogo3D = ({ size = 100, className = '' }: NeuralLogo3DProps) => {
    const { primary, secondary } = useBrandColors();

    return (
        <div
            className={`relative ${className}`}
            style={{ width: size, height: size }}
        >
            {/* Ambient glow */}
            <div
                className="absolute inset-0 rounded-full animate-[neuralPulseGlow_4s_ease-in-out_infinite]"
                style={{
                    background: `radial-gradient(circle, ${primary} 0%, transparent 70%)`,
                    opacity: 0.2,
                    filter: 'blur(16px)',
                }}
            />

            <Canvas
                camera={{ position: [0, 0, 3.8], fov: 35 }}
                style={{ background: 'transparent' }}
                gl={{ alpha: true, antialias: true }}
                dpr={[1, 2]}
            >
                <NeuralCoreScene primary={primary} secondary={secondary} />
            </Canvas>
        </div>
    );
};
