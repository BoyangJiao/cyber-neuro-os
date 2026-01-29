import { useState, useEffect } from 'react';
import { MotionDiv, MotionH1 } from '../motion/MotionWrappers';
import { CyberButton } from '../ui/CyberButton';
import { DotsFrame } from '../ui/frames/DotsFrame';
import { useMusicStore } from '../../store/useMusicStore';
import { AnimatePresence } from 'framer-motion';

// Mock boot logs
const BOOT_LOGS = [
    "INITIALIZING NEURO-LINK PROTOCOL...",
    "BYPASSING FIREWALL :: LAYER 7...",
    "SYNCING SYNAPSES...",
    "CHECKING BIOMETRIC SIGNATURE...",
    "ESTABLISHING SECURE HANDSHAKE...",
    "DECRYPTING USER PROFILE...",
    "LOADING HOLOGRAPHIC INTERFACE...",
    "SYSTEM READY."
];

export const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);
    const [logIndex, setLogIndex] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Audio store actions
    const { setVolume, play, pause } = useMusicStore();

    useEffect(() => {
        const totalDuration = 3500;
        const interval = 50;
        const totalSteps = totalDuration / interval;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            const newProgress = Math.min((step / totalSteps) * 100, 100);
            setProgress(newProgress);

            // Update logs based on progress
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
            // Start silent and fade in
            setVolume(0);
            play();

            // Fade in logic
            const targetVol = 75;
            const duration = 5000; // 5s fade
            const steps = 50; // smoother steps
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
            pause(); // Ensure state is paused
        }
        onComplete();
    };

    return (
        <MotionDiv
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-brand-primary font-mono overflow-hidden"
            exit={{
                opacity: 0,
                scale: 1.05,
                filter: "blur(20px) brightness(2)",
                transition: { duration: 0.8, ease: "circIn" }
            }}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-scanlines"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,#000_100%)]"></div>
            </div>

            {/* Rotating Hexagon / Spinner */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-brand-primary/10 rounded-full animate-[spin_10s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-brand-primary/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

            {/* Main Terminal Window */}
            <div className="relative z-10 w-full max-w-2xl h-[600px] p-4">
                <DotsFrame>
                    <div className="h-full flex flex-col justify-between p-6">
                        {/* Header */}
                        <div className="flex justify-between items-end border-b border-brand-primary/30 pb-4">
                            <div>
                                <MotionH1
                                    className="text-5xl font-display font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-white to-brand-primary drop-shadow-[0_0_15px_var(--color-brand-glow)]"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    NEURO.OS
                                </MotionH1>
                                <p className="text-xs text-brand-secondary tracking-[0.5em] mt-2">KERNEL VERSION 4.2.0 // UNSTABLE</p>
                            </div>
                            <div className="text-right">
                                <div className="flex flex-col gap-1 items-end">
                                    {isReady ? (
                                        <>
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#0f0]"></span>
                                            <span className="text-[10px] text-brand-primary/60 tracking-widest">READY</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping opacity-75"></span>
                                            <span className="text-[10px] text-amber-500/80 tracking-widest animate-pulse">ESTABLISHING...</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Middle Content: Logs & Progress */}
                        <div className="flex-1 flex flex-col justify-center gap-8 py-8">
                            {/* Boot Logs Output */}
                            <div className="h-32 font-mono text-sm overflow-hidden flex flex-col justify-end relative">
                                {/* Scanline for logs */}
                                {/* Removed background gradient per user request */}

                                <AnimatePresence mode='popLayout'>
                                    {BOOT_LOGS.slice(0, logIndex + 1).slice(-4).map((log, idx) => (
                                        <MotionDiv
                                            key={`${idx}-${log}`}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="mb-1 text-brand-primary/80 truncate"
                                        >
                                            <span className="text-brand-secondary mr-2">[{new Date().toISOString().split('T')[1].slice(0, 8)}]</span>
                                            {log}
                                        </MotionDiv>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Loading Bar */}
                            <div className="relative h-4 bg-brand-primary/10 border border-brand-primary/30 skew-x-[-20deg]">
                                {/* Loading stripes pattern */}
                                <MotionDiv
                                    className="absolute top-0 left-0 h-full bg-brand-primary shadow-[0_0_20px_var(--color-brand-glow)]"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.5)_10px,rgba(0,0,0,0.5)_20px)]"></div>
                                </MotionDiv>
                                <div className="absolute top-0 right-2 h-full flex items-center text-[10px] text-brand-primary font-bold">
                                    {Math.floor(progress)}%
                                </div>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="h-24 flex items-center justify-center relative">
                            {isReady ? (
                                <MotionDiv
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center gap-6 w-full"
                                >
                                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setSoundEnabled(!soundEnabled)}>
                                        <div className={`w-4 h-4 border border-brand-primary flex items-center justify-center transition-all duration-300 ${soundEnabled ? 'bg-brand-primary shadow-[0_0_10px_var(--color-brand-glow)]' : 'bg-transparent'}`}>
                                            {soundEnabled && <div className="w-2 h-2 bg-black"></div>}
                                        </div>
                                        <span className={`text-xs tracking-widest transition-colors ${soundEnabled ? 'text-brand-primary' : 'text-brand-primary/50'}`}>
                                            ENABLE NEURAL AUDIO SYNC
                                        </span>
                                    </div>

                                    <CyberButton
                                        variant="corner"
                                        color="cyan"
                                        size="lg"
                                        onClick={handleEnter}
                                        className="w-auto whitespace-nowrap tracking-[0.25em] font-bold text-xs transition-all duration-500"
                                    >
                                        SYNC SYSTEM
                                    </CyberButton>
                                </MotionDiv>
                            ) : (
                                <span className="text-xs animate-pulse text-brand-primary/50 tracking-[0.2em]">
                                    SYSTEM COMPILING...
                                </span>
                            )}
                        </div>
                    </div>
                </DotsFrame>
            </div>

            {/* Bottom Warning */}
            <div className="absolute bottom-8 text-center opacity-40">
                <p className="text-[10px] text-red-500 tracking-[0.3em] font-bold">WARNING: HIGH BANDWIDTH NEURAL CONNECTION</p>
                <p className="text-[9px] text-brand-primary/40 mt-1">UNAUTHORIZED ACCESS WILL BE TERMINATED</p>
            </div>

        </MotionDiv>
    );
};
