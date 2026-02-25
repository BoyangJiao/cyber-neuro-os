import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface SoundWaveProps {
    isPlaying: boolean;
    barCount?: number;
    className?: string;
    color?: string;
}

export const SoundWave: React.FC<SoundWaveProps> = ({
    isPlaying,
    barCount = 30,
    className,
    color = 'bg-text-secondary'
}) => {
    // Generate an array of random heights between 20% and 100% for the waveform
    const baseWaveform = useMemo(() => {
        return Array.from({ length: barCount }).map(() =>
            Math.floor(Math.random() * 80) + 20
        );
    }, [barCount]);

    return (
        <div className={twMerge("flex items-center justify-center gap-1 w-full h-full overflow-hidden", className)}>
            {baseWaveform.map((baseHeight, index) => {
                // When playing, we animate the height randomly around the base height.
                // When stopped, it returns to a static 10-20% height for all, or keeps the base heights.
                // To match reference image, let's keep base heights when stopped, and animate them when playing.
                const randomDuration = Math.random() * 0.5 + 0.3; // 0.3s to 0.8s

                return (
                    <motion.div
                        key={index}
                        className={twMerge("w-1 rounded-sm opacity-80", color)}
                        initial={{ height: `${baseHeight}%` }}
                        animate={
                            isPlaying
                                ? {
                                    height: [`${baseHeight}%`, `${Math.max(10, baseHeight - 40)}%`, `${Math.min(100, baseHeight + 40)}%`, `${baseHeight}%`]
                                }
                                : { height: `${baseHeight}%` }
                        }
                        transition={
                            isPlaying
                                ? {
                                    duration: randomDuration,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }
                                : { duration: 0.3 }
                        }
                    />
                );
            })}
        </div>
    );
};
