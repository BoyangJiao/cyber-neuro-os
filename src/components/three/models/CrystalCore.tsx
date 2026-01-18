import { useRef, useMemo, useEffect } from 'react';
import { useGLTF, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../../store/useAppStore';
import { createFullUniforms, fresnelVertexShader, fresnelFragmentShader } from '../shaders';

/**
 * CrystalCore - 基于 GLB 模型的全息水晶核心
 * 
 * 使用统一的 Fresnel 着色器模块，支持：
 * - 基础 Fresnel 边缘发光
 * - Cyber RGB 多色渐变 + 扫描线
 * - Glitch 故障效果
 */
export const CrystalCore = () => {
    const groupRef = useRef<THREE.Group>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const glitchSettings = useAppStore((state) => state.glitchSettings);
    const cyberRgbSettings = useAppStore((state) => state.cyberRgbSettings);
    const brandTheme = useAppStore((state) => state.brandTheme);

    const { scene } = useGLTF('/models/CrystalCore%20v2.glb');

    // Theme color mapping
    const themeColors = {
        cyan: '#00F0FF',
        green: '#00FF88',
        red: '#FF0055'
    };

    // 同步效果设置到 shader uniforms
    useEffect(() => {
        if (materialRef.current) {
            const u = materialRef.current.uniforms;

            // Update theme colors
            const themeColor = themeColors[brandTheme] || themeColors.cyan;
            u.uColor.value.set(themeColor);
            u.uGlowColor.value.set(themeColor);

            // Glitch uniforms
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

            // Cyber RGB uniforms
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
    }, [glitchSettings, cyberRgbSettings, brandTheme]);

    useFrame((_, delta) => {
        if (groupRef.current) groupRef.current.rotation.y += delta * 0.1;
        if (materialRef.current) materialRef.current.uniforms.uTime.value += delta;
    });

    // 使用统一的 shader 模块创建材质
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

useGLTF.preload('/models/CrystalCore%20v2.glb');
