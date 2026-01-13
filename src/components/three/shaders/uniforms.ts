import * as THREE from 'three';

/**
 * Glitch 效果 uniform 定义
 * 用于所有支持 Glitch 效果的 shader 材质
 */
export const createGlitchUniforms = () => ({
    uMasterIntensity: { value: 0.5 },
    uRgbSplit: { value: 0.3 },
    uVertexDisplacement: { value: 0.25 },
    uGlitchBands: { value: 0.4 },
    uFlickerBands: { value: 0.3 },
    uColorInvert: { value: 0.0 },
    uStrobe: { value: 0.0 },
    uNoiseOverlay: { value: 0.2 },
    uScanlineVariation: { value: 0.5 },
});

/**
 * Cyber RGB 效果 uniform 定义
 * 用于所有支持 Cyber RGB 效果的 shader 材质
 */
export const createCyberRgbUniforms = () => ({
    uCyberRgbEnabled: { value: 0.0 },
    uCyberColorA: { value: new THREE.Color(0x00ffff) },
    uCyberColorB: { value: new THREE.Color(0xff00ff) },
    uCyberColorC: { value: new THREE.Color(0xffff00) },
    uCyberColorCount: { value: 2.0 },
    uCyberColorSpeed: { value: 0.5 },
    uCyberMixIntensity: { value: 0.7 },
    uCyberScanSpeed: { value: 0.5 },
    uCyberScanWidth: { value: 0.5 },
    uCyberScanDir: { value: 2.0 }, // 0=H, 1=V, 2=Both
});

/**
 * 基础 Fresnel 全息效果 uniform 定义
 */
export const createFresnelUniforms = () => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(0x00ffff) },
    uGlowColor: { value: new THREE.Color(0xffffff) },
    uFresnelPower: { value: 1.5 },
    uOpacity: { value: 0.8 },
    uScanlineSpeed: { value: 1.0 },
    uScanlineCount: { value: 30.0 },
});

/**
 * 创建完整的 Fresnel + Glitch + CyberRGB uniforms
 */
export const createFullUniforms = () => ({
    ...createFresnelUniforms(),
    ...createGlitchUniforms(),
    ...createCyberRgbUniforms(),
});
