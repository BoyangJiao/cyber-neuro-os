import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface ActualWaveformProps {
    audioUrl: string;
    isPlaying: boolean;
    playStartTime: number;
    isHovered: boolean;
    durationMs: number;
    barCount?: number;
    className?: string;
    color?: string;
}

export const ActualWaveform: React.FC<ActualWaveformProps> = ({
    audioUrl,
    isPlaying,
    playStartTime,
    isHovered,
    durationMs,
    barCount = 40,
    className,
    color = '#ff0055'
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [peaks, setPeaks] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const animationRef = useRef<number | undefined>(undefined);

    // Fetch and decode audio to get peaks
    useEffect(() => {
        let isCancelled = false;

        const fetchAndDecode = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(audioUrl);
                const arrayBuffer = await response.arrayBuffer();

                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext as any;
                const audioContext = new AudioContextClass();
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

                // Extract peaks from the first channel
                const channelData = audioBuffer.getChannelData(0);

                const FRONT_PAD_MS = 300;
                const BACK_PAD_MS = 500;
                const actualAudioDurMs = audioBuffer.duration * 1000;
                const totalDurMs = FRONT_PAD_MS + actualAudioDurMs + BACK_PAD_MS;

                const frontBars = Math.max(1, Math.floor(barCount * (FRONT_PAD_MS / totalDurMs)));
                const backBars = Math.max(1, Math.floor(barCount * (BACK_PAD_MS / totalDurMs)));
                const activeBars = Math.max(1, barCount - frontBars - backBars);

                const extractedPeaks: number[] = [];
                const step = Math.ceil(channelData.length / activeBars);

                for (let i = 0; i < activeBars; i++) {
                    let min = 1.0;
                    let max = -1.0;

                    const start = i * step;
                    const end = Math.min(start + step, channelData.length);

                    for (let j = start; j < end; j++) {
                        const datum = channelData[j];
                        if (datum < min) min = datum;
                        if (datum > max) max = datum;
                    }

                    extractedPeaks.push(Math.max(Math.abs(min), Math.abs(max)));
                }

                // Normalize peaks to 0-1
                const maxPeak = Math.max(...extractedPeaks, 0.01);
                const normalized = extractedPeaks.map(p => p / maxPeak);

                const finalPeaks = [
                    ...Array(frontBars).fill(0.02),
                    ...normalized,
                    ...Array(barCount - frontBars - activeBars).fill(0.02)
                ];

                if (!isCancelled) {
                    setPeaks(finalPeaks);
                    setIsLoading(false);
                }

            } catch (err) {
                console.warn('[ActualWaveform] Failed to load/decode audio for', audioUrl, err);
                if (!isCancelled) {
                    // Fallback to random static peaks if it fails (e.g. adblocker)
                    const fallback = Array.from({ length: barCount }).map(() => Math.random() * 0.5 + 0.1);
                    setPeaks(fallback);
                    setIsLoading(false);
                }
            }
        };

        fetchAndDecode();

        return () => {
            isCancelled = true;
        };
    }, [audioUrl, barCount]);

    // Draw the actual waveform onto the canvas with a sweeping playhead
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || peaks.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const renderLoop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(dpr, dpr);

            const FRONT_PAD_MS = 300;
            const BACK_PAD_MS = 500;
            const totalVisualDurMs = FRONT_PAD_MS + durationMs + BACK_PAD_MS;

            let progress = 0;
            if (isPlaying && playStartTime > 0) {
                const elapsed = Date.now() - playStartTime;
                progress = Math.min(elapsed / totalVisualDurMs, 1);
            }

            const width = rect.width;
            const height = rect.height;
            const actualBarCount = peaks.length;
            const barWidth = Math.max(1, (width / actualBarCount) - 1.5);

            peaks.forEach((peak, index) => {
                const minHeight = 2;
                const paddedHeight = height * 0.8;
                const barHeight = Math.max(minHeight, (peak * paddedHeight));

                const x = index * (width / actualBarCount);
                const y = (height - barHeight) / 2; // Center vertically

                const barProgressPosition = index / actualBarCount;
                if (isPlaying && progress >= barProgressPosition) {
                    ctx.fillStyle = color;
                    ctx.globalAlpha = 1.0;
                } else if (!isPlaying) {
                    ctx.fillStyle = color;
                    ctx.globalAlpha = 0.5;
                } else {
                    ctx.fillStyle = color;
                    ctx.globalAlpha = 0.2;
                }

                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, barHeight, 1);
                ctx.fill();
            });

            if (isPlaying && progress > 0 && progress < 1) {
                const playheadX = progress * width;
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#ffffff';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.rect(playheadX - 1, 0, 2, height);
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            ctx.restore();

            if (isPlaying) {
                animationRef.current = requestAnimationFrame(renderLoop);
            }
        };

        if (isPlaying) {
            animationRef.current = requestAnimationFrame(renderLoop);
        } else {
            renderLoop(); // draw static
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [peaks, isPlaying, playStartTime, durationMs, color]);

    const activeState = isHovered || isPlaying;

    return (
        <div className={twMerge("w-full h-full flex items-center justify-center relative", className)}>
            <motion.canvas
                ref={canvasRef}
                className="w-full h-full origin-center"
                initial={{ opacity: 0.5, scaleY: 0.5 }}
                animate={{
                    opacity: activeState ? 1 : 0.4,
                    scaleY: activeState ? 1 : 0.3
                }}
                transition={{ duration: 0.3 }}
            />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Tiny pulsing loader to show it's extracting data */}
                    <motion.div
                        className="w-full h-[1px] bg-brand-primary/50"
                        animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            )}
        </div>
    );
};
