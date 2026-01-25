import { useState, useEffect } from 'react';
import { GhostText } from './GhostText';
import { useTranslation } from '../../i18n';

export const BiometricMonitor = () => {
    const { t } = useTranslation();
    const [glitchActive, setGlitchActive] = useState(false);

    // Random glitch trigger for OVERLOAD metric
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                setGlitchActive(true);
                setTimeout(() => setGlitchActive(false), 200);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-full w-full relative overflow-hidden px-4">

            {/* Header */}
            <div className="mb-6 flex flex-col gap-1 relative z-10">
                <GhostText className="text-[10px] tracking-[0.2em] text-text-muted uppercase">
                    {t('biometric.sysMon')}
                </GhostText>
                <div className="h-[1px] w-8 bg-brand-primary/50" />
            </div>

            {/* Modules Container */}
            <div className="flex flex-col gap-6 lg:gap-8 flex-1 relative z-10 w-full">

                {/* 1. CORTEX LOAD (Waveform Animation) */}
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs font-mono text-brand-secondary tracking-wider">{t('biometric.cortex')}</span>
                        <span className="text-xs font-mono text-brand-primary animate-pulse">42%</span>
                    </div>
                    {/* Dynamic Waveform Visual */}
                    <div className="w-full h-4 flex items-end justify-between gap-[2px] opacity-80">
                        {[...Array(12)].map((_, i) => (
                            <div key={i}
                                className={`w-1 bg-brand-primary/60 animate-waveform`}
                                style={{
                                    height: `${30 + Math.random() * 70}%`,
                                    animationDelay: `${i * 100}ms`,
                                    animationDuration: `${0.8 + Math.random() * 0.5}s`
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* 2. SYNAPTIC SYNC (Connection Stability) */}
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs font-mono text-brand-secondary tracking-wider">{t('biometric.sync')}</span>
                        <span className="text-xs font-mono text-brand-primary text-[10px] border border-brand-primary/30 px-1 rounded-sm">
                            {t('biometric.stable')}
                        </span>
                    </div>
                    <div className="w-full h-6 border border-brand-primary/20 bg-brand-primary/5 relative overflow-hidden">
                        {/* Scanning Line */}
                        <div className="absolute top-0 bottom-0 w-[2px] bg-brand-primary/50 shadow-[0_0_10px_rgba(0,240,255,0.8)] animate-scan-fast" />
                    </div>
                </div>

                {/* 3. STRESS (Warning Color if high - Simulated) */}
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs font-mono text-brand-secondary tracking-wider">{t('biometric.stress')}</span>
                        <span className="text-xs font-mono text-brand-secondary opacity-70">12%</span>
                    </div>
                    {/* Stress Bar - Low */}
                    <div className="w-full h-1 bg-brand-secondary/10 flex">
                        <div className="h-full w-[12%] bg-brand-secondary/60 animate-pulse" />
                    </div>
                </div>

                {/* 4. OVERLOAD (Glitch Effect) */}
                <div className="flex flex-col gap-2 w-full relative group cursor-crosshair">
                    <div className="flex justify-between items-baseline">
                        <span className={`text-xs font-mono tracking-wider transition-colors duration-100 ${glitchActive ? 'text-red-400 animate-glitch-text' : 'text-brand-secondary'}`}>
                            {t('biometric.overload')}
                        </span>
                        {/* Glitchy Status */}
                        <span className={`text-xs font-mono ${glitchActive ? 'text-red-500 font-bold' : 'text-brand-primary/50'}`}>
                            {glitchActive ? '!ERR!' : 'NULL'}
                        </span>
                    </div>
                    {/* Glitch Bar */}
                    <div className="w-full h-2 bg-black border border-brand-primary/10 overflow-hidden relative">
                        <div className={`absolute top-0 left-0 w-full h-full bg-red-500/20 transform ${glitchActive ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-75`} />
                    </div>
                </div>

                {/* 5. ENERGY (Battery Drain) */}
                <div className="flex flex-col gap-2 w-full mt-2">
                    <div className="flex justify-between items-baseline">
                        <span className="text-xs font-mono text-brand-secondary tracking-wider">{t('biometric.energy')}</span>
                    </div>
                    <div className="flex gap-[2px] w-full h-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`h-full flex-1 border border-brand-primary/30 ${i < 3 ? 'bg-brand-primary/40' : 'bg-transparent'} ${i === 3 ? 'animate-pulse bg-brand-primary/20' : ''}`} />
                        ))}
                    </div>
                </div>

                {/* 6. VITALS (Heartbeat) */}
                <div className="mt-auto mb-8 flex flex-col gap-2 pt-4 border-t border-brand-primary/10">
                    <div className="flex justify-between items-center opacity-80">
                        <span className="text-[10px] font-mono text-text-muted">{t('biometric.vitals')}</span>
                        <span className="text-[10px] font-mono text-brand-primary animate-heartbeat">♥ 72 BPM</span>
                    </div>
                    {/* ECG Line visual */}
                    <svg className="w-full h-8 stroke-brand-primary/60 fill-none" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0,10 L10,10 L15,10 L20,2 L25,18 L30,10 L40,10 L100,10" vectorEffect="non-scaling-stroke" strokeWidth="1" className="animate-pulse" />
                    </svg>
                </div>

            </div>
        </div>
    );
};
