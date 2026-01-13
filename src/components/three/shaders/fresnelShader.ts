/**
 * Fresnel 全息顶点着色器
 * 
 * 功能：
 * - 顶点位移抖动 (Glitch)
 * - 传递法线、UV、位置给片段着色器
 */
export const fresnelVertexShader = `
uniform float uTime;
uniform float uVertexDisplacement;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;
varying vec3 vPosition;
varying float vGlitchFactor;

float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vPosition = position;
    
    vec3 displaced = position;
    float glitchActive = 0.0;
    
    // 顶点位移 - 不可预测的稀有爆发
    if (uVertexDisplacement > 0.01) {
        float t = uTime;
        float mainBurstWindow = floor(t * 0.5);
        float mainBurst = step(0.85, hash(mainBurstWindow));
        float secondaryBurst = step(0.80, hash(floor(t * 1.5 + 50.0))) * 0.7;
        float microBurst = step(0.90, hash(floor(t * 4.0 + 100.0))) * 0.4;
        glitchActive = max(max(mainBurst, secondaryBurst), microBurst);
        
        float burstPhase = fract(t * 0.5);
        float burstEnvelope = smoothstep(0.0, 0.15, burstPhase) * smoothstep(0.6, 0.3, burstPhase);
        glitchActive *= max(burstEnvelope, 0.3);
        
        float intensity = uVertexDisplacement * 0.5;
        float sliceY = floor(position.y * 5.0);
        float slicePhase = hash(sliceY + floor(t * 6.0));
        displaced.x += (slicePhase * 2.0 - 1.0) * 0.25 * glitchActive * intensity;
        float jitterSeed = hash2(vec2(position.x * 50.0, position.y * 30.0 + floor(t * 10.0)));
        displaced += normal * (jitterSeed - 0.5) * 0.15 * glitchActive * intensity;
        displaced.z += sin(position.y * 6.0 + t * 12.0) * 0.08 * glitchActive * intensity;
    }
    
    vGlitchFactor = glitchActive;
    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
}
`;

/**
 * Fresnel 全息片段着色器
 * 
 * 效果层：
 * 1. 基础 Fresnel 边缘发光
 * 2. Cyber RGB 多色渐变 + 扫描线
 * 3. Glitch 故障效果
 */
