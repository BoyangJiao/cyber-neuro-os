/**
 * AvatarLabPage — DEV-ONLY proving ground for the Neural Entity avatar.
 *
 * Isolated full-screen page (own Canvas + OrbitControls + post-processing) so the
 * point-cloud head can be tuned without the production dashboard. Route is only
 * registered in dev (App.tsx). Not shipped.
 */
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { NeuralEntity } from '../components/three/avatar/NeuralEntity';

export const AvatarLabPage = () => {
    const [jawOpen, setJawOpen] = useState(0);
    const [autoTalk, setAutoTalk] = useState(false);
    const [intensity, setIntensity] = useState(0.8);
    const [pointScale, setPointScale] = useState(1.0);
    const [bloom, setBloom] = useState(1.6);
    const [showWire, setShowWire] = useState(false);
    const [showPoints, setShowPoints] = useState(true);

    // Load any GLB in /public/models via ?model=<file>. Defaults to the facecap
    // head (real ARKit blendshapes). e.g. /avatar-lab?model=neural-avatar.glb
    const modelParam = new URLSearchParams(window.location.search).get('model');
    const modelUrl = `/models/${modelParam || 'facecap-clean.glb'}`;

    const sliderRow = (label: string, value: number, min: number, max: number, step: number, set: (n: number) => void, disabled = false) => (
        <>
            <label className="mb-1 mt-3 block tracking-widest text-text-secondary">
                {label}: {value.toFixed(2)}
            </label>
            <input
                type="range" min={min} max={max} step={step} value={value} disabled={disabled}
                onChange={(e) => set(parseFloat(e.target.value))}
                className="w-full accent-brand-primary disabled:opacity-40"
            />
        </>
    );

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

                {/* The dreamy "digital veil": bloom halo + subtle chroma split + grain + vignette */}
                <EffectComposer>
                    <Bloom intensity={bloom} luminanceThreshold={0.0} luminanceSmoothing={0.9} mipmapBlur radius={0.85} />
                    <ChromaticAberration offset={[0.0009, 0.0012]} radialModulation={false} modulationOffset={0} />
                    <Noise opacity={0.035} />
                    <Vignette offset={0.25} darkness={0.85} />
                </EffectComposer>
            </Canvas>

            {/* HUD */}
            <div className="absolute top-4 left-4 w-[280px] rounded border border-brand-primary/30 bg-black/70 p-4 font-mono text-xs text-brand-primary backdrop-blur">
                <div className="mb-2 tracking-[0.2em] text-brand-primary/70">[ NEURAL_ENTITY · PHASE_0 LAB ]</div>

                {sliderRow('JAW_OPEN', jawOpen, 0, 1, 0.01, setJawOpen, autoTalk)}
                {sliderRow('BLOOM', bloom, 0, 4, 0.05, setBloom)}
                {sliderRow('INTENSITY', intensity, 0.2, 2.5, 0.05, setIntensity)}
                {sliderRow('POINT_SIZE', pointScale, 0.4, 2.0, 0.05, setPointScale)}

                <div className="mt-4 flex gap-2">
                    <button
                        onClick={() => setShowWire((v) => !v)}
                        className={`flex-1 rounded border px-2 py-1.5 tracking-widest transition-colors ${showWire ? 'border-brand-primary bg-brand-primary/15' : 'border-brand-primary/30 opacity-50'}`}
                    >WIRE</button>
                    <button
                        onClick={() => setShowPoints((v) => !v)}
                        className={`flex-1 rounded border px-2 py-1.5 tracking-widest transition-colors ${showPoints ? 'border-brand-primary bg-brand-primary/15' : 'border-brand-primary/30 opacity-50'}`}
                    >POINTS</button>
                </div>

                <button
                    onClick={() => setAutoTalk((v) => !v)}
                    className={`mt-3 w-full rounded border px-3 py-2 tracking-widest transition-colors ${autoTalk ? 'border-status-error bg-status-error/20 text-status-error' : 'border-brand-primary/40 hover:bg-brand-primary/10'}`}
                >{autoTalk ? '◼ STOP SIM_SPEECH' : '▶ SIM_SPEECH (auto jaw)'}</button>

                <p className="mt-4 leading-relaxed text-text-muted">
                    Drag to orbit. BLOOM drives the hazy "digital veil" glow. Toggle
                    WIRE/POINTS to compare. Swap models via ?model=&lt;file&gt;.glb.
                </p>
            </div>
        </div>
    );
};
