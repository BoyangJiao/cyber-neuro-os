import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration, ToneMapping, BrightnessContrast, HueSaturation, SSAO } from '@react-three/postprocessing';
import * as THREE from 'three';
import { MotionDiv } from '../motion/MotionWrappers';
import { useAppStore } from '../../store/useAppStore';
import { useMusicStore } from '../../store/useMusicStore';

// ─── Constants (1:1 Sketchfab Parameters) ──────────────────────────────────────
const DREAM_MODEL_URL = '/models/cyber_river-draco.glb';
const DREAM_MUSIC_URL = '/music/I Really Want to Stay at Your House.mp3';
const MUSIC_FADE_DURATION = 3000;

// Camera settings - FOV 74.74 from Sketchfab prefetchedData
const CAM_FOV = 74.74;
const CAM_START_Z = 35;        // Adjusted starting position for FOV 75
const CAM_END_Z = -150;        // Loop point
const CAM_HEIGHT = -18;        // From prefetchedData Y pos ~ -20
const CAM_X = 10;              // From prefetchedData X pos ~ 13
const CAM_DRIFT_SPEED = 2.0;
const CAM_LOOK_OFFSET_Z = -50; 

// ─── Audio Manager ───────────────────────────────────────────────────────────
let dreamAudioEl: HTMLAudioElement | null = null;
let dreamFadeRafId: number | undefined;

function fadeDreamMusic(audio: HTMLAudioElement, targetVol: number, duration: number, onComplete?: () => void) {
    if (dreamFadeRafId) cancelAnimationFrame(dreamFadeRafId);
    const startVol = audio.volume;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        audio.volume = startVol + (targetVol - startVol) * eased;
        if (progress < 1) {
            dreamFadeRafId = requestAnimationFrame(step);
        } else {
            dreamFadeRafId = undefined;
            onComplete?.();
        }
    };
    dreamFadeRafId = requestAnimationFrame(step);
}

interface SceneProps {
    debug?: boolean;
}

const SceneStateReporter = ({ onCameraUpdate }: { onCameraUpdate: (cam: THREE.Camera) => void }) => {
    const { camera } = useThree();
    useEffect(() => {
        onCameraUpdate(camera);
    }, [camera, onCameraUpdate]);
    return null;
};

// ─── 3D Scene: CyberRiver Model ──────────────────────────────────────────────
const CyberRiverScene = ({ debug }: SceneProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF(DREAM_MODEL_URL);
    const { actions } = useAnimations(animations, groupRef);
    const { camera } = useThree();

    const mouseRef = useRef({ x: 0, y: 0 });
    const smoothMouse = useRef({ x: 0, y: 0 });
    const camZ = useRef(CAM_START_Z);

    useEffect(() => {
        if (actions) {
            Object.values(actions).forEach(action => {
                if (action) action.reset().fadeIn(0.5).play();
            });
        }

        // 1:1 Material Tuning to solve "Paper/Boxy" artifacts
        scene.traverse((obj: any) => {
            if (obj.isMesh) {
                const mat = obj.material;
                
                // Fix Transparency Sorting & "Grey Boxes"
                if (mat.transparent || mat.opacity < 1) {
                    mat.depthWrite = false;
                    mat.alphaTest = 0;
                    // Clouds, plumes, and fog planes must use Additive Blending to look ethereal
                    if (obj.name.toLowerCase().includes('plane') || 
                        obj.name.toLowerCase().includes('cloud') || 
                        obj.name.toLowerCase().includes('fog') ||
                        obj.name.toLowerCase().includes('plume')) {
                        mat.blending = THREE.AdditiveBlending;
                        mat.transparent = true;
                        mat.opacity = Math.min(mat.opacity, 0.4);
                    }
                }

                // Emissive Boost for Bloom
                if (mat.emissive) {
                    const color = mat.emissive;
                    if (color.r > 0 || color.g > 0 || color.b > 0) {
                        mat.emissiveIntensity = 5.0; // Works with low threshold 0.059
                    }
                }

                // Reflections Setup
                mat.envMapIntensity = 2.3; // Matches Sketchfab Env Exposure 2.3
                mat.roughness = Math.max(mat.roughness, 0.1);
            }
        });

        camera.position.set(CAM_X, CAM_HEIGHT, CAM_START_Z);
        camZ.current = CAM_START_Z;

        return () => {
            Object.values(actions).forEach(action => action?.stop());
        };
    }, [actions, camera, scene]);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', onMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);

    useFrame((_, delta) => {
        if (debug) return;
        camZ.current -= CAM_DRIFT_SPEED * delta;
        if (camZ.current < CAM_END_Z) camZ.current = CAM_START_Z;

        smoothMouse.current.x = THREE.MathUtils.lerp(smoothMouse.current.x, mouseRef.current.x, 0.03);
        smoothMouse.current.y = THREE.MathUtils.lerp(smoothMouse.current.y, mouseRef.current.y, 0.03);

        camera.position.x = CAM_X + smoothMouse.current.x * 2.0;
        camera.position.y = CAM_HEIGHT + smoothMouse.current.y * 1.5;
        camera.position.z = camZ.current;

        camera.lookAt(
            CAM_X + smoothMouse.current.x * 0.5,
            CAM_HEIGHT - 0.5,
            camZ.current + CAM_LOOK_OFFSET_Z
        );
    });

    return (
        <>
            {debug && <OrbitControls makeDefault />}
            <group ref={groupRef}>
                <primitive object={scene} />
            </group>
        </>
    );
};

