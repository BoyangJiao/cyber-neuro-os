import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '../../i18n';

// ============================================================
// Organic value generators
// ============================================================

const useDriftValue = (min: number, max: number, speed: number = 1) => {
    const [value, setValue] = useState((min + max) / 2);
    const phaseRef = useRef(Math.random() * Math.PI * 2);

    useEffect(() => {
        let frame: number;
        const animate = () => {
            const t = Date.now() / 1000;
            const p = phaseRef.current;
            const raw =
                Math.sin(t * 0.3 * speed + p) * 0.4 +
                Math.sin(t * 0.7 * speed + p * 2.1) * 0.3 +
                Math.sin(t * 1.3 * speed + p * 0.7) * 0.2 +
                Math.sin(t * 0.13 * speed + p * 3.3) * 0.1;
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
// 1. TELEMETRY: UPLINK LATENCY
// ============================================================

const TelemetryTracker = () => {
    const { t } = useTranslation();
    const [latency, setLatency] = useState(12);
    const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now();
            const dt = now - lastMousePos.current.time;
            if (dt > 50) {
                const dx = e.clientX - lastMousePos.current.x;
                const dy = e.clientY - lastMousePos.current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const velocity = Math.min(distance / dt, 10); // cap velocity

                // Jitter baseline 12ms up to 45ms based on mouse velocity
                const targetLatency = 12 + Math.random() * (velocity * 3);

                setLatency(prev => {
                    // Smooth lerp
                    const next = prev + (targetLatency - prev) * 0.8;
                    return Math.max(8, Math.min(99, next));
                });

                lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };
            }
        };

        // Decay back to baseline when idle
        const decayInterval = setInterval(() => {
            setLatency(prev => {
                if (prev > 14) return prev - (prev - 12) * 0.2;
                return 12 + Math.random() * 2; // Ambient tick
            });
            // Update time to prevent huge dt on next move
            lastMousePos.current.time = Date.now();
        }, 300);

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(decayInterval);
        };
    }, []);

    return (
        <div className="flex items-center gap-2 mb-1 w-full mt-1">
            <div className="w-1.5 h-1.5 rounded-sm bg-brand-primary animate-pulse" />
            <span className="text-[10px] font-mono text-text-muted tracking-wider">
                {t('biometric.sysMon')} : <span className="text-brand-primary">{t('biometric.active')}</span>
            </span>
            <span className="text-[10px] font-mono text-brand-secondary ml-auto tabular-nums">
                {t('biometric.uplink')}: {Math.round(latency)}ms
            </span>
        </div>
    );
};

// ============================================================
// 2. CORTEX_LOAD: 6 Vertical Independent Bars
// ============================================================

const CORTEX_LABELS = ['TXT', 'PIX', 'MOT', 'BGM', 'SFX', 'VEC'] as const;

// Route-specific stable baselines for each media type
//                                   TXT  PIX  MOT  BGM  SFX  VEC
// Home: 6 image cards, GSAP entrance animation, SVG card frames, no audio
// Projects: project titles+descriptions, thumbnails, page transitions, SVG UI
// Music: minimal text, album art, player animation, continuous BGM, click SFX
// Games: ROM labels, cartridge images, WebAssembly emulator (heavy), game audio
// Synthesis: wave labels, canvas waveforms, playback animations, dense SFX triggers
// Lab: tool labels, few images, interactive tool motion, SVG-heavy decorations
// About: massive text (bio), radar SVG chart, minimal motion, no audio
const getBaseTargets = (path: string) => {
    if (path === '/' || path === '/cyber-neuro-os/') return [20, 55, 40, 10, 10, 60]; // Home
    if (path.includes('/project')) return [70, 80, 35, 10, 10, 25]; // Work/Detail
    if (path.includes('/lab')) return [25, 20, 65, 10, 30, 75]; // Lab
    if (path.includes('/synthesis')) return [15, 10, 45, 10, 90, 55]; // Synthesis
    if (path.includes('/music')) return [15, 45, 30, 90, 20, 25]; // Music
    if (path.includes('/simulation') || path.includes('/games')) return [15, 60, 90, 55, 65, 30]; // Games
    if (path.includes('/about')) return [90, 15, 15, 10, 10, 65]; // About
    return [30, 30, 30, 30, 30, 30]; // Fallback
};

