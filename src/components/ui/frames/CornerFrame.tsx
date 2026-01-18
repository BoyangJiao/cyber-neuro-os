import { type ReactNode, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { twMerge } from 'tailwind-merge';

export interface CornerFrameProps {
    isActive?: boolean;
    isPressed?: boolean;
    children?: ReactNode;
    className?: string;
    strokeWidth?: number;
    cornerSize?: number;
    color?: string;
}

export const CornerFrame = ({
    isActive = true,
    isPressed = false,
    children,
    className,
    strokeWidth = 2,
    cornerSize = 12,
    color = 'var(--color-brand-primary)'
}: CornerFrameProps) => {
    // Refs for the 4 separate corner elements
    const tlRef = useRef<SVGPathElement>(null);
    const trRef = useRef<SVGPathElement>(null);
    const blRef = useRef<SVGPathElement>(null);
    const brRef = useRef<SVGPathElement>(null);
    const animRef = useRef<gsap.core.Timeline | null>(null);

    // Initial Draw Animation (Entry)
    useEffect(() => {
        const corners = [tlRef.current, trRef.current, blRef.current, brRef.current];
        // Strict check: if any corner is missing, do not animate
        if (corners.some(c => !c)) return;

        const ctx = gsap.context(() => {
            if (isActive) {
                const totalLength = (cornerSize || 12) * 2.5; // Default fallback
                gsap.set(corners, {
                    strokeDasharray: totalLength,
                    strokeDashoffset: totalLength,
                    opacity: 1
                });
                gsap.to(corners, {
                    strokeDashoffset: 0,
                    duration: 0.8,
                    stagger: 0.05,
                    ease: 'power2.out'
                });
            } else {
                gsap.set(corners, { opacity: 0 });
            }
        });
        return () => ctx.revert();
    }, [isActive, cornerSize]);

    // Press/Lock-on Animation
    useEffect(() => {
        const tl = tlRef.current;
        const tr = trRef.current;
        const bl = blRef.current;
        const br = brRef.current;
        if (!tl || !tr || !bl || !br) return;

        if (animRef.current) animRef.current.kill();

        // Check if elements are still in DOM roughly (refs should be enough)

        if (isPressed) {
            animRef.current = gsap.timeline()
                .to(tl, { x: 4, y: 4, ease: 'back.out(2)' }, 0)
                .to(tr, { x: -4, y: 4, ease: 'back.out(2)' }, 0)
                .to(bl, { x: 4, y: -4, ease: 'back.out(2)' }, 0)
                .to(br, { x: -4, y: -4, ease: 'back.out(2)' }, 0);
        } else {
            animRef.current = gsap.timeline()
                .to([tl, tr, bl, br], { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
        }
    }, [isPressed]);

    const VisualContent = (
        <div className={twMerge("absolute inset-0 pointer-events-none transition-all duration-300 overflow-visible", className)}>
            {/* Top Left */}
            <div className="absolute top-0 left-0">
                <svg width={cornerSize} height={cornerSize} viewBox={`0 0 ${cornerSize} ${cornerSize}`} style={{ overflow: 'visible' }}>
                    <path
                        ref={tlRef}
                        d={`M1 ${cornerSize} L1 1 L${cornerSize} 1`}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="square"
                    />
                </svg>
            </div>
            {/* Top Right */}
            <div className="absolute top-0 right-0">
                <svg width={cornerSize} height={cornerSize} viewBox={`0 0 ${cornerSize} ${cornerSize}`} style={{ overflow: 'visible' }}>
                    <path
                        ref={trRef}
                        d={`M${cornerSize - 1} ${cornerSize} L${cornerSize - 1} 1 L0 1`}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="square"
                    />
                </svg>
            </div>
            {/* Bottom Left */}
            <div className="absolute bottom-0 left-0">
                <svg width={cornerSize} height={cornerSize} viewBox={`0 0 ${cornerSize} ${cornerSize}`} style={{ overflow: 'visible' }}>
                    <path
                        ref={blRef}
                        d={`M1 0 L1 ${cornerSize - 1} L${cornerSize} ${cornerSize - 1}`}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="square"
                    />
                </svg>
            </div>
            {/* Bottom Right */}
            <div className="absolute bottom-0 right-0">
                <svg width={cornerSize} height={cornerSize} viewBox={`0 0 ${cornerSize} ${cornerSize}`} style={{ overflow: 'visible' }}>
                    <path
                        ref={brRef}
                        d={`M${cornerSize - 1} 0 L${cornerSize - 1} ${cornerSize - 1} L0 ${cornerSize - 1}`}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="square"
                    />
                </svg>
            </div>
        </div>
    );

    if (children) {
        return (
            <>
                <div className="absolute inset-0 z-10 pointer-events-none transition-all duration-300 overflow-visible">
                    {VisualContent}
                </div>
                <div className="relative z-20 h-full w-full flex flex-col">
                    {children}
                </div>
            </>
        );
    }

    return VisualContent;
};

