/**
 * NeuralLogo — Animated 2D Neural Node Brand Logo
 *
 * A hexagonal neural-network logo with looping sci-fi animations:
 * - Slow-rotating outer ring with stroke-draw effect
 * - Counter-rotating inner hexagon with nodes & lines grouped together
 * - Pulsing center node with glow
 * - Arwes-inspired subtle, organic feel
 */

import { useMemo } from 'react';

interface NeuralLogoProps {
    /** Width/height of the logo container */
    size?: number;
    /** CSS class name */
    className?: string;
}

// Inner hex vertices (relative to 32,32 center)
const INNER_HEX = [
    { x: 32, y: 12 },
    { x: 48, y: 21 },
    { x: 48, y: 43 },
    { x: 32, y: 52 },
    { x: 16, y: 43 },
    { x: 16, y: 21 },
];

export const NeuralLogo = ({ size = 64, className = '' }: NeuralLogoProps) => {
    const id = useMemo(() => `nl-${Math.random().toString(36).slice(2, 7)}`, []);

    return (
        <div
            className={`relative inline-flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
        >
            {/* Ambient glow */}
            <div
                className="absolute inset-0 rounded-full animate-[neuralPulseGlow_4s_ease-in-out_infinite]"
                style={{
                    background: 'radial-gradient(circle, var(--color-brand-primary) 0%, transparent 70%)',
                    opacity: 0.12,
                    filter: 'blur(8px)',
                }}
            />

            <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full relative z-10"
            >
                <defs>
                    <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* ── Layer 1: Outer hexagon — slow rotation ── */}
                <g className="animate-[neuralRotate_20s_linear_infinite]" style={{ transformOrigin: '32px 32px' }}>
                    <polygon
                        points="32,2 58,17 58,47 32,62 6,47 6,17"
                        stroke="var(--color-brand-primary)"
                        strokeWidth="0.8"
                        fill="none"
                        opacity="0.35"
                        strokeDasharray="180"
                        className="animate-[neuralDraw_8s_ease-in-out_infinite]"
                    />
                </g>

                {/* ── Layer 2: Inner hexagon + connection lines + outer nodes — ALL rotate together ── */}
                <g className="animate-[neuralRotateReverse_16s_linear_infinite]" style={{ transformOrigin: '32px 32px' }}>
                    {/* Inner hexagon shape */}
                    <polygon
                        points={INNER_HEX.map(p => `${p.x},${p.y}`).join(' ')}
                        stroke="var(--color-brand-primary)"
                        strokeWidth="1"
                        fill="var(--color-brand-primary)"
                        fillOpacity="0.06"
                        strokeDasharray="140"
                        className="animate-[neuralDrawInner_6s_ease-in-out_infinite]"
                    />

                    {/* Connection lines from center to each hex vertex */}
                    {INNER_HEX.map((vertex, i) => {
                        // Direction vector from center (32,32) to vertex, shortened to start from r=6 (center core edge)
                        const dx = vertex.x - 32;
                        const dy = vertex.y - 32;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const startX = 32 + (dx / dist) * 6;
                        const startY = 32 + (dy / dist) * 6;
                        return (
                            <line
                                key={`line-${i}`}
                                x1={startX}
                                y1={startY}
                                x2={vertex.x}
                                y2={vertex.y}
                                stroke="var(--color-brand-primary)"
                                strokeWidth="0.7"
                                strokeDasharray="22"
                                className="animate-[neuralLinePulse_3s_ease-in-out_infinite]"
                                style={{ animationDelay: `${i * 0.4}s` }}
                            />
                        );
                    })}

                    {/* Outer node dots at each hex vertex */}
                    {INNER_HEX.map((vertex, i) => (
                        <circle
                            key={`dot-${i}`}
                            cx={vertex.x}
                            cy={vertex.y}
                            r="1.8"
                            fill="var(--color-brand-primary)"
                            className="animate-[neuralNodePulse_3s_ease-in-out_infinite]"
                            style={{ animationDelay: `${i * 0.5}s` }}
                        />
                    ))}
                </g>

                {/* ── Layer 3: Center core — pulsing glow (non-rotating) ── */}
                <g filter={`url(#${id}-glow)`}>
                    <circle
                        cx="32"
                        cy="32"
                        r="5"
                        fill="var(--color-brand-primary)"
                        fillOpacity="0.15"
                        stroke="var(--color-brand-secondary)"
                        strokeWidth="1"
                        className="animate-[neuralCoreBreath_4s_ease-in-out_infinite]"
                    />
                    <circle
                        cx="32"
                        cy="32"
                        r="2"
                        fill="var(--color-brand-secondary)"
                        className="animate-[neuralCorePulse_2s_ease-in-out_infinite]"
                    />
                </g>
            </svg>
        </div>
    );
};