const CortexBarChart = () => {
    const { t } = useTranslation();
    const location = useLocation();

    // Smooth tracked bar heights, initialized exactly to current route
    const initialTargets = getBaseTargets(location.pathname);
    const [bars, setBars] = useState<number[]>(initialTargets);

    // Internal refs for the physics engine
    const scrollBaseline = useRef(0);
    const lastScrollY = useRef(0);
    const targetsRef = useRef<number[]>(initialTargets);
    const currentValsRef = useRef<number[]>(initialTargets);

    // Track scroll velocity
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            const dy = Math.abs(currentY - lastScrollY.current);
            scrollBaseline.current = Math.min(dy * 4, 90); // Max scroll burst addition
            lastScrollY.current = currentY;
        };

        const decay = setInterval(() => {
            if (scrollBaseline.current > 0) {
                scrollBaseline.current = Math.max(0, scrollBaseline.current - 5);
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(decay);
        };
    }, []);

    // Set stable base targets based on route
    useEffect(() => {
        const stableTargets = getBaseTargets(location.pathname);

        // Add a deterministic route-transition spike (simulates loading impact)
        const spikeOffsets = [25, 30, 20, 15, 20, 25];
        targetsRef.current = stableTargets.map((b, i) => Math.min(100, b + spikeOffsets[i]));

        // After a moment, settle down strictly to the true stable baseline
        const settleTimer = setTimeout(() => {
            targetsRef.current = stableTargets;
        }, 1200);

        return () => clearTimeout(settleTimer);
    }, [location.pathname]);

    // Animate bars towards targets using lerp, factoring in scroll
    useEffect(() => {
        let frame: number;

        const animate = () => {
            currentValsRef.current = currentValsRef.current.map((current, i) => {
                const label = CORTEX_LABELS[i];
                let target = targetsRef.current[i];

                // Active scroll adds a dynamic load spike
                if (scrollBaseline.current > 0) {
                    const scrollImpact = (label === 'MOT' || label === 'PIX' || label === 'TXT')
                        ? scrollBaseline.current
                        : scrollBaseline.current * 0.3;
                    target = Math.min(100, target + scrollImpact);
                }

                // Lerp towards target (no random jitter — bars are fully stable when idle)
                const diff = target - current;
                if (Math.abs(diff) < 0.3) return target; // Snap when close enough

                const speed = scrollBaseline.current > 0 ? 0.15 : 0.05;
                const next = current + diff * speed;

                return Math.max(5, Math.min(100, next));
            });

            setBars([...currentValsRef.current]);
            frame = requestAnimationFrame(animate);
        };

        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);

    const avgLoad = bars.reduce((a, b) => a + b, 0) / bars.length;

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-[10px] font-mono text-brand-secondary tracking-wider">{t('biometric.cortexLoad')}</span>
                <span className={`text-[10px] font-mono tabular-nums ${avgLoad > 60 ? 'text-amber-400' : 'text-brand-primary'}`}>
                    {avgLoad.toFixed(1)}%
                </span>
            </div>
            {/* 6 Bars container */}
            <div className="flex items-start justify-between w-full h-[88px] px-1 mt-1 pr-3">
                {bars.map((h, i) => (
                    <div key={i} className="flex flex-col items-center h-full relative" style={{ width: '9%' }}>
                        {/* Top Cap */}
                        <div className="w-full h-[3px] bg-brand-primary/80 mb-1 flex-shrink-0" />

                        {/* Bar Wrapper */}
                        <div className="w-full flex-1 bg-brand-primary/15 relative flex items-end">
                            {/* Filled portion */}
                            <div
                                className="w-full bg-brand-primary/80 transition-[height] duration-75"
                                style={{ height: `${h}%` }}
                            />
                            {/* Pointer tracking the height */}
                            <div
                                className="absolute -right-[12px] text-[8px] text-brand-primary/80 font-mono tracking-tighter transition-[bottom] duration-75 translate-y-1/2"
                                style={{ bottom: `${h}%` }}
                            >
                                &lt;-
                            </div>
                        </div>

                        {/* Bottom Caps */}
                        <div className="w-full h-[2px] bg-brand-primary/80 mt-1 flex-shrink-0" />
                        <div className="w-full h-[3px] bg-brand-primary/80 mt-[2px] flex-shrink-0" />

                        {/* Micro Label */}
                        <div className="text-[7px] text-brand-primary/50 font-mono tracking-tighter mt-1 uppercase scale-90">
                            {CORTEX_LABELS[i]}
                        </div>

                        {/* Rightmost decorator only on the last bar */}
                        {i === 5 && (
                            <div className="absolute top-2 bottom-6 -right-6 flex flex-col justify-between py-1">
                                {[...Array(6)].map((_, j) => (
                                    <div key={j} className="w-[3px] h-[3px] border border-brand-primary/60" />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============================================================
// 3. SYNC_RATIO: Continuous Sine Wave 
// ============================================================

const SyncSineWave = ({ glitchRate }: { glitchRate: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        const obs = new ResizeObserver(resize);
        obs.observe(canvas);

        let animationFrame: number;
        let phase = 0;

        const animate = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            ctx.clearRect(0, 0, width, height);

            // Time variables
            phase += glitchRate ? 0.2 : 0.05;

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
            ctx.lineWidth = 1.5;

            const midY = height / 2;
            const amp = (height / 2) * 0.8;
            const freq = glitchRate ? 0.08 : 0.03;
            const startX = 22;

            // 1. Draw Y-axis labels
            ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
            ctx.font = '8px monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';

            const labels = [
                { text: '1.0', y: midY - amp },
                { text: '0.5', y: midY - amp / 2 },
                { text: '0.5', y: midY + amp / 2 },
                { text: '1.0', y: midY + amp }
            ];

            labels.forEach(l => {
                ctx.fillText(l.text, 0, l.y);
            });

            // 2. Draw Ticks and Center Line
            ctx.beginPath();
            labels.forEach(l => {
                ctx.moveTo(17, l.y);
                ctx.lineTo(20, l.y);
            });
            // center line from tick to end
            ctx.moveTo(17, midY);
            ctx.lineTo(width, midY);
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // 3. Draw the Sine Wave (Beat frequency for amplitude modulation)
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
            ctx.lineWidth = 1.5;

            const getWaveY = (x: number) => {
                const wave1 = Math.sin((x - startX) * freq + phase * 1.5);
                const wave2 = Math.sin((x - startX) * (freq * 1.15) + phase * 1.5);
                return midY + ((wave1 + wave2) / 2) * amp; // Beating effect
            };

            for (let x = startX; x < width; x++) {
                let y = getWaveY(x);

                // Add micro-noise during glitch
                if (glitchRate) {
                    y += (Math.random() - 0.5) * 4;
                    // Horizontal slice breaks occasionally
                    if (Math.random() > 0.98) continue;
                }

                if (x === startX) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // 4. Glow line on top
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.9)';
            ctx.lineWidth = 0.5;
            for (let x = startX; x < width; x++) {
                const y = getWaveY(x);
                if (x === startX) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            animationFrame = requestAnimationFrame(animate);
        };

        animate();
        return () => {
            cancelAnimationFrame(animationFrame);
            obs.disconnect();
        };
    }, [glitchRate]);

    return <canvas ref={canvasRef} className="w-full h-20" />;
};

const SyncRatio = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [glitching, setGlitching] = useState(false);
    const syncVal = useDriftValue(98.1, 99.9, 0.3);

    // Glitch on route change
    useEffect(() => {
        setGlitching(true);
        const timer = setTimeout(() => setGlitching(false), 1200);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-mono text-brand-secondary tracking-wider">{t('biometric.syncRatio')}</span>
                <span className={`text-[10px] font-mono tabular-nums ${glitching ? 'text-amber-400 animate-pulse' : 'text-brand-primary'}`}>
                    {glitching ? t('biometric.aligning') : `${syncVal.toFixed(2)}%`}
                </span>
            </div>
            <SyncSineWave glitchRate={glitching} />
        </div>
    );
};

// ============================================================
// 4. COGNITIVE_LOAD: Hexagon Dual Row Grid (Static indicator)
// ============================================================

const Hexagon = ({ state }: { state: 'active' | 'filled' | 'empty' }) => {
    const isAct = state === 'active';
    const isFil = state === 'filled';

    const outerClass = isAct
        ? 'stroke-white'
        : isFil
            ? 'stroke-white/80'
            : 'stroke-white/30';

    const innerClass = isAct
        ? 'fill-white'
        : isFil
            ? 'fill-white/40'
            : 'fill-white/10';

    return (
        <svg width="36" height="12" viewBox="0 0 36 12" className="inline-block flex-shrink-0">
            {/* Outer Ring */}
            <polygon
                points="1,6 8,1 28,1 35,6 28,11 8,11"
                className={`fill-transparent ${outerClass} stroke-[1.5px] transition-colors duration-1000`}
                strokeLinejoin="round"
            />
            {/* Inner Core */}
            <polygon
                points="5,6 10,3 26,3 31,6 26,9 10,9"
                className={`${innerClass} transition-colors duration-1000`}
            />
        </svg>
    );
};

const CognitiveLoad = () => {
    const { t } = useTranslation();
    const totalHexes = 16;
    const filledHexes = 10;

    // Define the stagger pattern based on reference (wide 3 rows)
    const rows = [
        { count: 5, dots: true },
        { count: 6, dots: false },
        { count: 5, dots: true },
    ];

    let currentIdx = 0;

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-[10px] font-mono text-brand-secondary tracking-wider">{t('biometric.cogLoad')}</span>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono text-text-muted">{t('biometric.archiveCap')}</span>
                    <span className="text-[10px] font-mono text-brand-primary/70">
                        {filledHexes}/{totalHexes}
                    </span>
                </div>
            </div>

            {/* Hexagon Grid Container */}
            <div className="relative w-full py-1 flex items-center justify-center scale-95 origin-center -ml-2">
                <div className="flex flex-col gap-[1px]">
                    {rows.map((r, rowIdx) => {
                        const cols = [];
                        for (let i = 0; i < r.count; i++) {
                            const idx = currentIdx++;
                            const isFilled = idx < filledHexes;
                            // Match a few active/white states from the design
                            const isActive = idx === 4 || idx === 8 || idx === 11 || idx === 14;

                            cols.push(
                                <Hexagon key={idx} state={isActive ? 'active' : isFilled ? 'filled' : 'empty'} />
                            );
                        }
                        return (
                            <div key={rowIdx} className="flex items-center justify-center gap-[4px] w-full">
                                {r.dots && <div className="w-[3px] h-[3px] bg-white/60 rotate-45 mr-1" />}
                                {cols}
                                {r.dots && <div className="w-[3px] h-[3px] bg-white/60 rotate-45 ml-1" />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


// ============================================================
// 5. VITALS & TEMP: Spiky Area Chart connected to hovering
// ============================================================

const VitalsAreaChart = ({ stressLevel }: { stressLevel: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const historyRef = useRef<number[]>(new Array(40).fill(0));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        // Skip observer here since parent handles width usually, but just in case
        window.addEventListener('resize', resize);

        let animationFrame: number;
        let tick = 0;

        const animate = () => {
            tick++;
            // Push new data point every few frames to simulate chart moving left
            if (tick % 5 === 0) {
                // Generate next point based on stress level
                // 0 is bottom, 1 is peak
                let nextVal = 0;
                if (Math.random() < stressLevel) {
                    // Create a sharp spike based on stress
                    nextVal = 0.2 + Math.random() * 0.8;
                } else {
                    // Small ambient noise
                    nextVal = Math.random() * 0.1;
                }

                historyRef.current.shift();
                historyRef.current.push(nextVal);
            }

            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            ctx.clearRect(0, 0, width, height);

            // Draw dot grid background
            ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
            for (let gx = 10; gx < width; gx += 15) {
                for (let gy = 10; gy < height; gy += 15) {
                    ctx.fillRect(gx, gy, 1, 1);
                }
            }

            // Draw Area Chart
            const step = width / (historyRef.current.length - 1);

            ctx.beginPath();
            ctx.moveTo(0, height);

            historyRef.current.forEach((val, i) => {
                const x = i * step;
                const y = height - (val * height * 0.85) - 2; // Keep slightly off bottom
                ctx.lineTo(x, y);
            });

            ctx.lineTo(width, height);
            ctx.closePath();

            // Gradient Fill
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
            gradient.addColorStop(1, 'rgba(0, 240, 255, 0.05)');
            ctx.fillStyle = gradient;
            ctx.fill();

            // Sharp Top Stroke
            ctx.beginPath();
            historyRef.current.forEach((val, i) => {
                const x = i * step;
                const y = height - (val * height * 0.85) - 2;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.9)';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Base line dashed
            ctx.beginPath();
            ctx.setLineDash([10, 5, 2, 5]);
            ctx.moveTo(0, height - 1);
            ctx.lineTo(width, height - 1);
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
            ctx.stroke();
            ctx.setLineDash([]);

            animationFrame = requestAnimationFrame(animate);
        };

        animate();
        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', resize);
        };
    }, [stressLevel]);

    return <canvas ref={canvasRef} className="w-full h-16 border-b border-brand-primary/20" />;
};

const VitalsTempMonitor = () => {
    const { t } = useTranslation();
    const [bpm, setBpm] = useState(68);
    const [temp, setTemp] = useState(36.5);
    const [stressRate, setStressRate] = useState(0.05); // Chance of sharp spike
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Track active session time for temp rise
    useEffect(() => {
        const start = Date.now();
        const iv = setInterval(() => {
            const minutes = (Date.now() - start) / 60000;
            const newTemp = 36.5 + Math.min(minutes * 0.05, 2.4); // max 38.9
            setTemp(newTemp);
        }, 10000);
        return () => clearInterval(iv);
    }, []);

    // Track hovers/clicks globally for Heart Rate
    useEffect(() => {
        let isClicking = false;

        const handleStressClick = () => {
            isClicking = true;
            setBpm(115 + Math.random() * 15);
            setStressRate(0.8); // Very high chance of sharp spikes
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        };

        const handleStressHover = () => {
            if (isClicking) return;
            setBpm(85 + Math.random() * 10);
            setStressRate(0.2); // Medium, occasional spikes
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        };

        const handleStressOff = () => {
            isClicking = false;
            hoverTimeoutRef.current = setTimeout(() => {
                setBpm(65 + Math.random() * 5); // back to baseline
                setStressRate(0.05); // low ambient noise
            }, 600);
        };

        // Attach listeners to interactive elements
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('button, a, [role="button"], input, .interactive-el')) {
                handleStressHover();
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('button, a, [role="button"], input, .interactive-el')) {
                handleStressOff();
            }
        };

        const handleGlobalMouseDown = () => {
            handleStressClick();
        }

        const handleGlobalMouseUp = () => {
            handleStressOff();
        }

        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);
        document.addEventListener('mousedown', handleGlobalMouseDown);
        document.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
            document.removeEventListener('mousedown', handleGlobalMouseDown);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, []);

    // Ambient floating of baseline BPM
    useEffect(() => {
        const ambient = setInterval(() => {
            if (stressRate < 0.1) {
                setBpm(prev => prev + (Math.random() - 0.5) * 3);
            }
        }, 2000);
        return () => clearInterval(ambient);
    }, [stressRate]);

    return (
        <div className="mt-auto mb-2 flex flex-col w-full relative pt-2">
            <div className="flex justify-between items-end mb-2">
                <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-brand-secondary tracking-wider">{t('biometric.coreTemp')}</span>
                    <span className={`text-[11px] font-mono tabular-nums ${temp > 38 ? 'text-amber-400' : 'text-brand-primary/80'}`}>
                        {temp.toFixed(1)}°C
                    </span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-mono text-text-muted">{t('biometric.vitals')}</span>
                    <span className={`text-[12px] font-mono tabular-nums ${stressRate > 0.3 ? 'text-brand-primary animate-pulse' : 'text-brand-primary'}`}>
                        {bpm.toFixed(0)} <span className="text-[9px]">BPM</span>
                    </span>
                </div>
            </div>

            <VitalsAreaChart stressLevel={stressRate} />
        </div>
    );
};


// ============================================================
// Main Component
// ============================================================

export const BiometricMonitor = () => {
    return (
        <div className="flex flex-col h-full w-full relative overflow-hidden px-4">

            {/* Header Line - Keeps structure tight */}
            <div className="w-full h-[1px] bg-gradient-to-r from-brand-primary/40 to-transparent mt-1 mb-3" />

            <div className="flex flex-col gap-6 lg:gap-8 flex-1 relative z-10 w-full">

                {/* 1. Global / Telemetry */}
                <TelemetryTracker />

                {/* 2. Cortex Load (CPU / Scroll mapping) */}
                <CortexBarChart />

                {/* 3. Sync Ratio (Network / Smooth wave) */}
                <SyncRatio />

                {/* 4. Cognitive Load (Memory / Hexagon Grid) */}
                <CognitiveLoad />

                {/* 5. Vitals & Temp (Area chart / Hover spiking) */}
                <VitalsTempMonitor />

            </div>
        </div>
    );
};
