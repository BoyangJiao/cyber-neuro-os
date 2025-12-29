import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('INITIALIZING NEURO-LINK...');

    useEffect(() => {
        const duration = 2500; // Total boot time
        const intervalTime = 50;
        const steps = duration / intervalTime;

        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const newProgress = Math.min((currentStep / steps) * 100, 100);
            setProgress(newProgress);

            if (newProgress > 20 && newProgress < 40) setStatusText('ESTABLISHING SECURE CONNECTION...');
            if (newProgress > 40 && newProgress < 60) setStatusText('LOADING HOLOGRAPHIC INTERFACE...');
            if (newProgress > 60 && newProgress < 80) setStatusText('DECRYPTING USER PROFILE...');
            if (newProgress > 80) setStatusText('ACCESS GRANTED.');

            if (currentStep >= steps) {
                clearInterval(timer);
                setTimeout(onComplete, 500);
            }
        }, intervalTime);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cyber-950 text-cyan-500 font-mono select-none"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "circIn" }}
        >
            {/* Glitch Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiAvPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMDA0Q0ZGIiAvPgo8L3N2Zz4=')]"></div>

            {/* Main Container */}
            <div className="relative w-full max-w-md p-8 border-2 border-cyan-500/30 bg-cyber-900/50 backdrop-blur-sm">
                {/* Corner Decorators */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500"></div>

                <motion.h1
                    className="text-4xl font-display font-bold text-center mb-8 tracking-widest text-cyan-400 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    CYBER NEUROSPACE
                </motion.h1>

                {/* Progress Bar */}
                <div className="relative h-2 bg-cyber-800 mb-4 overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-cyan-500 shadow-[0_0_15px_rgba(0,240,255,0.8)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Status Text */}
                <div className="flex justify-between items-center text-xs text-cyan-300/80">
                    <span>{statusText}</span>
                    <span>{Math.floor(progress)}%</span>
                </div>
            </div>

            {/* Footer System Info */}
            <div className="absolute bottom-10 text-center text-cyber-700 text-[10px] tracking-widest">
                <p>SYSTEM VERSION 2.0.77</p>
                <p>MEM: 64TB // CPU: QUANTUM CORE</p>
            </div>
        </motion.div>
    );
};