// ─── Main Dream Mode Overlay ─────────────────────────────────────────────────
const DreamMode = () => {
    const setDreamMode = useAppStore(state => state.setDreamMode);
    const [showHint, setShowHint] = useState(true);
    const [isDebug, setIsDebug] = useState(false);
    const cameraRef = useRef<THREE.Camera | null>(null);

    const exitDreamMode = useCallback(() => {
        if (dreamAudioEl) {
            fadeDreamMusic(dreamAudioEl, 0, MUSIC_FADE_DURATION, () => {
                dreamAudioEl?.pause();
                if (dreamAudioEl) dreamAudioEl.currentTime = 0;
            });
        }
        setDreamMode(false);
    }, [setDreamMode]);

    useEffect(() => {
        if (!dreamAudioEl) {
            dreamAudioEl = new Audio(DREAM_MUSIC_URL);
            dreamAudioEl.loop = true;
            dreamAudioEl.crossOrigin = 'anonymous';
        }
        dreamAudioEl.volume = 0;
        dreamAudioEl.play().then(() => {
            fadeDreamMusic(dreamAudioEl!, 0.2, MUSIC_FADE_DURATION);
        }).catch(e => console.warn('Audio blocked', e));

        const timer = setTimeout(() => setShowHint(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const h = () => exitDreamMode();
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [exitDreamMode]);

    return (
        <MotionDiv
            className="fixed inset-0 z-[200] bg-black cursor-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Canvas
                shadows
                dpr={[1, 2]}
                gl={{ 
                    antialias: true, 
                    stencil: false, 
                    depth: true, 
                    toneMapping: THREE.ReinhardToneMapping, // 1:1 Sketchfab Standard
                    toneMappingExposure: 0.927              // 1:1 Sketchfab Param
                }}
            >
                <PerspectiveCamera makeDefault position={[CAM_X, CAM_HEIGHT, CAM_START_Z]} fov={CAM_FOV} near={0.1} far={2000} />
                <color attach="background" args={['#0a0212']} />
                <fogExp2 attach="fog" args={['#1c0429', 0.008]} />

                {/* Lighting - Driven by Env Map 2.3 + Ambient 3.5 */}
                <Environment preset="sunset" />
                <ambientLight intensity={1.5} /> 

                <SceneStateReporter onCameraUpdate={(cam) => { cameraRef.current = cam; }} />
                <CyberRiverScene debug={isDebug} />

                {/* 1:1 POST-PROCESSING PIPELINE */}
                <EffectComposer multisampling={4}>
                    {/* SSAO - Adding Depth to building gaps */}
                    <SSAO intensity={0.228} radius={29.13} luminanceInfluence={0.5} bias={5.82} />
                    
                    {/* Selective Bloom - The Glow Secret */}
                    <Bloom 
                        intensity={2.0} 
                        luminanceThreshold={0.059} 
                        luminanceSmoothing={1.0} 
                        mipmapBlur 
                        radius={1.0}
                    />

                    {/* Color Correction - Saturation 1.6 from config */}
                    <HueSaturation saturation={0.6} /> {/* Additive Saturation to reach 1.6 */}
                    <BrightnessContrast 
                        brightness={-0.107} 
                        contrast={0.007} 
                    />

                    <ChromaticAberration offset={new THREE.Vector2(0.0106, 0.0106)} />
                    <Vignette darkness={0.725} offset={0.453} />
                    <Noise opacity={0.24} />
                </EffectComposer>
            </Canvas>

            {/* HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 font-mono">
                <div className="absolute top-8 right-8 flex flex-col items-end gap-2 pointer-events-auto">
                    <button onClick={exitDreamMode} className="px-3 py-1 text-[10px] border border-red-500/50 text-red-500 hover:bg-red-500/20 transition-colors uppercase">[ EXIT DREAM MODE ]</button>
                    <button onClick={() => setIsDebug(!isDebug)} className={`px-3 py-1 text-[10px] border transition-colors ${isDebug ? 'bg-[var(--color-brand-primary)] text-black border-none' : 'text-[var(--color-brand-primary)] border-[var(--color-brand-primary)]/40 hover:bg-[var(--color-brand-primary)]/10'}`}>[ DEBUG: {isDebug ? 'ON' : 'OFF'} ]</button>
                    {isDebug && <button onClick={() => {
                        const cam = cameraRef.current;
                        if (!cam) return;
                        console.log(`CAM: pos[${cam.position.toArray().map(v=>v.toFixed(2))}] rot[${cam.rotation.toArray().slice(0,3).map(v=>v.toFixed(2))}]`);
                        alert('Camera logged');
                    }} className="px-3 py-1 text-[10px] border border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/20">LOG CAMERA</button>}
                </div>

                <div className="absolute top-8 left-8 flex items-center gap-3">
                    <div className="w-1 h-5 bg-[var(--color-brand-primary)] shadow-[0_0_10px_var(--color-brand-primary)]" />
                    <span className="text-xs text-[var(--color-brand-primary)]/60 tracking-[0.4em] uppercase">DREAM.MODE // 入梦模式</span>
                </div>

                <MotionDiv className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] text-[var(--color-text-subtle)] tracking-[0.3em] uppercase" animate={{ opacity: showHint ? 0.6 : 0 }}>
                    ANY KEY TO WAKE UP
                </MotionDiv>
            </div>
        </MotionDiv>
    );
};

export default DreamMode;
