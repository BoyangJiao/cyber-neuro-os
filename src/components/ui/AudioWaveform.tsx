import { motion } from 'framer-motion';
import clsx from 'clsx';

interface AudioWaveformProps {
    isPlaying: boolean;
    className?: string;
    barColor?: string;
}

export const AudioWaveform = ({ isPlaying, className, barColor = "bg-current" }: AudioWaveformProps) => {
    return (
        <div className={clsx("flex items-center justify-center gap-[3px] h-4 w-5", className)}>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className={clsx("w-[3px] rounded-full", barColor)}
                    initial={{ height: 4 }}
                    animate={{
                        height: isPlaying
                            ? [4, 16, 4]
                            : 4 // Static height when paused
                    }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: i * 0.15, // Stagger starting times
                    }}
                />
            ))}
        </div>
    );
};
