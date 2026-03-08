import { useState, useEffect, useRef, useMemo, useCallback, Suspense, memo } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { MotionDiv, MotionH1 } from '../motion/MotionWrappers';
import { CyberButton } from '../ui/CyberButton';
import { useMusicStore } from '../../store/useMusicStore';
import { useShallow } from 'zustand/react/shallow';
import { AnimatePresence } from 'framer-motion';
import { HelmetReveal } from '../three/HelmetReveal';
import { DatastreamEdgeLeft } from './DatastreamEdgeLeft';
import { DatastreamEdgeRight } from './DatastreamEdgeRight';
import { BadgeProtocol } from './BadgeProtocol';
import { BinaryGrid } from './BinaryGrid';
import { useSoundSystem } from '../../hooks/useSoundSystem';

// ─── Module-level constants (never re-created) ──────────────────────────────
const BOOT_LOGS = [
    "INITIALIZING NEURO-LINK PROTOCOL...",
    "SCANNING NEURAL PATHWAYS...",
    "SYNCING SYNAPTIC NODES...",
    "CALIBRATING CORTEX INTERFACE...",
    "ESTABLISHING NEURAL HANDSHAKE...",
    "MAPPING CONSCIOUSNESS GRID...",
    "LOADING HOLOGRAPHIC OVERLAY...",
    "NEURAL SYNC COMPLETE."
] as const;

const BINARY_CHARS = "1234567890ABCDEF";

type BinaryDataItem = { prefix: string; id: string; val: string; node: string };

const BINARY_INITIAL_DATA: BinaryDataItem[] = [
    { prefix: "0x", id: "4655.4", val: "0.1458", node: "2" },
    { prefix: "3x", id: "25604", val: "0.44  ", node: "4" },
    { prefix: "0x", id: "93743", val: "0.4452", node: "1" }
];

// ─── Custom hook: rolling binary/hex data (optimized interval 150ms) ─────────
const useBinaryDecoding = (progress: number, isReady: boolean) => {
    const [data, setData] = useState([...BINARY_INITIAL_DATA]);
    const progressRef = useRef(progress);
    useEffect(() => { progressRef.current = progress; }, [progress]);

    useEffect(() => {
        if (isReady) return;
        const interval = setInterval(() => {
            setData(prev => prev.map(item => ({
                ...item,
                id: Array.from({ length: item.id.length }, () => BINARY_CHARS[Math.floor(Math.random() * BINARY_CHARS.length)]).join(""),
                val: (Math.random() * (progressRef.current / 100 + 0.1)).toFixed(4),
                node: Math.floor(Math.random() * 9).toString()
            })));
        }, 150); // Reduced from 80ms → 150ms (visual difference negligible, ~40% fewer renders)
        return () => clearInterval(interval);
    }, [isReady]);

    return data;
};

