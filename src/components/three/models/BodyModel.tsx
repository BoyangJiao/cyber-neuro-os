import { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 菲涅尔全息材质着色器
 * 边缘发光强，中心透明，模拟扫描/投影效果
 */
const HolographicMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xff3333) },
        uGlowColor: { value: new THREE.Color(0xff6666) },
        uFresnelPower: { value: 2.0 },
        uOpacity: { value: 0.7 },
        uScanlineSpeed: { value: 1.5 },
        uScanlineCount: { value: 30.0 },
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec2 vUv;
        
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            vUv = uv;
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform vec3 uGlowColor;
        uniform float uFresnelPower;
        uniform float uOpacity;
        uniform float uScanlineSpeed;
        uniform float uScanlineCount;
        
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec2 vUv;
        
        void main() {
            // 菲涅尔效果 - 边缘更亮
            vec3 viewDir = normalize(vViewPosition);
            float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), uFresnelPower);
            
            // 扫描线效果
            float scanline = sin((vUv.y + uTime * uScanlineSpeed * 0.1) * uScanlineCount * 3.14159) * 0.5 + 0.5;
            scanline = smoothstep(0.3, 0.7, scanline);
            
            // 轻微闪烁
            float flicker = 0.95 + 0.05 * sin(uTime * 10.0);
            
            // 混合颜色
            vec3 finalColor = mix(uColor, uGlowColor, fresnel);
            
            // 最终透明度 = 菲涅尔 * 扫描线 * 闪烁
            float alpha = fresnel * (0.6 + 0.4 * scanline) * flicker * uOpacity;
            
            // 添加边缘发光
            alpha = max(alpha, fresnel * 0.3);
            
            gl_FragColor = vec4(finalColor, alpha);
        }
    `,
};

/**
 * BodyModel - 基于 GLB 模型的全息人形组件
 * 使用菲涅尔着色器实现边缘发光的全息效果
 */
export const BodyModel = () => {
    const groupRef = useRef<THREE.Group>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    // 加载 GLB 模型
    const { scene } = useGLTF('/models/human_body-v3.glb');


    // 动画：旋转 + 更新时间uniform
    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.15;
        }
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += delta;
        }
    });

    // 创建全息着色器材质
    const holoMaterial = useMemo(() => {
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(0xff3333) },
                uGlowColor: { value: new THREE.Color(0xff8888) },
                uFresnelPower: { value: 2.5 },
                uOpacity: { value: 0.85 },
                uScanlineSpeed: { value: 1.0 },
                uScanlineCount: { value: 40.0 },
            },
            vertexShader: HolographicMaterial.vertexShader,
            fragmentShader: HolographicMaterial.fragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        materialRef.current = mat;
        return mat;
    }, []);

    // 计算模型边界
    const { normalizedScale, offsetY } = useMemo(() => {
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        const targetSize = 1.5;
        const scale = maxDim > 0 ? targetSize / maxDim : 1;

        return {
            normalizedScale: scale,
            offsetY: -center.y * scale
        };
    }, [scene]);

    // 克隆并应用全息材质
    const holoScene = useMemo(() => {
        const cloned = scene.clone(true);
        cloned.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = holoMaterial;
            }
        });
        return cloned;
    }, [scene, holoMaterial]);

    return (
        <group
            ref={groupRef}
            position={[0, offsetY, 0]}
            scale={normalizedScale}
        >
            <primitive object={holoScene} />
        </group>
    );
};

// 预加载模型
useGLTF.preload('/models/human_body-v3.glb');
