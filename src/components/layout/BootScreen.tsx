import { useState, useEffect, Suspense } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { MotionDiv, MotionH1 } from '../motion/MotionWrappers';
import { CyberButton } from '../ui/CyberButton';
import { useMusicStore } from '../../store/useMusicStore';
import { AnimatePresence } from 'framer-motion';
import { HelmetReveal } from '../three/HelmetReveal';

// Neural sync status messages
const BOOT_LOGS = [
    "INITIALIZING NEURO-LINK PROTOCOL...",
    "SCANNING NEURAL PATHWAYS...",
    "SYNCING SYNAPTIC NODES...",
    "CALIBRATING CORTEX INTERFACE...",
    "ESTABLISHING NEURAL HANDSHAKE...",
    "MAPPING CONSCIOUSNESS GRID...",
    "LOADING HOLOGRAPHIC OVERLAY...",
    "NEURAL SYNC COMPLETE."
];

export const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);
    const [logIndex, setLogIndex] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const { setLanguage } = useLanguage();
    const { setVolume, play, pause } = useMusicStore();

    useEffect(() => {
        const totalDuration = 5000; // Longer for dramatic effect
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

    const handleEnter = () => {
        if (soundEnabled) {
            setVolume(0);
            play();
            const targetVol = 75;
            const duration = 5000;
            const steps = 50;
            const stepTime = duration / steps;
            const increment = targetVol / steps;
            let currentVol = 0;
            const fadeTimer = setInterval(() => {
                currentVol += increment;
                if (currentVol >= targetVol) {
                    currentVol = targetVol;
                    clearInterval(fadeTimer);
                }
                setVolume(currentVol);
            }, stepTime);
        } else {
            setVolume(0);
            pause();
        }
        onComplete();
    };

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

                {/* HUD Overlay - Positioned over 3D scene */}
                <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">

                    {/* Top HUD Bar */}
                    <div className="flex justify-between items-start p-8 pointer-events-auto">
                        {/* Left: Title */}
                        <div>
                            <MotionH1
                                className="text-3xl lg:text-5xl font-display font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-brand-primary drop-shadow-[0_0_30px_var(--color-brand-glow)]"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                NEURO.OS
                            </MotionH1>
                            <p className="text-xs text-brand-secondary tracking-[0.5em] mt-2 opacity-60">
                                BOYANG JIAO v1.0.0 // NEURAL INTERFACE
                            </p>
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
                                {new Date().toISOString().split('T')[0]}
                            </p>
                        </div>
                    </div>

                    {/* Left Center: Status Message - positioned at vertical center */}
                    <div className="absolute left-8 top-1/2 -translate-y-1/2">
                        <MotionDiv
                            className="text-left max-w-[200px]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <p className="text-sm lg:text-base text-brand-primary tracking-[0.15em] font-light leading-relaxed">
                                {BOOT_LOGS[logIndex]}
                            </p>
                        </MotionDiv>
                    </div>

                    {/* Bottom Right: Progress Panel - Larger size, from shoulder to edge */}
                    <div className="absolute bottom-8 right-8 pointer-events-auto" style={{ width: 'calc(35% - 32px)' }}>
                        {/* Neural Sync Label */}
                        <div className="flex justify-between text-[10px] text-brand-primary/50 mb-2 tracking-widest">
                            <span>NEURAL.SYNC</span>
                            <span className="text-brand-primary font-bold text-sm">{Math.floor(progress)}%</span>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="relative h-2 bg-black/80 border border-brand-primary/40 overflow-hidden backdrop-blur-sm">
                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-brand-primary" />
                            <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-brand-primary" />
                            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-brand-primary" />
                            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-brand-primary" />

                            {/* Progress Fill */}
                            <MotionDiv
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-primary to-cyan-300 shadow-[0_0_15px_var(--color-brand-glow)]"
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
                                        onClick={() => {
                                            setLanguage('zh');
                                            handleEnter();
                                        }}
                                        className="tracking-[0.3em] font-bold text-sm px-8 font-sans"
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

                {/* Corner HUD Decorations */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-white z-20" />
                <div className="absolute top-4 right-4 w-2 h-2 bg-white z-20" />
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-white z-20" />
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-white z-20" />
            </div>
        </MotionDiv>
    );
};
