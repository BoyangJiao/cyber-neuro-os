import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * BorvisSignalHijack — ~1.1s "signal intercepted" transition overlay.
 *
 * Sequence:
 *   0ms   : dark overlay fades in, chromatic glitch bands flash
 *   80ms  : phase 1 — scanline sweep top→bottom
 *   350ms : phase 2 — center terminal text appears
 *   exit  : controlled by parent removing it from AnimatePresence at t=1100ms
 *
 * Renders above everything (z-[500]) while the BorvisOverlay renders below it,
 * so the face is already building in when this overlay fades out.
 */
export const BorvisSignalHijack = ({ mode = 'enter' }: { mode?: 'enter' | 'exit' }) => {
    const [phase, setPhase] = useState(0);
    const isExit = mode === 'exit';
    const titleLine = isExit ? '■ NEURAL_LINK_TERMINATED ■' : '■ NEURAL_LINK_INTERCEPTED ■';
    const subLine = isExit ? 'RETURNING_TO_SURFACE' : 'SIGNAL_SOURCE : BORVIS_ENTITY';

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 80);
        const t2 = setTimeout(() => setPhase(2), 350);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-[500] pointer-events-none overflow-hidden"
            initial={{ opacity: 1 }}      // cover instantly — no fade-in, so the home page never flashes through
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ exit: { duration: 0.35 } } as never}
        >
            {/* Base dark overlay — opaque almost immediately */}
            <motion.div
                className="absolute inset-0 bg-black"
                initial={{ opacity: 0.85 }}
                animate={{ opacity: 0.94 }}
                transition={{ duration: 0.1 }}
            />

            {/* Scanline texture (always present on overlay) */}
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,255,0.012) 3px, rgba(0,255,255,0.012) 4px)',
                }}
            />

            {/* Chromatic aberration — two color-offset bands that glitch briefly */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    opacity: [0, 0.7, 0.3, 0.9, 0],
                    x: [0, -4, 4, -2, 0],
                }}
                transition={{ duration: 0.45, times: [0, 0.15, 0.35, 0.65, 1] }}
                style={{
                    background:
                        'linear-gradient(90deg, rgba(255,0,0,0.07) 0%, transparent 25%, rgba(0,255,255,0.07) 75%, transparent 100%)',
                    mixBlendMode: 'screen',
                }}
            />

            {/* Scanline sweep — top to bottom */}
            {phase >= 1 && (
                <motion.div
                    className="absolute left-0 right-0 h-[180px] pointer-events-none"
                    style={{
                        background:
                            'linear-gradient(to bottom, transparent, rgba(var(--brand-primary-rgb,34,211,238), 0.07), transparent)',
                    }}
                    initial={{ top: isExit ? '110%' : -180 }}
                    animate={{ top: isExit ? -180 : '110%' }}
                    transition={{ duration: 0.55, ease: 'easeIn' }}
                />
            )}

            {/* Center terminal readout */}
            {phase >= 2 && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 0.55, times: [0, 0.1, 0.65, 1] }}
                >
                    <div className="flex flex-col items-center gap-2 select-none">
                        <div className="text-brand-primary font-mono text-[10px] tracking-[0.5em] uppercase">
                            {titleLine}
                        </div>
                        <div className="font-mono text-[8px] tracking-[0.35em] uppercase"
                            style={{ color: 'rgba(var(--brand-primary-rgb,34,211,238), 0.45)' }}>
                            {subLine}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Brand color pulse flash */}
            <motion.div
                className="absolute inset-0 bg-[var(--color-brand-primary)]"
                animate={{ opacity: [0, 0.09, 0.04, 0.12, 0] }}
                transition={{ duration: 0.75, times: [0, 0.25, 0.5, 0.7, 1] }}
            />
        </motion.div>
    );
};
