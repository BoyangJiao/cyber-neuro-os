/**
 * AvatarLabPage — DEV-ONLY proving ground for the Neural Entity avatar.
 *
 * Isolated full-screen page (own Canvas + OrbitControls + post-processing) so the
 * point-cloud head can be tuned without the production dashboard. Route is only
 * registered in dev (App.tsx). Not shipped.
 */
import { useState, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { NeuralEntity } from '../components/three/avatar/NeuralEntity';
import { NeuralScanFace } from '../components/three/avatar/NeuralScanFace';
import { NeuralHalftoneFace } from '../components/three/avatar/NeuralHalftoneFace';
import { TypewriterTranscript } from '../components/agent/TypewriterTranscript';
import { streamChat } from '../services/agentService';
import { speak } from '../services/speechService';
import { useAvatarStore } from '../store/useAvatarStore';
import { classifyEmotion } from '../components/three/avatar/expressions';
import type { Emotion } from '../store/useAvatarStore';

type Mode = 'halftone' | 'scan' | 'entity';

export const AvatarLabPage = () => {
    const [jawOpen, setJawOpen] = useState(0);
    const [autoTalk, setAutoTalk] = useState(false);
    const [intensity, setIntensity] = useState(0.8);
    const [pointScale, setPointScale] = useState(1.0);
    const [bloom, setBloom] = useState(1.6);
    const [mode, setMode] = useState<Mode>('halftone');
    const [grid, setGrid] = useState(150);
    const [headScale, setHeadScale] = useState(0.8);
    const [scanAngle, setScanAngle] = useState(133);
    const [scanIntensity, setScanIntensity] = useState(0.18);
    const [glitch, setGlitch] = useState(0.06);

    // Conversation loop (Phase 2): type → LLM reply (agentService) → TTS speaks it
    // (speechService: DashScope audio → amplitude lip-sync, browser-TTS fallback).
    const [input, setInput] = useState('');
    const [busy, setBusy] = useState(false);
    const [typeSpeed, setTypeSpeed] = useState(45);
    const status = useAvatarStore((s) => s.status);
    const transcript = useAvatarStore((s) => s.transcript);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll the transcript to the bottom as it types — but only if the user
    // is already near the bottom, so they can scroll up to read earlier lines.
    const onTranscriptUpdate = useCallback(() => {
        const el = scrollRef.current;
        if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 48) {
            el.scrollTop = el.scrollHeight;
        }
    }, []);

    const handleSpeak = async () => {
        const msg = input.trim();
        if (!msg || busy) return;
        const { setStatus, setTranscript, setEmotion } = useAvatarStore.getState();
        setInput('');                 // clear the box on send
        setBusy(true);
        setStatus('thinking');
        setTranscript('');
        let reply = '';
        let detected: string | null = null;
        await new Promise<void>((resolve) => {
            streamChat({
                messages: [{ id: 'u', role: 'user', content: msg, timestamp: Date.now() }],
                onToken: (t) => { reply += t; },
                onEmotion: (e) => { detected = e; },
                onDone: () => resolve(),
                onError: () => resolve(),
            });
        });
        reply = reply.trim() || '……';
        // Emotion from the model's own [[emo:X]] tag; heuristic only as fallback.
        setEmotion(detected ? (detected as Emotion) : classifyEmotion(reply));
        setStatus('speaking');
        // Reveal the transcript only when audio actually starts, paced to its
        // duration → voice and text appear together (no racing ahead).
        await speak(reply, {
            onStart: (dur) => {
                setTypeSpeed(Math.max(24, Math.min(140, (dur * 1000) / Math.max(1, reply.length))));
                setTranscript(reply);
            },
        });
        setStatus('idle');
        setEmotion('neutral');
        setBusy(false);
    };

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
                {mode === 'halftone' && (
                    <NeuralHalftoneFace
                        modelUrl={modelUrl}
                        jawOpen={jawOpen}
                        autoTalk={autoTalk}
                        intensity={intensity}
                        grid={grid}
                        headScale={headScale}
                        scanAngle={scanAngle}
                        scanIntensity={scanIntensity}
                        glitch={glitch}
                    />
                )}
                {mode === 'scan' && (
                    <NeuralScanFace
                        modelUrl={modelUrl}
                        jawOpen={jawOpen}
                        autoTalk={autoTalk}
                        intensity={intensity}
                        pointScale={pointScale}
                    />
                )}
                {mode === 'entity' && (
                    <NeuralEntity
                        jawOpen={jawOpen}
                        autoTalk={autoTalk}
                        intensity={intensity}
                        pointScale={pointScale}
                        modelUrl={modelUrl}
                        showWire={false}
                        showPoints={true}
                    />
                )}
                {/* Orbit only matters for the 3D modes (halftone is screen-space). */}
                {mode !== 'halftone' && (
                    <OrbitControls enablePan={false} minDistance={3} maxDistance={14} target={[0, 0.2, 0]} />
                )}

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

                {/* Mode selector */}
                <div className="mb-1 mt-1 flex gap-1">
                    {(['halftone', 'scan', 'entity'] as Mode[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`flex-1 rounded border px-1.5 py-1 text-[10px] tracking-widest uppercase transition-colors ${mode === m ? 'border-brand-primary bg-brand-primary/20' : 'border-brand-primary/30 opacity-50'}`}
                        >{m === 'halftone' ? 'HALFTONE' : m === 'scan' ? 'SCAN3D' : 'PTS'}</button>
                    ))}
                </div>

                {sliderRow('JAW_OPEN', jawOpen, 0, 1, 0.01, setJawOpen, autoTalk)}
                {sliderRow('BLOOM', bloom, 0, 4, 0.05, setBloom)}
                {sliderRow('INTENSITY', intensity, 0.2, 2.5, 0.05, setIntensity)}
                {mode === 'halftone'
                    ? sliderRow('GRID (dots)', grid, 60, 320, 2, setGrid)
                    : sliderRow('POINT_SIZE', pointScale, 0.4, 2.0, 0.05, setPointScale)}
                {mode === 'halftone' && sliderRow('HEAD_SIZE', headScale, 0.4, 1.2, 0.02, setHeadScale)}
                {mode === 'halftone' && sliderRow('SCAN_ANGLE', scanAngle, 0, 180, 1, setScanAngle)}
                {mode === 'halftone' && sliderRow('SCANLINE', scanIntensity, 0, 0.8, 0.02, setScanIntensity)}
                {mode === 'halftone' && sliderRow('GLITCH', glitch, 0, 1, 0.02, setGlitch)}

                <button
                    onClick={() => setAutoTalk((v) => !v)}
                    className={`mt-3 w-full rounded border px-3 py-2 tracking-widest transition-colors ${autoTalk ? 'border-status-error bg-status-error/20 text-status-error' : 'border-brand-primary/40 hover:bg-brand-primary/10'}`}
                >{autoTalk ? '◼ STOP SIM_SPEECH' : '▶ SIM_SPEECH (auto jaw)'}</button>

                <p className="mt-4 leading-relaxed text-text-muted">
                    HALFTONE = Lusion screen-space dots. Move the cursor — the head
                    turns to watch you. HEAD_SIZE/GRID/BLOOM tune the look.
                </p>
            </div>

            {/* Transcript — live agent reply (typewriter); idle shows ambient lines.
                Capped at 50vh; scrolls, user can wheel up to read earlier text. */}
            {mode === 'halftone' && (
                <div className="absolute right-10 top-1/2 w-[340px] -translate-y-1/2">
                    <div className="mb-2 text-[10px] tracking-[0.3em] text-brand-primary/40">
                        TRANSCRIPT · <span className="text-brand-primary/70">{status.toUpperCase()}</span>
                    </div>
                    <div ref={scrollRef} className="pointer-events-auto max-h-[50vh] overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:var(--color-brand-primary,#22d3ee)_transparent]">
                        {status === 'thinking' ? (
                            <div className="flex items-center gap-2 font-mono text-sm text-brand-primary/80">
                                Borvis 正在思考
                                <span className="inline-flex gap-1">
                                    <span className="animate-pulse">●</span>
                                    <span className="animate-pulse [animation-delay:160ms]">●</span>
                                    <span className="animate-pulse [animation-delay:320ms]">●</span>
                                </span>
                            </div>
                        ) : (
                            <TypewriterTranscript
                                key={transcript || 'idle'}
                                text={transcript || undefined}
                                speed={typeSpeed}
                                onUpdate={onTranscriptUpdate}
                                className="text-sm leading-relaxed"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Conversation input — type to the agent; it thinks, then speaks */}
            {mode === 'halftone' && (
                <div className="absolute bottom-8 left-1/2 flex w-[min(560px,80vw)] -translate-x-1/2 items-center gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSpeak(); }}
                        disabled={busy}
                        placeholder={busy ? `[ ${status}... ]` : '和 Borvis 对话 / talk to Borvis…'}
                        className="flex-1 rounded border border-brand-primary/40 bg-black/60 px-4 py-2.5 font-mono text-sm text-brand-primary placeholder:text-text-muted/60 outline-none backdrop-blur focus:border-brand-primary disabled:opacity-50"
                    />
                    <button
                        onClick={handleSpeak}
                        disabled={busy}
                        className="rounded border border-brand-primary/50 bg-brand-primary/10 px-5 py-2.5 font-mono text-sm tracking-widest text-brand-primary transition-colors hover:bg-brand-primary/20 disabled:opacity-40"
                    >
                        {busy ? '···' : 'SPEAK'}
                    </button>
                </div>
            )}
        </div>
    );
};
