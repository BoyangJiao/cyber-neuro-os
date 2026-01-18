import { type ReactNode, useRef, useEffect, type CSSProperties } from 'react';
import gsap from 'gsap';

export interface LinesFrameProps {
    children?: ReactNode;
    className?: string;
    /** Whether to animate the frame on mount */
    animate?: boolean;
}

/**
 * LinesFrame - HUD-style frame with top and bottom lines only
 * Lines draw from endpoints toward center (like Header divider)
 */
export const LinesFrame = ({ children, className, animate = true }: LinesFrameProps) => {
    const topLeftRef = useRef<SVGLineElement>(null);
    const topRightRef = useRef<SVGLineElement>(null);
    const bottomLeftRef = useRef<SVGLineElement>(null);
    const bottomRightRef = useRef<SVGLineElement>(null);

    const frameStyles = {
        '--frame-color': 'var(--color-brand-primary)',
    } as CSSProperties;

    // Entry animation: lines draw from edges toward center
    useEffect(() => {
        if (!animate) return;

        const lines = [topLeftRef.current, topRightRef.current, bottomLeftRef.current, bottomRightRef.current];
        if (lines.some(l => !l)) return;

        const ctx = gsap.context(() => {
            // Each line segment draws from its starting point toward center
            lines.forEach(line => {
                if (!line) return;
                const length = line.getTotalLength?.() || 100;
                gsap.fromTo(line,
                    { strokeDasharray: length, strokeDashoffset: length },
                    { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' }
                );
            });
        });

        return () => ctx.revert();
    }, [animate]);

    return (
        <div className={`relative h-full w-full ${className || ''}`} style={frameStyles}>
            {/* SVG Frame Layer - Top and Bottom lines only */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                preserveAspectRatio="none"
            >
                {/* Top line - split into left and right segments, drawing toward center */}
                <line ref={topLeftRef} x1="0" y1="0.5" x2="50%" y2="0.5"
                    stroke="var(--frame-color)" strokeWidth="1" strokeOpacity="0.6" />
                <line ref={topRightRef} x1="100%" y1="0.5" x2="50%" y2="0.5"
                    stroke="var(--frame-color)" strokeWidth="1" strokeOpacity="0.6" />

                {/* Bottom line - split into left and right segments, drawing toward center */}
                <line ref={bottomLeftRef} x1="0" y1="calc(100% - 0.5px)" x2="50%" y2="calc(100% - 0.5px)"
                    stroke="var(--frame-color)" strokeWidth="1" strokeOpacity="0.6" />
                <line ref={bottomRightRef} x1="100%" y1="calc(100% - 0.5px)" x2="50%" y2="calc(100% - 0.5px)"
                    stroke="var(--frame-color)" strokeWidth="1" strokeOpacity="0.6" />
            </svg>

            {/* Content Layer */}
            <div className="relative z-20 h-full w-full flex flex-col">
                {children}
            </div>
        </div>
    );
};
