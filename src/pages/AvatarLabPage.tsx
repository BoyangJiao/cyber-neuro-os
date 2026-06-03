/**
 * AvatarLabPage — DEV-ONLY Phase 0 proving ground for the Neural Entity avatar.
 *
 * Isolated full-screen overlay with its own Canvas + OrbitControls and a jaw
 * control panel, so the point-cloud head + procedural mouth can be validated
 * (AC.0.1 / AC.0.2) without touching the production dashboard. Route is only
 * registered in dev (see App.tsx). Not part of the shipped site.
 */
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { NeuralEntity } from '../components/three/avatar/NeuralEntity';

export const AvatarLabPage = () => {
    const [jawOpen, setJawOpen] = useState(0);
    const [autoTalk, setAutoTalk] = useState(false);
    const [intensity, setIntensity] = useState(1.0);
    const [pointScale, setPointScale] = useState(1.0);
    const [showWire, setShowWire] = useState(true);
    const [showPoints, setShowPoints] = useState(true);

    // Load any GLB in /public/models via ?model=<file>. Defaults to the facecap
    // head (real ARKit blendshapes). e.g. /avatar-lab?model=neural-avatar.glb
    const modelParam = new URLSearchParams(window.location.search).get('model');
    const modelUrl = `/models/${modelParam || 'facecap-clean.glb'}`;

    return (
        <div className="fixed inset-0 z-100000 bg-[#020406]">
            <Canvas
                camera={{ position: [0, 0.4, 5.5], fov: 42 }}
                gl={{ alpha: false, antialias: true }}
                dpr={[1, 1.5]}
            >
                <NeuralEntity
                    jawOpen={jawOpen}
                    autoTalk={autoTalk}
                    intensity={intensity}
                    pointScale={pointScale}
                    modelUrl={modelUrl}
                    showWire={showWire}
                    showPoints={showPoints}
                />
                <OrbitControls enablePan={false} minDistance={3} maxDistance={14} target={[0, 0.2, 0]} />
            </Canvas>

            {/* HUD controls */}
            <div className="absolute top-4 left-4 w-[280px] rounded border border-brand-primary/30 bg-black/70 p-4 font-mono text-xs text-brand-primary backdrop-blur">
                <div className="mb-3 tracking-[0.2em] text-brand-primary/70">
                    [ NEURAL_ENTITY · PHASE_0 LAB ]
                </div>

                <label className="mb-1 block tracking-widest text-text-secondary">
                    JAW_OPEN: {jawOpen.toFixed(2)}
                </label>
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={jawOpen}
                    disabled={autoTalk}
                    onChange={(e) => setJawOpen(parseFloat(e.target.value))}
                    className="w-full accent-brand-primary disabled:opacity-40"
                />

                <label className="mb-1 mt-4 block tracking-widest text-text-secondary">
                    INTENSITY: {intensity.toFixed(2)}
                </label>
                <input
                    type="range"
                    min={0.3}
                    max={2.5}
                    step={0.05}
                    value={intensity}
                    onChange={(e) => setIntensity(parseFloat(e.target.value))}
                    className="w-full accent-brand-primary"
                />

                <label className="mb-1 mt-3 block tracking-widest text-text-secondary">
                    POINT_SIZE: {pointScale.toFixed(2)}
                </label>
                <input
                    type="range"
                    min={0.4}
                    max={2.0}
                    step={0.05}
                    value={pointScale}
                    onChange={(e) => setPointScale(parseFloat(e.target.value))}
                    className="w-full accent-brand-primary"
                />

                <div className="mt-4 flex gap-2">
                    <button
                        onClick={() => setShowWire((v) => !v)}
                        className={`flex-1 rounded border px-2 py-1.5 tracking-widest transition-colors ${
                            showWire ? 'border-brand-primary bg-brand-primary/15' : 'border-brand-primary/30 opacity-50'
                        }`}
                    >
                        WIRE
                    </button>
                    <button
                        onClick={() => setShowPoints((v) => !v)}
                        className={`flex-1 rounded border px-2 py-1.5 tracking-widest transition-colors ${
                            showPoints ? 'border-brand-primary bg-brand-primary/15' : 'border-brand-primary/30 opacity-50'
                        }`}
                    >
                        POINTS
                    </button>
                </div>

                <button
                    onClick={() => setAutoTalk((v) => !v)}
                    className={`mt-4 w-full rounded border px-3 py-2 tracking-widest transition-colors ${
                        autoTalk
                            ? 'border-status-error bg-status-error/20 text-status-error'
                            : 'border-brand-primary/40 hover:bg-brand-primary/10'
                    }`}
                >
                    {autoTalk ? '◼ STOP SIM_SPEECH' : '▶ SIM_SPEECH (auto jaw)'}
                </button>

                <p className="mt-4 leading-relaxed text-text-muted">
                    Drag to orbit. Slide JAW_OPEN to confirm the lower-face points
                    deform (AC.0.2). SIM_SPEECH animates a talking jaw. Swap in the
                    Ready Player Me GLB next for real ARKit/Viseme morphs.
                </p>
            </div>
        </div>
    );
};