// ─── Memoized corner decoration component ────────────────────────────────────
const BootCorner = memo(({ isReady, position, ghostOffset = "" }: { isReady: boolean; position: string; ghostOffset?: string }) => {
    return (
        <div className={`absolute z-20 w-4 h-4 flex items-center justify-center transition-all duration-700 ${position}`}>
            <AnimatePresence mode="wait">
                {!isReady ? (
                    <MotionDiv
                        key="dot"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="w-2 h-2 bg-white"
                    />
                ) : (
                    <MotionDiv
                        key="target"
                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        {/* Main crosshair */}
                        <div className="absolute z-10 w-4 h-4 flex items-center justify-center">
                            <div className="absolute w-[1.5px] h-full bg-white/90" />
                            <div className="absolute h-[1.5px] w-full bg-white/90" />
                        </div>
                        {/* Ghost / Afterimage layer - Adjustable via ghostOffset prop */}
                        <div className={`absolute z-0 w-4 h-4 flex items-center justify-center opacity-40 blur-[1px] pointer-events-none ${ghostOffset}`}>
                            <div className="absolute w-[1.5px] h-full bg-white" />
                            <div className="absolute h-[1.5px] w-full bg-white" />
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </div>
    );
});

export const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);
    const binaryData = useBinaryDecoding(progress, progress === 100);
    const [logIndex, setLogIndex] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const { setLanguage } = useLanguage();

    // Memoize date string — never changes during boot lifecycle
    const today = useMemo(() => new Date().toISOString().split('T')[0], []);

    // Pre-compute visible terminal logs to avoid repeated slice calls in JSX
    const visibleLogs = useMemo(() => {
        const allVisible = BOOT_LOGS.slice(0, logIndex + 1);
        return allVisible.slice(-5);
    }, [logIndex]);

    // Boot progress timer
    useEffect(() => {
        const totalDuration = 5000;
        const interval = 50;
        const totalSteps = totalDuration / interval;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            const newProgress = Math.min((step / totalSteps) * 100, 100);
            setProgress(newProgress);

            const totalLogs = BOOT_LOGS.length;
            const currentLogIndex = Math.min(
                Math.floor((newProgress / 100) * totalLogs),
                totalLogs - 1
            );
            setLogIndex(currentLogIndex);

            if (step >= totalSteps) {
                clearInterval(timer);
                setIsReady(true);
            }
        }, interval);

        return () => clearInterval(timer);
    }, []);

    const { playClick } = useSoundSystem();

    // Volume fade-in using requestAnimationFrame for smoother, fewer state updates
    const { setVolume, play, pause } = useMusicStore(useShallow(state => ({
        setVolume: state.setVolume,
        play: state.play,
        pause: state.pause
    })));

    const handleEnter = useCallback(() => {
        // Trigger click sound to ensure audio context starts
        playClick();

        if (soundEnabled) {
            setVolume(0);
            play();
            const targetVol = 50; // Set to 50% as requested
            const duration = 6000; // Slightly longer fade for smoother entry
            let startTime: number | null = null;

            const fadeStep = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const currentVol = Math.min((elapsed / duration) * targetVol, targetVol);
                setVolume(currentVol);
                if (elapsed < duration) {
                    requestAnimationFrame(fadeStep);
                }
            };
            requestAnimationFrame(fadeStep);
        } else {
            setVolume(0);
            pause();
        }
        onComplete();
    }, [soundEnabled, setVolume, play, pause, onComplete, playClick]);

    // Scanline opacity: fade out near bottom edge to prevent overflow
    const scanlineOpacity = progress > 0 ? (progress > 95 ? Math.max(0, (100 - progress) / 5) : 1) : 0;

    return (
        <MotionDiv
            className="fixed inset-0 z-[100] bg-black text-brand-primary font-mono overflow-hidden"
            exit={{
                opacity: 0,
                scale: 1.05,
                filter: "blur(20px) brightness(2)",
                transition: { duration: 0.8, ease: "circIn" }
            }}
        >
            {/* Scanline overlay */}
            <div className="absolute inset-0 z-50 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_2px]" />
            </div>

            {/* Main Layout: Full screen 3D with overlay HUD */}
            <div className="relative w-full h-full">

                {/* 3D Helmet Scene - Full Screen Background */}
                <div className="absolute inset-0 z-0">
                    <Suspense fallback={
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 border-2 border-brand-primary/30 rounded-full animate-spin" />
                        </div>
                    }>
                        <HelmetReveal progress={progress} />
                    </Suspense>
                </div>

                {/* Scan line overlay - sweeps down with progress, fades near bottom */}
                {progress < 100 && (
                    <div
                        className="absolute left-[20px] lg:left-[40px] xl:left-[40px] right-[20px] lg:right-[40px] xl:right-[40px] z-[5] pointer-events-none transition-opacity duration-300"
                        style={{
                            top: `${Math.min(progress, 98)}%`,
                            opacity: scanlineOpacity,
                            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.8) 30%, black 50%, rgba(0,0,0,0.8) 70%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.8) 30%, black 50%, rgba(0,0,0,0.8) 70%, transparent 100%)'
                        }}
                    >
                        {/* Main bright line */}
                        <div className="w-full h-px bg-[var(--color-brand-primary)] shadow-[0_0_8px_var(--color-brand-glow),0_0_20px_var(--color-brand-glow)]" />
                        {/* Soft glow spread below */}
                        <div className="w-full h-6 bg-gradient-to-b from-[var(--color-brand-primary)]/15 to-transparent" />
                        {/* Soft glow spread above */}
                        <div className="absolute bottom-full w-full h-4 bg-gradient-to-t from-[var(--color-brand-primary)]/10 to-transparent" />
                    </div>
                )}

                {/* HUD Overlay - Positioned over 3D scene */}
                <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">

                    {/* Edge Rulers */}
                    <div className="absolute left-0 top-0 bottom-0 px-2 py-0 opacity-80 mix-blend-screen pointer-events-none overflow-hidden flex items-center">
                        <DatastreamEdgeLeft isBooting={!isReady} className="h-[100vh] w-auto pointer-events-none object-left object-contain" />
                    </div>
                    <div className="absolute right-0 top-0 bottom-0 px-2 py-0 opacity-80 mix-blend-screen pointer-events-none overflow-hidden flex items-center">
                        <DatastreamEdgeRight isBooting={!isReady} className="h-[100vh] w-auto pointer-events-none object-right object-contain" />
                    </div>

                    {/* Top HUD Bar */}
                    <div className="absolute top-0 left-0 w-full flex justify-between items-start pt-8 px-10 lg:px-14 xl:px-16 pointer-events-auto">
                        {/* Left: Title & Badge */}
                        <div className="flex flex-col">
                            <div>
                                <MotionH1
                                    className="text-2xl lg:text-4xl font-display font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-brand-primary drop-shadow-[0_0_30px_var(--color-brand-glow)]"
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    NEURO.OS
                                </MotionH1>
                                <p className="text-xs text-brand-secondary tracking-[0.5em] mt-2 opacity-60">
                                    BOYANG JIAO v1.0.0 // NEURAL TERMINAL
                                </p>
                            </div>

                            {/* Protocol Badge */}
                            <MotionDiv
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="flex items-start gap-[12px] mt-10 opacity-90"
                            >
                                {/* Left Column: Badge Graphic + Protocol ID */}
                                <div className="flex flex-col items-start">
                                    <BadgeProtocol className="h-[24px] w-auto mb-[6px]" />
                                    <div className="flex flex-col text-[10px] font-mono font-bold leading-[1.2] tracking-tighter text-brand-primary">
                                        <span>PROTOCOL</span>
                                        <span>1013-AD93</span>
                                    </div>
                                </div>

                                {/* Right Column: Authorization Text */}
                                <div className="flex flex-col text-[10px] font-mono leading-[1.2] tracking-[0.15em] text-brand-primary opacity-60 uppercase">
                                    <p>ONLY IXD CERTIFIED AND BIO-</p>
                                    <p>METRIC AUTHORIZED AGENTS</p>
                                    <p>ARE ALLOWED TO ACCESS OR</p>
                                    <p>ENGAGE THIS SYSTEM</p>
                                </div>
                            </MotionDiv>
                        </div>

                        {/* Right: Status Indicator */}
                        <div className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                                {isReady ? (
                                    <>
                                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_#0f0]" />
                                        <span className="text-sm text-green-400 tracking-widest font-bold">SYNCED</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-3 h-3 bg-amber-500 rounded-full animate-ping" />
                                        <span className="text-sm text-amber-400 tracking-widest animate-pulse">SYNCING...</span>
                                    </>
                                )}
                            </div>
                            <p className="text-[10px] text-brand-primary/40 mt-1 tracking-widest">
                                {today}
                            </p>
                        </div>
                    </div>

                    {/* Right Center: Terminal Boot Logs (pre-computed visibleLogs) */}
                    <div className="absolute right-10 lg:right-14 xl:right-16 top-[40%] translate-y-[-50%] w-[240px] pointer-events-none">
                        <div className="flex flex-col items-end gap-1 font-mono text-[12px] uppercase tracking-wider text-right">
                            <AnimatePresence mode="popLayout">
                                {visibleLogs.map((log, i) => {
                                    const isLatest = i === visibleLogs.length - 1;
                                    return (
                                        <MotionDiv
                                            key={`${log}-${logIndex - (visibleLogs.length - 1 - i)}`}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: isLatest ? 1 : 0.6, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                            className={`flex items-center gap-2 ${isLatest ? 'text-brand-primary font-bold' : 'text-brand-primary/60'}`}
                                        >
                                            <span>{log}</span>
                                            <span className="opacity-50">[OK]</span>
                                        </MotionDiv>
                                    );
                                })}
                            </AnimatePresence>
                            {!isReady && (
                                <MotionDiv
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className="w-1.5 h-3 bg-brand-primary mt-1"
                                />
                            )}
                        </div>
                    </div>
                    {/* Bottom Left: Binary Decode - Separated into individual rows for manual adjustment */}
                    <div className="absolute bottom-10 left-10 lg:left-14 xl:left-16 flex items-end gap-5 opacity-90 pointer-events-none">
                        <BinaryGrid className="w-16 lg:w-20 h-auto mix-blend-screen text-brand-primary" />

                        <div className="flex flex-col text-[8px] lg:text-[9px] font-mono leading-tight tracking-[0.3em] mb-0.5 pointer-events-auto">
                            {/* Row 1: Adjustment point */}
                            <div className="flex justify-between w-32 lg:w-40 transition-all duration-300">
                                <span className="text-brand-primary font-bold">{binaryData[0].prefix}{binaryData[0].id}</span>
                                <span className="text-brand-primary/60">{binaryData[0].val}</span>
                                <span className="text-brand-primary/40">{binaryData[0].node}</span>
                            </div>

                            {/* Row 2: Adjustment point */}
                            <div className="flex justify-between w-32 lg:w-40 transition-all duration-300 ml-[16px]">
                                <span className="text-brand-primary font-bold">{binaryData[1].prefix}{binaryData[1].id}</span>
                                <span className="text-brand-primary/60">{binaryData[1].val}</span>
                                <span className="text-brand-primary/40">{binaryData[1].node}</span>
                            </div>

                            {/* Row 3: Adjustment point */}
                            <div className="flex justify-between w-32 lg:w-40 transition-all duration-300">
                                <span className="text-brand-primary font-bold">{binaryData[2].prefix}{binaryData[2].id}</span>
                                <span className="text-brand-primary/60">{binaryData[2].val}</span>
                                <span className="text-brand-primary/40">{binaryData[2].node}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Right: Progress Panel */}
                    <div className="absolute bottom-10 right-10 lg:right-14 xl:right-16 pointer-events-auto w-1/4 max-w-[500px]">
                        {/* Neural Sync Label */}
                        <div className="flex justify-between text-[12px] text-brand-primary/50 mb-2 tracking-widest">
                            <span>NEURAL.SYNC</span>
                            <span className="text-brand-primary font-bold text-sm">{Math.floor(progress)}%</span>
                        </div>

                        {/* Progress Bar Container - Matches StatCard Style */}
                        <div className="w-full h-1.5 bg-brand-primary/10 relative overflow-hidden rounded-full">
                            {/* Background grid pattern inside bar - Angled 45 deg */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                                backgroundImage: 'linear-gradient(45deg, var(--color-brand-primary) 25%, transparent 25%, transparent 50%, var(--color-brand-primary) 50%, var(--color-brand-primary) 75%, transparent 75%, transparent)',
                                backgroundSize: '6px 6px'
                            }} />

                            {/* Animated Fill Bar - Original Colors */}
                            <MotionDiv
                                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-brand-primary to-cyan-300 shadow-[0_0_15px_var(--color-brand-glow)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>

                        {/* Data Metrics */}
                        <div className="flex justify-between text-[9px] mt-2 font-mono text-brand-primary/40">
                            <span>BANDWIDTH: <span className="text-brand-primary">{Math.floor(progress * 12.8)} MB/s</span></span>
                            <span>LATENCY: <span className="text-green-400">{Math.max(1, Math.floor(100 - progress))}ms</span></span>
                            <span>NODES: <span className="text-brand-primary">{Math.floor(progress / 10)}/10</span></span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons - Center bottom with background overlay when ready */}
                <AnimatePresence>
                    {isReady && (
                        <MotionDiv
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-24"
                        >
                            {/* Dark overlay for button visibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                            <MotionDiv
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="relative flex flex-col items-center gap-4 pointer-events-auto"
                            >
                                {/* Audio Toggle */}
                                <div
                                    className="flex items-center gap-3 cursor-pointer group"
                                    onClick={() => setSoundEnabled(!soundEnabled)}
                                >
                                    <div className={`w-4 h-4 border border-brand-primary flex items-center justify-center transition-all duration-300 ${soundEnabled ? 'bg-brand-primary shadow-[0_0_10px_var(--color-brand-glow)]' : 'bg-transparent'}`}>
                                        {soundEnabled && <div className="w-2 h-2 bg-black" />}
                                    </div>
                                    <span className={`text-xs tracking-widest transition-colors font-sans ${soundEnabled ? 'text-brand-primary' : 'text-brand-primary/50'}`}>
                                        AUDIO SYNC
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-6">
                                    <CyberButton
                                        variant="corner"
                                        color="cyan"
                                        size="lg"
                                        silentClick={false}
                                        onClick={() => {
                                            setLanguage('en');
                                            handleEnter();
                                        }}
                                        className="tracking-[0.3em] font-bold text-sm px-12"
                                    >
                                        INITIATE
                                    </CyberButton>

                                    <CyberButton
                                        variant="corner"
                                        color="cyan"
                                        size="lg"
                                        silentClick={false}
                                        onClick={() => {
                                            setLanguage('zh');
                                            handleEnter();
                                        }}
                                        className="tracking-[0.3em] font-bold text-sm px-8 font-display"
                                    >
                                        接入
                                    </CyberButton>
                                </div>

                                {/* Bottom Warning */}
                                <p className="text-[9px] text-red-500/60 tracking-[0.2em] mt-4">
                                    ⚠ HIGH BANDWIDTH NEURAL CONNECTION
                                </p>
                            </MotionDiv>
                        </MotionDiv>
                    )}
                </AnimatePresence>
                {/* Corner HUD Decorations - Framing the central model */}
                {/* 1. 左上角 (Top-Left): 残影向右下偏移 */}
                <BootCorner
                    isReady={isReady}
                    position="top-[15%] lg:top-[20%] left-[20%] lg:left-[25%]"
                    ghostOffset="-translate-x-[4px] -translate-y-[4px]"
                />
                {/* 2. 右上角 (Top-Right): 残影向左下偏移 */}
                <BootCorner
                    isReady={isReady}
                    position="top-[15%] lg:top-[20%] right-[20%] lg:right-[25%]"
                    ghostOffset="translate-x-[4px] -translate-y-[4px]"
                />
                {/* 3. 左下角 (Bottom-Left): 残影向右上偏移 */}
                <BootCorner
                    isReady={isReady}
                    position="bottom-[15%] lg:bottom-[20%] left-[20%] lg:left-[25%]"
                    ghostOffset="-translate-x-[4px] translate-y-[4px]"
                />
                {/* 4. 右下角 (Bottom-Right): 残影向左上偏移 */}
                <BootCorner
                    isReady={isReady}
                    position="bottom-[15%] lg:bottom-[20%] right-[20%] lg:right-[25%]"
                    ghostOffset="translate-x-[4px] translate-y-[4px]"
                />
            </div>
        </MotionDiv>
    );
};
