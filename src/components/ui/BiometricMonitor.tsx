/**
 * BiometricMonitor - Neural Interface System Monitor
 * 
 * A living, breathing system panel that simulates real-time neural metrics.
 * All values drift organically over time using sine-wave composites,
 * making each visit feel unique. Inspired by:
 * - Ghost in the Shell: brain-dive readout aesthetics
 * - Cyberpunk 2077: Kiroshi optics HUD overlays
 * - Death Stranding: BB pod vitals monitor
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { GhostText } from './GhostText';
import { useTranslation } from '../../i18n';

// ============================================================
// Organic value generators - composites of sine waves for natural drift
// ============================================================

/** Generate a smoothly drifting value between min and max */
const useDriftValue = (min: number, max: number, speed: number = 1) => {
    const [value, setValue] = useState((min + max) / 2);
    const phaseRef = useRef(Math.random() * Math.PI * 2);

    useEffect(() => {
        let frame: number;
        const animate = () => {
            const t = Date.now() / 1000;
            const p = phaseRef.current;
            // Composite of multiple sine waves for organic, non-repetitive motion
            const raw =
                Math.sin(t * 0.3 * speed + p) * 0.4 +
                Math.sin(t * 0.7 * speed + p * 2.1) * 0.3 +
                Math.sin(t * 1.3 * speed + p * 0.7) * 0.2 +
                Math.sin(t * 0.13 * speed + p * 3.3) * 0.1; // ultra-slow drift
            // Normalize -1..1 → min..max
            const normalized = (raw + 1) / 2;
            setValue(min + normalized * (max - min));
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [min, max, speed]);

    return value;
};

// ============================================================
// Live EKG/Waveform component (Canvas-based for smooth animation)
// ============================================================

const LiveWaveform = ({
    height = 32,
    color = 'var(--color-brand-primary)',
    speed = 1,
    amplitude = 0.6,
    type = 'ekg' // 'ekg' | 'brain' | 'sine'
}: {
    height?: number;
    color?: string;
    speed?: number;
    amplitude?: number;
    type?: 'ekg' | 'brain' | 'sine';
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameRef = useRef(0);
    const offsetRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const computedStyle = getComputedStyle(document.documentElement);
        const resolvedColor = color.startsWith('var(')
            ? computedStyle.getPropertyValue(color.slice(4, -1)).trim() || '#00F0FF'
            : color;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);

        const animate = () => {
            const w = canvas.getBoundingClientRect().width;
            const h = height;
            ctx.clearRect(0, 0, w, h);

            offsetRef.current += speed * 1.5;
            const offset = offsetRef.current;

            ctx.beginPath();
            ctx.strokeStyle = resolvedColor;
            ctx.lineWidth = 1.2;
            ctx.globalAlpha = 0.7;

            const midY = h / 2;
            const amp = (h / 2) * amplitude;

            for (let x = 0; x < w; x++) {
                const t = (x + offset) / w;
                let y = midY;

                if (type === 'ekg') {
                    // EKG-style: flat line with periodic sharp spikes
                    const cycle = ((x + offset) % 120) / 120;
                    if (cycle > 0.35 && cycle < 0.4) {
                        y = midY - amp * 0.4 * Math.sin((cycle - 0.35) / 0.05 * Math.PI);
                    } else if (cycle > 0.4 && cycle < 0.45) {
                        y = midY + amp * Math.sin((cycle - 0.4) / 0.05 * Math.PI);
                    } else if (cycle > 0.45 && cycle < 0.5) {
                        y = midY - amp * 0.6 * Math.sin((cycle - 0.45) / 0.05 * Math.PI);
                    } else if (cycle > 0.5 && cycle < 0.55) {
                        y = midY + amp * 0.15 * Math.sin((cycle - 0.5) / 0.05 * Math.PI);
                    } else {
                        y = midY + Math.sin(t * 30) * 0.5; // tiny noise on flat sections
                    }
                } else if (type === 'brain') {
                    // Brain wave: composite of alpha/beta/theta rhythms
                    y = midY +
                        Math.sin(t * 8 + offset * 0.01) * amp * 0.5 +     // alpha (8-12Hz)
                        Math.sin(t * 20 + offset * 0.02) * amp * 0.25 +   // beta (13-30Hz)
                        Math.sin(t * 3 + offset * 0.005) * amp * 0.25;    // theta (4-7Hz)
                } else {
                    // Clean sine
                    y = midY + Math.sin(t * 12 + offset * 0.01) * amp;
                }

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            ctx.stroke();

            // Trailing glow at the right edge (current readout point)
            const glowX = w - 2;
            const lastY = midY; // approximate
            ctx.beginPath();
            ctx.arc(glowX, lastY, 2, 0, Math.PI * 2);
            ctx.fillStyle = resolvedColor;
            ctx.globalAlpha = 0.9;
            ctx.fill();

            // Glow halo
            ctx.beginPath();
            ctx.arc(glowX, lastY, 5, 0, Math.PI * 2);
            ctx.fillStyle = resolvedColor;
            ctx.globalAlpha = 0.15;
            ctx.fill();

            ctx.globalAlpha = 1;
            frameRef.current = requestAnimationFrame(animate);
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(frameRef.current);
            resizeObserver.disconnect();
        };
    }, [height, color, speed, amplitude, type]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full"
            style={{ height: `${height}px` }}
        />
    );
};

// ============================================================
// Mini bar chart with live animation
// ============================================================

const LiveBarChart = ({ value, segments = 8 }: { value: number; segments?: number }) => {
    const [bars, setBars] = useState<number[]>([]);

    useEffect(() => {
        let frame: number;
        const animate = () => {
            const t = Date.now() / 1000;
            const newBars = Array.from({ length: segments }, (_, i) => {
                const phase = i * 0.7;
                const wave =
                    Math.sin(t * 1.5 + phase) * 0.3 +
                    Math.sin(t * 0.8 + phase * 1.5) * 0.4 +
                    Math.sin(t * 2.5 + phase * 0.3) * 0.3;
                return Math.max(0.05, Math.min(1, (wave + 1) / 2 * (value / 100) * 1.5));
            });
            setBars(newBars);
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [value, segments]);

    return (
        <div className="w-full h-5 flex items-end gap-[2px]">
            {bars.map((h, i) => (
                <div
                    key={i}
                    className="flex-1 bg-brand-primary/50 transition-[height] duration-150"
                    style={{ height: `${h * 100}%` }}
                />
            ))}
        </div>
    );
};

// ============================================================
// Main Component
// ============================================================

export const BiometricMonitor = () => {
    const { t } = useTranslation();

    // Living metric values that drift organically
    const cortexLoad = useDriftValue(28, 62, 0.8);
    const syncRate = useDriftValue(94, 99.8, 0.3);
    const neuralFreq = useDriftValue(8.2, 13.1, 0.5); // Alpha wave range (Hz)
    const stressLevel = useDriftValue(5, 25, 0.6);
    const energyLevel = useDriftValue(55, 85, 0.2);
    const heartRate = useDriftValue(64, 78, 0.4);

    // Occasional micro-glitch
    const [glitch, setGlitch] = useState(false);
    useEffect(() => {
        const iv = setInterval(() => {
            if (Math.random() > 0.8) {
                setGlitch(true);
                setTimeout(() => setGlitch(false), 150 + Math.random() * 100);
            }
        }, 4000 + Math.random() * 3000);
        return () => clearInterval(iv);
    }, []);

    // Time-based status text
    const getTimeStatus = useCallback(() => {
        const h = new Date().getHours();
        if (h >= 23 || h < 6) return { text: 'DEEP_REST', color: 'text-blue-400' };
        if (h >= 6 && h < 9) return { text: 'BOOT_SEQ', color: 'text-amber-400' };
        if (h >= 9 && h < 12) return { text: 'PEAK_FOCUS', color: 'text-green-400' };
        if (h >= 12 && h < 14) return { text: 'RECHARGE', color: 'text-amber-400' };
        if (h >= 14 && h < 18) return { text: 'ACTIVE', color: 'text-brand-primary' };
        return { text: 'WIND_DOWN', color: 'text-purple-400' };
    }, []);

    const timeStatus = getTimeStatus();

    const energySegments = 5;
    const filledSegments = Math.round((energyLevel / 100) * energySegments);

    return (
        <div className="flex flex-col h-full w-full relative overflow-hidden px-4">

            {/* Header */}
            <div className="mb-5 flex flex-col gap-1 relative z-10">
                <div className="flex items-center justify-between">
                    <GhostText className="text-[10px] tracking-[0.2em] text-text-muted uppercase">
                        {t('biometric.sysMon')}
                    </GhostText>
                    <span className={`text-[9px] font-mono ${timeStatus.color} tracking-wider`}>
                        {timeStatus.text}
                    </span>
                </div>
                <div className="h-[1px] w-full bg-gradient-to-r from-brand-primary/50 via-brand-primary/20 to-transparent" />
            </div>

            {/* Modules Container */}
            <div className="flex flex-col gap-5 lg:gap-6 flex-1 relative z-10 w-full">

                {/* 1. CORTEX — Neural processing load with live waveform */}
                <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-mono text-brand-secondary tracking-wider">{t('biometric.cortex')}</span>
                        <span className={`text-[10px] font-mono tabular-nums ${cortexLoad > 50 ? 'text-amber-400' : 'text-brand-primary'}`}>
                            {cortexLoad.toFixed(1)}%
                        </span>
                    </div>
                    <LiveBarChart value={cortexLoad} segments={10} />
                </div>

                {/* 2. SYNC — Neural synchronization rate + brain wave */}
                <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-mono text-brand-secondary tracking-wider">{t('biometric.sync')}</span>
                        <span className="text-[10px] font-mono text-brand-primary tabular-nums">
                            {syncRate.toFixed(1)}%
                        </span>
                    </div>
                    <div className="w-full border border-brand-primary/15 bg-brand-primary/[0.03] overflow-hidden">
                        <LiveWaveform height={24} type="brain" speed={0.8} amplitude={0.55} />
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[8px] font-mono text-text-muted">α {neuralFreq.toFixed(1)}Hz</span>
                        <span className={`text-[8px] font-mono ${glitch ? 'text-red-400' : 'text-green-400/60'}`}>
                            {glitch ? '△ JITTER' : t('biometric.stable')}
                        </span>
                    </div>
                </div>

                {/* 3. STRESS — Psychological load indicator */}
                <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-mono text-brand-secondary tracking-wider">{t('biometric.stress')}</span>
                        <span className={`text-[10px] font-mono tabular-nums ${stressLevel > 18 ? 'text-amber-400' : 'text-brand-secondary/70'}`}>
                            {stressLevel.toFixed(0)}%
                        </span>
                    </div>
                    {/* Thin stress bar with gradient color shift */}
                    <div className="w-full h-1 bg-brand-secondary/10 relative overflow-hidden">
                        <div
                            className="h-full transition-all duration-1000 ease-out"
                            style={{
                                width: `${stressLevel}%`,
                                background: stressLevel > 18
                                    ? 'linear-gradient(90deg, var(--color-brand-secondary), #fbbf24)'
                                    : 'var(--color-brand-secondary)',
                                opacity: 0.6,
                            }}
                        />
                    </div>
                </div>

                {/* 4. ENERGY — Battery-style segmented gauge */}
                <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex justify-between items-baseline">
                        <span className="text-[10px] font-mono text-brand-secondary tracking-wider">{t('biometric.energy')}</span>
                        <span className="text-[10px] font-mono text-brand-primary/60 tabular-nums">
                            {energyLevel.toFixed(0)}%
                        </span>
                    </div>
                    <div className="flex gap-[2px] w-full h-2.5">
                        {Array.from({ length: energySegments }, (_, i) => {
                            const isFilled = i < filledSegments;
                            const isEdge = i === filledSegments - 1;
                            return (
                                <div
                                    key={i}
                                    className={`h-full flex-1 border transition-all duration-700 ${isFilled
                                            ? `border-brand-primary/40 bg-brand-primary/35 ${isEdge ? 'animate-pulse' : ''}`
                                            : 'border-brand-primary/15 bg-transparent'
                                        }`}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* 5. VITALS — Live EKG heartbeat */}
                <div className="mt-auto mb-6 flex flex-col gap-1.5 pt-3 border-t border-brand-primary/10">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-text-muted">{t('biometric.vitals')}</span>
                        <span className="text-[10px] font-mono text-brand-primary tabular-nums">
                            ♥ <span className="animate-heartbeat">{heartRate.toFixed(0)}</span> BPM
                        </span>
                    </div>
                    <div className="w-full overflow-hidden border border-brand-primary/10 bg-brand-primary/[0.02]">
                        <LiveWaveform height={28} type="ekg" speed={1.2} amplitude={0.7} />
                    </div>
                </div>

            </div>
        </div>
    );
};
