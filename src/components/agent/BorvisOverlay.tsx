/**
 * BorvisOverlay — immersive full-screen Borvis interface.
 *
 * Layout mirrors the avatar-lab halftone view:
 *   • full-screen Canvas (NeuralHalftoneFace + post-processing)
 *   • right: transcript panel (current Borvis reply, typewriter)
 *   • bottom-center: input bar (text + PTT mic)
 *   • exit: top-edge-hover button + ESC key
 */
import { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { NeuralHalftoneFace } from '../three/avatar/NeuralHalftoneFace';
import { ShimmerLoader } from '../ui/loading/ShimmerLoader';
import { TypewriterTranscript } from './TypewriterTranscript';
import { AppErrorBoundary } from '../error/AppErrorBoundary';
import { useShallow } from 'zustand/react/shallow';
import { useAgentStore } from '../../store/useAgentStore';
import { useAvatarStore, avatarSignal } from '../../store/useAvatarStore';
import { streamChat } from '../../services/agentService';
import { speak, speakEnqueue, cancelSpeech } from '../../services/speechService';
import { startListening } from '../../services/asrService';
import { classifyEmotion } from '../three/avatar/expressions';
import type { Emotion } from '../../store/useAvatarStore';
import { useLanguage } from '../../i18n';
import { useIsMobile, useIsCoarsePointer } from '../../hooks/useDevice';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../store/useProjectStore';
import { GenerativeUI } from '../../agent/generativeUI';
import type { UISpec } from '../../agent/generativeUI/spec';
import type { Project } from '../../data/projects';

/** Mounts only once its Suspense boundary resolves (face GLB + shaders ready). */
const FaceReadyNotifier = ({ onReady }: { onReady: () => void }) => {
    useEffect(() => { onReady(); }, [onReady]);
    return null;
};

export const BorvisOverlay = () => {
    const { language } = useLanguage();
    const isMobile = useIsMobile();
    // Touch has no top-edge hover — the disconnect button must stay visible
    const isCoarsePointer = useIsCoarsePointer();
    const [input, setInput] = useState('');
    const [busy, setBusy] = useState(false);
    const [typeSpeed, setTypeSpeed] = useState(45);
    const [replyId, setReplyId] = useState(0);
    const [recording, setRecording] = useState(false);
    const [micLevel, setMicLevel] = useState(0);
    const [showExit, setShowExit] = useState(false);
    const [faceReady, setFaceReady] = useState(false);
    const handleFaceReady = useCallback(() => setFaceReady(true), []);
    // Generative UI spec attached to the latest reply (null = text-only reply).
    const [spec, setSpec] = useState<UISpec | null>(null);
    const navigate = useNavigate();

    const recRef = useRef<Awaited<ReturnType<typeof startListening>> | null>(null);
    const stopRequestedRef = useRef(false);   // set if the user releases before startListening() resolves
    const busyRef = useRef(false);
    const aliveRef = useRef(true);   // false once unmounted → in-flight respond() must not speak
    const scrollRef = useRef<HTMLDivElement>(null);

    const { exitBorvis, isBorvisTransitioning, borvisTransitionDir } = useAgentStore(useShallow((s) => ({
        exitBorvis: s.exitBorvis,
        isBorvisTransitioning: s.isBorvisTransitioning,
        borvisTransitionDir: s.borvisTransitionDir,
    })));
    const { status, transcript, setStatus, setEmotion, setTranscript } = useAvatarStore(useShallow((s) => ({
        status: s.status,
        transcript: s.transcript,
        setStatus: s.setStatus,
        setEmotion: s.setEmotion,
        setTranscript: s.setTranscript,
    })));

    // During the exit transition, the face glitch-dissolves out (mirrors entrance).
    const exiting = isBorvisTransitioning && borvisTransitionDir === 'exit';
    const glitchLevel = exiting ? 0.75 : 0.06;

    // Auto-scroll transcript to bottom as it types
    const onTranscriptUpdate = useCallback(() => {
        const el = scrollRef.current;
        if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 48) {
            el.scrollTop = el.scrollHeight;
        }
    }, []);

    // Esc → disconnect
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') exitBorvis(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [exitBorvis]);

    // Hard teardown on unmount — stop any TTS playback AND tear down a live mic
    // recording (getUserMedia stream + AudioContext), so exiting never leaks audio.
    useEffect(() => () => {
        aliveRef.current = false;       // stop any in-flight respond() from speaking after exit
        cancelSpeech();
        recRef.current?.cancel();
        recRef.current = null;
        avatarSignal.mic = 0;
        useAvatarStore.getState().setStatus('idle');
    }, []);

    // Kai voice greeting, once, after the face is live (waiting on faceReady
    // keeps the voice from playing behind the loading veil on slow devices).
    const greetedRef = useRef(false);
    useEffect(() => {
        if (!faceReady || greetedRef.current) return;
        greetedRef.current = true;
        const greeting = language === 'zh'
            ? '神经链接已建立。我是 Borvis，有什么想问的？'
            : 'Neural link established. I am Borvis — ask me anything.';
        const t = setTimeout(() => {
            if (!aliveRef.current || busyRef.current) return;   // exited or user already talking
            busyRef.current = true; setBusy(true);
            setStatus('speaking');
            speak(greeting, {
                onStart: (dur) => {
                    setTypeSpeed(Math.max(24, Math.min(140, (dur * 1000) / Math.max(1, greeting.length))));
                    setTranscript(greeting);
                },
            }).finally(() => {
                setStatus('idle'); busyRef.current = false; setBusy(false);
            });
        }, 800);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [faceReady]);

    // Top-edge hover → reveal exit button; also feed the window-level cursor into
    // avatarSignal (NDC) so the head tracks it even over the content panel (which
    // captures the canvas's own pointer events).
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        const handler = (e: MouseEvent) => {
            avatarSignal.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
            avatarSignal.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
            if (e.clientY < 60) {
                setShowExit(true);
                clearTimeout(timer);
                timer = setTimeout(() => setShowExit(false), 3000);
            }
        };
        window.addEventListener('mousemove', handler);
        return () => { window.removeEventListener('mousemove', handler); clearTimeout(timer); };
    }, []);

    // ── Conversation pipeline ─────────────────────────────────────
    const respond = useCallback(async (msg: string) => {
        if (!msg.trim() || busyRef.current) return;
        busyRef.current = true;
        setBusy(true);
        setStatus('thinking');
        setTranscript('');
        setSpec(null);

        cancelSpeech(); // stop any prior queued/in-flight speech (barge-in / re-ask)
        setReplyId((n) => n + 1); // stable transcript identity for this reply

        let reply = '';
        let detected: string | null = null;
        let nextSpec: UISpec | null = null;
        let started = false;
        let spoken = '';
        const plays: Promise<void>[] = [];

        const beginSpeaking = () => {
            if (started) return;
            started = true;
            setEmotion(detected ? (detected as Emotion) : 'neutral');
            setStatus('speaking');
        };

        // Real projects the model may reference (id + light facts, for grounded
        // narration). Hard data (metrics/media/content) is still filled by the
        // renderer from the store/CMS by id, so facts can't be fabricated.
        const genuiProjects = useProjectStore.getState().projects.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            techStack: p.techStack,
            timeline: p.timeline,
            status: p.status,
            liveUrl: p.liveUrl,
            projectType: p.projectType,
        }));

        await new Promise<void>((resolve) => {
            streamChat({
                messages: [{ id: 'u', role: 'user', content: msg, timestamp: Date.now() }],
                genuiProjects,
                onToken: (t) => { reply += t; },
                onEmotion: (e) => { detected = e; },
                // Speak each sentence the moment it's ready — Borvis talks WHILE the
                // rest streams and the UI assembles. Transcript reveals in lock-step
                // with each sentence's audio (onStart fires when it begins playing).
                onSentence: (s) => {
                    if (!aliveRef.current) return;
                    beginSpeaking();
                    plays.push(speakEnqueue(s, {
                        onStart: (dur) => {
                            spoken += s;
                            setTranscript(spoken);
                            setTypeSpeed(Math.max(24, Math.min(140, (dur * 1000) / Math.max(1, s.length))));
                        },
                    }));
                },
                onSpec: (s) => { nextSpec = s; setSpec(s); },
                onDone: () => resolve(),
                onError: () => resolve(),
            });
        });

        // Exited (e.g. ESC) while streaming? Stop speech and bail.
        if (!aliveRef.current) { cancelSpeech(); busyRef.current = false; return; }

        setSpec(nextSpec);

        if (!started) {
            // Nothing was spoken (empty reply or mock path) → one-shot fallback.
            reply = reply.trim() || '……';
            setEmotion(detected ? (detected as Emotion) : classifyEmotion(reply));
            setStatus('speaking');
            await speak(reply, {
                onStart: (dur) => {
                    setTypeSpeed(Math.max(24, Math.min(140, (dur * 1000) / Math.max(1, reply.length))));
                    setTranscript(reply);
                },
            });
        } else {
            await Promise.all(plays); // let the queued sentences finish playing
        }

        if (!aliveRef.current) { busyRef.current = false; return; }
        setStatus('idle');
        setEmotion('neutral');
        busyRef.current = false;
        setBusy(false);
    }, [setStatus, setTranscript, setEmotion]);

    const handleSend = useCallback(() => {
        const msg = input.trim();
        if (!msg) return;
        setInput('');
        void respond(msg);
    }, [input, respond]);

    // Opening a rendered card leaves the immersive overlay for the project page.
    const onOpenProject = useCallback((p: Project) => {
        exitBorvis();
        navigate(`/projects/${p.id}`);
    }, [exitBorvis, navigate]);

    // ── Push-to-talk ───────────────────────────────────────────────
    const stopPTT = useCallback(async () => {
        const rec = recRef.current;
        if (!rec) {
            // start may still be in-flight (getUserMedia permission prompt pending) —
            // flag it so startPTT tears the mic down the instant it resolves instead
            // of leaving an orphaned, un-stoppable recording with the mic live.
            stopRequestedRef.current = true;
            return;
        }
        recRef.current = null;
        setRecording(false);
        avatarSignal.mic = 0;
        setMicLevel(0);
        const text = await rec.stop();
        if (text) void respond(text);
        else useAvatarStore.getState().setStatus('idle');
    }, [respond]);

    const startPTT = useCallback(async () => {
        if (recRef.current) return;
        stopRequestedRef.current = false;
        cancelSpeech();
        useAvatarStore.getState().setStatus('listening');
        setRecording(true);
        try {
            const rec = await startListening({
                onLevel: (lvl) => { avatarSignal.mic = lvl; setMicLevel(lvl); },
                onSilence: () => { void stopPTT(); },
                silenceMs: 3000,
            });
            // If the user already released (or the overlay exited) while the mic was
            // coming up, don't keep a live recording — discard it cleanly.
            if (stopRequestedRef.current || !aliveRef.current) {
                stopRequestedRef.current = false;
                rec.cancel();
                setRecording(false);
                avatarSignal.mic = 0;
                setMicLevel(0);
                useAvatarStore.getState().setStatus('idle');
                return;
            }
            recRef.current = rec;
        } catch {
            setRecording(false);
            useAvatarStore.getState().setStatus('idle');
        }
    }, [stopPTT]);

    // Space = hold-to-talk (when not in a text field)
    useEffect(() => {
        const isTyping = () =>
            document.activeElement?.tagName === 'INPUT' ||
            document.activeElement?.tagName === 'TEXTAREA';
        const down = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !e.repeat && !isTyping()) { e.preventDefault(); void startPTT(); }
        };
        const up = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !isTyping()) { e.preventDefault(); void stopPTT(); }
        };
        window.addEventListener('keydown', down);
        window.addEventListener('keyup', up);
        return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
    }, [startPTT, stopPTT]);

    const thinkingLabel = language === 'zh'
        ? (status === 'listening' ? 'Borvis 在听' : 'Borvis 正在思考')
        : (status === 'listening' ? 'Borvis is listening' : 'Borvis is thinking');

    const inputPlaceholder = recording
        ? (language === 'zh' ? '[ 在听… 松手发送 ]' : '[ listening… release to send ]')
        : busy
            ? `[ ${status}... ]`
            : (language === 'zh' ? '打字，或按住麦克风 / 空格说话…' : 'Type, or hold mic / Space to speak…');

    // When the model attaches a UI (intent = "show the work"), desktop steps the
    // face aside (canvas shrinks to a left pane) and opens a right content stage;
    // mobile keeps the stacked layout.
    const stageOpen = !!spec && !isMobile;
    const stageWidth = Math.min(600, Math.round((typeof window !== 'undefined' ? window.innerWidth : 1280) * 0.4));

    return (
        <motion.div
            className="fixed inset-0 z-[250] bg-[#020406]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
        >
            {/* ── Three.js Canvas — full screen & FIXED size. When a content stage
                 opens, the FACE glides left in 3D (cheap, no canvas resize) so the
                 glow keeps filling the whole viewport and the right content floats
                 over it — one unified backdrop, not a hard split. Mobile unchanged. */}
            <AppErrorBoundary fallback={null}>
                <Canvas
                    camera={{ position: [0, 0.4, 5.5], fov: 42 }}
                    gl={{ alpha: false, antialias: !isMobile }}
                    dpr={isMobile ? [1, 1.25] : [1, 1.5]}
                    style={{ position: 'absolute', inset: 0 }}
                >
                    <Suspense fallback={null}>
                        <NeuralHalftoneFace
                            intensity={1.0}
                            grid={isMobile ? 120 : 150}
                            headScale={isMobile ? 0.52 : stageOpen ? 0.6 : 0.7}
                            offsetY={isMobile ? 0.55 : 0}
                            offsetX={stageOpen ? -1.7 : 0}
                            scanAngle={133}
                            scanIntensity={0.15}
                            glitch={glitchLevel}
                            intro={true}
                        />
                        <FaceReadyNotifier onReady={handleFaceReady} />
                    </Suspense>
                    {isMobile ? (
                        <EffectComposer>
                            <Bloom
                                intensity={1.6}
                                luminanceThreshold={0.0}
                                luminanceSmoothing={0.9}
                                mipmapBlur
                                radius={0.85}
                            />
                            <Vignette offset={0.25} darkness={0.85} />
                        </EffectComposer>
                    ) : (
                        <EffectComposer>
                            <Bloom
                                intensity={1.6}
                                luminanceThreshold={0.0}
                                luminanceSmoothing={0.9}
                                mipmapBlur
                                radius={0.85}
                            />
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            <ChromaticAberration offset={[0.0009, 0.0012] as any} radialModulation={false} modulationOffset={0} />
                            <Noise opacity={0.035} />
                            <Vignette offset={0.25} darkness={0.85} />
                        </EffectComposer>
                    )}
                </Canvas>
            </AppErrorBoundary>

            {/* ── Loading veil — covers the link until the face is live ── */}
            <AnimatePresence>
                {!faceReady && (
                    <motion.div
                        className="absolute inset-0 z-20 bg-[#020406] pointer-events-none"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <ShimmerLoader
                            show={true}
                            variant="overlay"
                            label="[ ESTABLISHING_NEURAL_LINK... ]"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Transcript panel — mobile: above the input bar, full width, on a
                 dark blur panel; lg+: a bounded right column (top-6 → above the input
                 bar) that splits into transcript (top) + render (bottom), each
                 scrolling internally so nothing spills past the viewport or the input. */}
            <div
                className={clsx(
                    'absolute left-4 right-4 bottom-24 max-lg:rounded-md max-lg:border max-lg:border-brand-primary/15 max-lg:bg-black/50 max-lg:p-3 max-lg:backdrop-blur-sm',
                    'lg:left-auto lg:right-10 lg:top-6 lg:bottom-28 lg:flex lg:flex-col lg:gap-4 lg:transition-[width] lg:duration-500 lg:ease-out',
                    !stageOpen && 'lg:justify-center',
                )}
                style={isMobile ? undefined : { width: stageOpen ? stageWidth : 340 }}
            >
                <div className={clsx('flex flex-col', stageOpen && 'lg:min-h-0 lg:flex-1')}>
                    <div className="mb-2 shrink-0 text-[10px] tracking-[0.3em] text-brand-primary/40">
                        TRANSCRIPT ·{' '}
                        <span className="text-brand-primary/70">{status.toUpperCase()}</span>
                    </div>
                    <div
                        ref={scrollRef}
                        className={clsx(
                            'pointer-events-auto overflow-y-auto pr-2 [scrollbar-width:thin] [scrollbar-color:var(--color-brand-primary,#22d3ee)_transparent]',
                            stageOpen ? 'max-h-[28dvh] lg:max-h-none lg:min-h-0 lg:flex-1' : 'max-h-[28dvh] lg:max-h-[50vh]',
                        )}
                    >
                    {busy && !transcript ? (
                        <div className="flex items-center gap-2 font-mono text-sm text-brand-primary/80">
                            {thinkingLabel}
                            <span className="inline-flex gap-1">
                                <span className="animate-pulse">●</span>
                                <span className="animate-pulse [animation-delay:160ms]">●</span>
                                <span className="animate-pulse [animation-delay:320ms]">●</span>
                            </span>
                        </div>
                    ) : (
                        <TypewriterTranscript
                            key={replyId}
                            text={transcript || undefined}
                            speed={typeSpeed}
                            onUpdate={onTranscriptUpdate}
                            className="text-sm leading-relaxed"
                        />
                    )}
                    </div>
                </div>

                {/* Generative UI — the composed node tree. On desktop it's the bottom
                    half of the bounded column and scrolls within its own bounds. */}
                {spec && (
                    <div className={clsx(
                        'mt-3 border-t border-brand-primary/15 pt-3',
                        stageOpen && 'lg:mt-0 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col',
                    )}>
                        <div className="mb-2 shrink-0 text-[10px] tracking-[0.3em] text-brand-primary/40">RENDER</div>
                        <div className={clsx(
                            'pointer-events-auto overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:var(--color-brand-primary,#22d3ee)_transparent]',
                            stageOpen ? 'max-h-[40dvh] lg:max-h-none lg:min-h-0 lg:flex-1' : 'max-h-[34dvh] lg:max-h-[40dvh]',
                        )}>
                            <GenerativeUI spec={spec} onOpenProject={onOpenProject} />
                        </div>
                    </div>
                )}
            </div>

            {/* ── Input bar (bottom center) ── */}
            <div className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-1/2 flex w-[min(600px,92vw)] lg:w-[min(600px,82vw)] -translate-x-1/2 items-center gap-2">
                {/* Hold-to-talk mic */}
                <button
                    onPointerDown={(e) => { e.preventDefault(); void startPTT(); }}
                    onPointerUp={(e) => { e.preventDefault(); void stopPTT(); }}
                    onPointerLeave={() => { if (recording) void stopPTT(); }}
                    title={language === 'zh' ? '按住说话 / hold to talk' : 'Hold to talk (or hold Space)'}
                    className={`relative flex h-11 w-11 flex-none items-center justify-center rounded-full border font-mono transition-colors ${
                        recording
                            ? 'border-status-error bg-status-error/20 text-status-error'
                            : 'border-brand-primary/50 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20'
                    }`}
                >
                    {recording && (
                        <span
                            className="absolute inset-0 rounded-full border border-status-error/60"
                            style={{ transform: `scale(${1 + micLevel * 0.6})`, opacity: 0.4 + micLevel * 0.6 }}
                        />
                    )}
                    <i className="ri-mic-line text-lg" />
                </button>

                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                    disabled={busy || recording}
                    placeholder={inputPlaceholder}
                    className="flex-1 min-w-0 rounded border border-brand-primary/40 bg-black/60 px-4 py-2.5 font-mono text-base lg:text-sm text-brand-primary placeholder:text-text-muted/60 outline-none backdrop-blur focus:border-brand-primary disabled:opacity-50"
                />

                <button
                    onClick={handleSend}
                    disabled={busy || recording}
                    className="rounded border border-brand-primary/50 bg-brand-primary/10 px-5 py-2.5 font-mono text-sm tracking-widest text-brand-primary transition-colors hover:bg-brand-primary/20 disabled:opacity-40"
                >
                    {busy ? '···' : 'SEND'}
                </button>
            </div>

            {/* ── Exit controls ── */}

            {/* Edge-reveal disconnect button (always visible on touch) —
                top-RIGHT to match every other page's close control */}
            <AnimatePresence>
                {(showExit || isCoarsePointer) && (
                    <motion.button
                        className="fixed top-4 right-5 z-[260] flex items-center gap-2 px-3 py-1.5 border border-brand-primary/20 rounded-sm text-text-muted/50 hover:text-red-400 hover:border-red-400/30 transition-colors bg-black/60 backdrop-blur-sm font-mono text-[9px] tracking-[0.2em] uppercase"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        onClick={exitBorvis}
                    >
                        <i className="ri-logout-circle-r-line text-xs" />
                        Disconnect
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Persistent dim hint (keyboard-only affordance) */}
            {!isCoarsePointer && (
                <div className="fixed bottom-5 left-5 z-[260] text-[8px] font-mono tracking-[0.3em] text-brand-primary/20 pointer-events-none select-none">
                    ESC · DISCONNECT
                </div>
            )}
        </motion.div>
    );
};