export const fresnelFragmentShader = `
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uGlowColor;
uniform float uFresnelPower;
uniform float uOpacity;
uniform float uScanlineSpeed;
uniform float uScanlineCount;
// Glitch
uniform float uMasterIntensity;
uniform float uRgbSplit;
uniform float uGlitchBands;
uniform float uFlickerBands;
uniform float uColorInvert;
uniform float uStrobe;
uniform float uNoiseOverlay;
uniform float uScanlineVariation;
// Cyber RGB
uniform float uCyberRgbEnabled;
uniform vec3 uCyberColorA;
uniform vec3 uCyberColorB;
uniform vec3 uCyberColorC;
uniform float uCyberColorCount;
uniform float uCyberColorSpeed;
uniform float uCyberMixIntensity;
uniform float uCyberScanSpeed;
uniform float uCyberScanWidth;
uniform float uCyberScanDir;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;
varying vec3 vPosition;
varying float vGlitchFactor;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float hash1(float n) { return fract(sin(n) * 43758.5453); }

void main() {
    float t = uTime;
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), uFresnelPower);
    
    // === BASE COLOR ===
    vec3 baseColor = uColor;
    
    // === CYBER RGB LAYER ===
    if (uCyberRgbEnabled > 0.5) {
        float colorMix = sin(vPosition.y * 3.0 + t * uCyberColorSpeed * 2.0) * 0.5 + 0.5;
        vec3 cyberColor = mix(uCyberColorA, uCyberColorB, colorMix);
        
        if (uCyberColorCount > 2.5) {
            float colorMix2 = cos(vPosition.x * 3.0 + t * uCyberColorSpeed * 1.5) * 0.5 + 0.5;
            cyberColor = mix(cyberColor, uCyberColorC, colorMix2 * 0.4);
        }
        
        baseColor = mix(baseColor, cyberColor, uCyberMixIntensity);
        
        float scanWidth = 40.0 + uCyberScanWidth * 40.0;
        float hScan = 1.0, vScan = 1.0;
        
        if (uCyberScanDir < 0.5 || uCyberScanDir > 1.5) {
            hScan = sin((vUv.y + t * uCyberScanSpeed * 0.3) * scanWidth) * 0.5 + 0.5;
            hScan = smoothstep(0.3, 0.7, hScan);
        }
        if (uCyberScanDir > 0.5) {
            vScan = sin((vUv.x + t * uCyberScanSpeed * 0.25) * scanWidth * 0.8) * 0.5 + 0.5;
            vScan = smoothstep(0.4, 0.6, vScan);
        }
        
        baseColor *= (0.7 + 0.3 * hScan * vScan);
    }
    
    // === GLITCH LAYER ===
    float glitchMaster = 0.0;
    if (uMasterIntensity > 0.01) {
        float burst1 = step(0.88, hash1(floor(t * 4.0)));
        float burst2 = step(0.92, hash1(floor(t * 9.0 + 50.0)));
        float burst3 = step(0.80, hash1(floor(t * 2.0 + 100.0))) * step(0.95, hash1(floor(t * 17.0)));
        glitchMaster = max(max(burst1, burst2), max(burst3, vGlitchFactor));
    }
    
    if (uRgbSplit > 0.01) {
        float rgbSplit = glitchMaster * uRgbSplit * 0.15;
        baseColor.r += sin(t + rgbSplit * 10.0) * 0.1 * rgbSplit;
        baseColor.b -= sin(t - rgbSplit * 10.0) * 0.1 * rgbSplit;
    }
    
    vec3 finalColor = mix(baseColor, uGlowColor, fresnel * 0.7);
    
    float glitchBand = 0.0;
    if (uGlitchBands > 0.01) {
        float bandY = floor(vUv.y * 15.0 + t * 8.0);
        glitchBand = step(1.0 - uGlitchBands * 0.3, hash(vec2(bandY, floor(t * 12.0))));
        if (glitchBand > 0.5) {
            finalColor = mix(finalColor, vec3(1.0, 0.0, 1.0), 0.5 * uGlitchBands);
        }
    }
    
    if (uFlickerBands > 0.01) {
        float flickerBand = step(1.0 - uFlickerBands * 0.2, hash(vec2(floor(vUv.y * 25.0), floor(t * 20.0))));
        finalColor += flickerBand * vec3(0.5, 0.8, 1.0) * uFlickerBands;
    }
    
    if (uColorInvert > 0.01 && glitchMaster > 0.3) {
        float invertZone = step(1.0 - uColorInvert * 0.15, hash(vec2(floor(vUv.y * 8.0 + t * 5.0), floor(t * 7.0))));
        if (invertZone > 0.5) {
            finalColor = mix(finalColor, vec3(1.0) - finalColor, uColorInvert);
        }
    }
    
    if (uStrobe > 0.01) {
        float strobe = step(0.7, hash1(floor(t * 25.0))) * glitchMaster;
        finalColor *= (1.0 + strobe * uStrobe);
    }
    
    float scanSpeed = uScanlineSpeed * (1.0 - uScanlineVariation * 0.3 * hash1(floor(t * 5.0)));
    float scanline = sin((vUv.y + t * scanSpeed * 0.1) * uScanlineCount * 3.14159) * 0.5 + 0.5;
    float pulse = 0.9 + 0.1 * sin(t * 3.0);
    float alpha = fresnel * (0.4 + 0.6 * smoothstep(0.4, 0.6, scanline)) * pulse * uOpacity;
    alpha = max(alpha, fresnel * 0.3);
    alpha *= (1.0 - glitchBand * 0.3 * uGlitchBands);
    alpha = clamp(alpha, 0.0, 1.0);
    
    if (uNoiseOverlay > 0.01) {
        finalColor += hash(vUv * 500.0 + t * 100.0) * 0.1 * glitchMaster * uNoiseOverlay;
    }
    
    gl_FragColor = vec4(finalColor, alpha);
}
`;
