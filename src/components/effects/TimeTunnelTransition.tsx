import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const TimeTunnelTransition = () => {
    const [particles, setParticles] = useState<Array<{ id: number, angle: number, distance: number, speed: number, size: number, delay: number, colorIndex: number }>>([]);

    useEffect(() => {
        // Generate hyperspace warp particles
        const p = Array.from({ length: 150 }).map((_, i) => ({
            id: i,
            angle: Math.random() * Math.PI * 2,
            distance: Math.random() * 80 + 20, // Starting radius off center
            speed: Math.random() * 1.5 + 0.5,
            size: Math.random() * 2 + 1,
            delay: Math.random() * 0.4,
            colorIndex: Math.random() > 0.8 ? 1 : 0 // Some secondary colored ones
        }));
        setParticles(p);
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-[120] pointer-events-none overflow-hidden bg-black flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            {/* Particle Hyperspace Lines */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute top-1/2 left-1/2"
                    style={{ transform: `rotate(${p.angle}rad)` }}
                >
                    <motion.div
                        className={`absolute origin-left shadow-[0_0_10px_currentColor] ${p.colorIndex === 1 ? 'bg-[var(--color-brand-secondary)] text-[var(--color-brand-secondary)]' : 'bg-[var(--color-brand-primary)] text-[var(--color-brand-primary)]'}`}
                        style={{
                            width: '2px', // initial tiny dot length
                            height: `${p.size}px`,
                            marginTop: `-${p.size / 2}px`
                        }}
                        initial={{
                            x: p.distance,
                            scaleX: 1,
                            opacity: 0
                        }}
                        animate={{
                            x: p.distance + 1200 * p.speed, // Shoot far outward
                            scaleX: 80 * p.speed, // Stretch into a line
                            opacity: [0, 1, 1, 0]
                        }}
                        transition={{
                            duration: 1.2 / p.speed,
                            delay: p.delay,
                            ease: "easeIn",
                            repeat: Infinity
                        }}
                    />
                </div>
            ))}

            {/* Central glowing wormhole */}
            <motion.div
                className="absolute top-1/2 left-1/2 w-32 h-32 -mt-16 -ml-16 rounded-full bg-[var(--color-brand-primary)] blur-[100px]"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 2, 5], opacity: [0, 0.4, 0] }}
                transition={{ duration: 1.8, ease: "easeIn" }}
            />

            {/* Final white flash crash */}
            <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 0, 0.9, 0] }}
                transition={{ duration: 1.8, times: [0, 0.7, 0.8, 0.9, 1] }}
            />
        </motion.div>
    );
};
