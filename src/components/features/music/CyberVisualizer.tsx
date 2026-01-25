import { useEffect, useRef } from 'react';

interface CyberVisualizerProps {
    isPlaying: boolean;
    color?: string;
    bpm?: number;
}

export const CyberVisualizer = ({ isPlaying, color = "#00f0ff", bpm = 120 }: CyberVisualizerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        // 64 bands
        const bands = 64;
        let bars: number[] = new Array(bands).fill(0);

        // Physics state
        const timeRef = { current: 0 };
        const beatInterval = 60 / bpm; // seconds per beat

        const render = (timestamp: number) => {
            const width = canvas.width;
            const height = canvas.height;
            timeRef.current = timestamp;

            ctx.clearRect(0, 0, width, height);

            // Calculate beat pulse (0 to 1 saw/sine wave based on timestamp)
            const beatPhase = (timestamp / 1000) % beatInterval;
            const beatStrength = Math.max(0, 1 - (beatPhase / beatInterval)); // Sawtooth decay

            // Generate visual data
            if (isPlaying) {
                bars = bars.map((prev, i) => {
                    // Base noise: Perlin-ish noise using sine waves
                    const noise = Math.sin(timestamp * 0.005 + i * 0.2) * 0.5 + 0.5;
                    const highFreq = Math.random() * 0.3;

                    // Beat impact: boost low frequencies (left side) more on beat
                    const isBass = i < bands / 4;
                    const beatBoost = isBass ? (beatStrength * height * 0.6) : (beatStrength * height * 0.2);

                    // Target height with multiple influences
                    let target = (noise * height * 0.5) + beatBoost + (highFreq * height * 0.2);

                    // Cap max height
                    target = Math.min(target, height);

                    // Smooth physics (Attack / Decay)
                    // Attack is fast (0.4), Decay is slower (0.1)
                    const lerpFactor = target > prev ? 0.4 : 0.1;
                    return prev + (target - prev) * lerpFactor;
                });
            } else {
                // Decay to baseline
                bars = bars.map(prev => prev * 0.9);
            }

            // Draw bars
            const barWidth = width / bars.length;
            const gap = 3; // Wider gap for cleaner look

            ctx.fillStyle = color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = color; // Glow effect

            bars.forEach((h, i) => {
                const x = i * barWidth;
                // Center vertical alignment

                // Draw bar
                // Add a small minimum height
                const renderH = Math.max(h, 2);
                const renderY = (height - renderH) / 2;

                ctx.fillRect(x + gap / 2, renderY, barWidth - gap, renderH);
            });

            animationId = requestAnimationFrame(render);
        };

        requestAnimationFrame(render);

        return () => cancelAnimationFrame(animationId);
    }, [isPlaying, color, bpm]);

    return (
        <canvas
            ref={canvasRef}
            width={600}
            height={300}
            className="w-full h-full object-cover opacity-80 mix-blend-screen"
        />
    );
};
