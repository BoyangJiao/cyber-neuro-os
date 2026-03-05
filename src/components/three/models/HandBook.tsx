import { useRef, useMemo, useEffect } from 'react';
import { useGLTF, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { createFullUniforms, fresnelVertexShader, fresnelFragmentShader } from '../shaders';

/**
 * HandBook - based on Hand_book GLB model
 * Uses the same holographic Fresnel shader as CrystalCore
 */
export const HandBook = () => {
    const groupRef = useRef<THREE.Group>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const glitchSettings = useSettingsStore((state) => state.glitchSettings);
    const cyberRgbSettings = useSettingsStore((state) => state.cyberRgbSettings);
    const { primary } = useThemeColors();

    const { scene } = useGLTF('/models/Hand_book-v1.glb');

    useEffect(() => {
        if (materialRef.current) {
            const u = materialRef.current.uniforms;

            u.uColor.value.set(primary);
            u.uGlowColor.value.set(primary);

            const gMaster = glitchSettings.enabled ? glitchSettings.masterIntensity : 0;
            u.uMasterIntensity.value = gMaster;
            u.uRgbSplit.value = glitchSettings.rgbSplit * gMaster;
            u.uVertexDisplacement.value = glitchSettings.vertexDisplacement * gMaster;
            u.uGlitchBands.value = glitchSettings.glitchBands * gMaster;
            u.uFlickerBands.value = glitchSettings.flickerBands * gMaster;
            u.uColorInvert.value = glitchSettings.colorInvert * gMaster;
            u.uStrobe.value = glitchSettings.strobe * gMaster;
            u.uNoiseOverlay.value = glitchSettings.noiseOverlay * gMaster;
            u.uScanlineVariation.value = glitchSettings.scanlineVariation * gMaster;

            u.uCyberRgbEnabled.value = cyberRgbSettings.enabled ? 1.0 : 0.0;
            u.uCyberColorA.value.set(cyberRgbSettings.colorA);
            u.uCyberColorB.value.set(cyberRgbSettings.colorB);
            u.uCyberColorC.value.set(cyberRgbSettings.colorC);
            u.uCyberColorCount.value = cyberRgbSettings.colorCount;
            u.uCyberColorSpeed.value = cyberRgbSettings.colorSpeed;
            u.uCyberMixIntensity.value = cyberRgbSettings.colorMixIntensity;
            u.uCyberScanSpeed.value = cyberRgbSettings.scanlineSpeed;
            u.uCyberScanWidth.value = cyberRgbSettings.scanlineWidth;
            u.uCyberScanDir.value = cyberRgbSettings.scanlineDirection === 'horizontal' ? 0 : cyberRgbSettings.scanlineDirection === 'vertical' ? 1 : 2;
        }
    }, [glitchSettings, cyberRgbSettings, primary]);

    useFrame((_, delta) => {
        if (groupRef.current) groupRef.current.rotation.y += delta * 0.1;
        if (materialRef.current) materialRef.current.uniforms.uTime.value += delta;
    });

    const holoMaterial = useMemo(() => {
        const mat = new THREE.ShaderMaterial({
            uniforms: createFullUniforms(),
            vertexShader: fresnelVertexShader,
            fragmentShader: fresnelFragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        materialRef.current = mat;
        return mat;
    }, []);

    const { normalizedScale, offset } = useMemo(() => {
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 2.5;
        const scale = maxDim > 0 ? targetSize / maxDim : 1;
        return { normalizedScale: scale, offset: center.multiplyScalar(-scale) };
    }, [scene]);

    const holoScene = useMemo(() => {
        const cloned = scene.clone(true);
        cloned.traverse((child) => {
            if (child instanceof THREE.Mesh) child.material = holoMaterial;
        });
        return cloned;
    }, [scene, holoMaterial]);

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
            <group ref={groupRef} position={[offset.x, offset.y, offset.z]} scale={normalizedScale}>
                <primitive object={holoScene} />
            </group>
        </Float>
    );
};

useGLTF.preload('/models/Hand_book-v1.glb');
