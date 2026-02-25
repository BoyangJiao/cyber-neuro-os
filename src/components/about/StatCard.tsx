import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface StatCardProps {
    title: string;
    desc: string;
    value: number;
    delay?: number;
    aligned?: 'left' | 'right';
}

export const StatCard = ({ title, desc, value, delay = 0, aligned = 'left' }: StatCardProps) => {
    const [displayValue, setDisplayValue] = useState(0);

    // Number counting animation
    useEffect(() => {
        let startTime: number;
        const duration = 1500; // 1.5 seconds calculation time
        // Only start counting after the entry delay
        const timer = setTimeout(() => {
            const updateCounter = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;

                if (progress < duration) {
                    const currentVal = Math.floor((progress / duration) * value);
                    setDisplayValue(currentVal);
                    requestAnimationFrame(updateCounter);
                } else {
                    setDisplayValue(value);
                }
            };
            requestAnimationFrame(updateCounter);
        }, delay * 1000); // convert to ms

        return () => clearTimeout(timer);
    }, [value, delay]);

    return (
        <motion.div
            className={`flex flex-col gap-1.5 w-full max-w-[240px] ${aligned === 'right' ? 'items-end text-right' : 'items-start text-left'}`}
            initial={{ opacity: 0, x: aligned === 'left' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay }}
        >
            {/* Title & Value */}
            <div className={`flex w-full items-end justify-between ${aligned === 'right' ? 'flex-row-reverse' : ''}`}>
                <h3 className="text-brand-primary font-bold text-sm tracking-[0.2em] uppercase">
                    {title}
                </h3>
                <span className="text-brand-secondary font-mono text-xl font-bold">
                    {displayValue}
                </span>
            </div>

            {/* Description */}
            <p className="text-brand-primary/60 text-[10px] uppercase tracking-wider h-8">
                {desc}
            </p>

            {/* Progress Bar Container */}
            <div className="w-full h-1.5 bg-brand-primary/10 relative overflow-hidden rounded-full">
                {/* Background grid pattern inside bar */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                    backgroundImage: 'linear-gradient(90deg, var(--color-brand-primary) 1px, transparent 1px)',
                    backgroundSize: '4px 100%'
                }} />

                {/* Animated Fill Bar */}
                <motion.div
                    className="absolute top-0 bottom-0 bg-brand-secondary shadow-[0_0_8px_var(--color-brand-secondary)]"
                    style={{
                        [aligned === 'left' ? 'left' : 'right']: 0,
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: delay + 0.2 }}
                />
            </div>
        </motion.div>
    );
};
