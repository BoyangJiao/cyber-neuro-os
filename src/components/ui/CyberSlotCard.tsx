import { useState, useRef, useCallback, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { PixelGridEffect } from './effects';

export type GlitchType = 'heavy' | 'rgb' | 'slice' | 'vertical' | 'subtle' | 'standard';

export interface CyberSlotCardProps {
    title: string;
    subtitle?: string;
    inactiveImage: string;
    activeImage: string;
    onClick?: () => void;
    className?: string;
    glitchType?: GlitchType;
    bgSize?: string;
    isFocused?: boolean;
    isRevealed?: boolean;
    isErrorState?: boolean;
    isIntroPlaying?: boolean;
}

// ─── Dynamic Binary Ticker Line ───────────────────────────────────────
const DecodingBinaryStream = ({ active }: { active: boolean }) => {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        if (!active) {
            setLines([]);
            return;
        }

        // Add initial blanks so it "flows in"
        let currentLines: string[] = [];

        const interval = setInterval(() => {
            const newLine = Math.floor(Math.random() * 16).toString(2).padStart(4, '0');
            currentLines = [newLine, ...currentLines].slice(0, 5);
            setLines(currentLines);
        }, 80);

        return () => clearInterval(interval);
    }, [active]);

    return (
        <div
            className={twMerge(
                "absolute top-8 right-3 font-mono text-[0.6rem] leading-[1.4] text-right flex flex-col items-end z-20 pointer-events-none transition-opacity duration-300",
                active ? "opacity-100" : "opacity-0"
            )}
        >
            <span className="text-[var(--color-brand-primary)] mb-1">-</span>
            {lines.map((l, i) => (
                <span
                    key={i}
                    className="text-[var(--color-brand-primary)]"
                    style={{ opacity: 1 - i * 0.15 }} // fade out older lines
                >
                    {l}
                </span>
            ))}
        </div>
    );
};

export const CyberSlotCard = ({
    title,
    subtitle = '//Design',
    inactiveImage,
    activeImage,
    onClick,
    className,
    bgSize = '70%',
    isFocused = false,
    isRevealed = false,
    isErrorState = false,
    isIntroPlaying = false,
}: CyberSlotCardProps) => {
    const [scanProgress, setScanProgress] = useState(0);
    const animationRef = useRef<number | null>(null);

    const startScan = useCallback(() => {
        if (animationRef.current || scanProgress === 100) return;

        const duration = 400; // ms
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            setScanProgress(progress);

            if (progress < 100) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                animationRef.current = null;
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    }, [scanProgress]);

    const handleMouseEnter = () => {
        startScan();
    };

    const handleMouseLeave = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        setScanProgress(0);
    };

    // Three-tier visual state logic:
    // Tier 1 (Default/Queued): dim border, dim image, all effects off
    // Tier 2 (Focused): bright border + title + image, but NO scan effects (no binary stream, no access granted, no pixel grid)
    // Tier 3 (Revealed/Hover-scanned): full activation with scan line, binary stream, pixel grid, access granted
    // Tier 3 (Revealed/Hover-scanned): full activation with scan line, binary stream, pixel grid, access granted
    const isScanComplete = scanProgress === 100;  // Only true when actual hover scan finishes
    const isActivated = isRevealed || isScanComplete; // Full activation = hover scan complete OR revealed state

    // Only switch to danger when actually hover-activated; focus state stays normal cyan
    const highlightColor = (isErrorState && isActivated) ? 'var(--color-status-danger)' : 'var(--color-brand-primary)';
    const glowColor = (isErrorState && isActivated) ? 'var(--color-status-danger)' : 'var(--color-brand-glow)';

    const getGlitchStyle = () => {
        if (!isActivated) return {};
        // Error state: slightly more noticeable but still subtle
        if (isErrorState) return { animation: 'glitchMicro 3s steps(1) infinite' };
        // All normal cards use the same subtle, barely-perceptible random glitch
        return { animation: 'glitchMicro 4s steps(1) infinite' };
    };

    return (
        // Wrapper enforces aspect ratio 160:280 (4:7) to match point matrix proportions
        <div
            className={twMerge("relative w-full aspect-[4/7] cursor-pointer group select-none transition-transform duration-300", className)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{ transformStyle: "preserve-3d" }}
        >
            {/* 0. Volumetric Thickness (Rear Glass Edge) */}
            <svg width="160" height="280" viewBox="0 0 160 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" style={{ transform: "translateZ(-12px)", zIndex: -30 }}>
                <g fill="var(--color-brand-primary)" opacity={0.06}>
                    <path fillRule="evenodd" clipRule="evenodd" d="M53.0433 280H8.97564L0 271.745V271.657L0.143032 27.124H114.883L143.288 1H160V279.956H109.77L102.57 273.335H60.3025L53.0433 280ZM9.16634 279.561H52.8407L60.0998 272.885H102.761L109.96 279.507H159.511V1.42755H143.479L115.074 27.5516H0.607894L0.464862 271.559L9.16634 279.561Z" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M110.905 21H0V0H133L110.905 21ZM0.4632 20.5567H110.703L131.848 0.443H0.4632V20.5567Z" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M156 276H114.271L105.706 268.102H57.6518L50.8142 274.407H13.6715L6 267.333V31.2542H117.023L145.481 5H156V276ZM114.366 275.78H155.762V5.2197H145.589L117.118 31.4739H6.23825V267.245L13.7668 274.198H50.7189L57.5566 267.882H105.801L114.366 275.78Z" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M108.369 18H5V4H123L108.369 18ZM5.2387 17.7736H108.274L122.427 4.215H5.2387V17.7736Z" />
                </g>
            </svg>

            {/* 0. Volumetric Thickness (Middle Glass Edge) */}
            <svg width="160" height="280" viewBox="0 0 160 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" style={{ transform: "translateZ(-6px)", zIndex: -20 }}>
                <g fill="var(--color-brand-primary)" opacity={0.15}>
                    <path fillRule="evenodd" clipRule="evenodd" d="M53.0433 280H8.97564L0 271.745V271.657L0.143032 27.124H114.883L143.288 1H160V279.956H109.77L102.57 273.335H60.3025L53.0433 280ZM9.16634 279.561H52.8407L60.0998 272.885H102.761L109.96 279.507H159.511V1.42755H143.479L115.074 27.5516H0.607894L0.464862 271.559L9.16634 279.561Z" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M110.905 21H0V0H133L110.905 21ZM0.4632 20.5567H110.703L131.848 0.443H0.4632V20.5567Z" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M156 276H114.271L105.706 268.102H57.6518L50.8142 274.407H13.6715L6 267.333V31.2542H117.023L145.481 5H156V276ZM114.366 275.78H155.762V5.2197H145.589L117.118 31.4739H6.23825V267.245L13.7668 274.198H50.7189L57.5566 267.882H105.801L114.366 275.78Z" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M108.369 18H5V4H123L108.369 18ZM5.2387 17.7736H108.274L122.427 4.215H5.2387V17.7736Z" />
                </g>
            </svg>

            {/* 1. Underlying Base Background for Image Masking (Holographic Glass Body) */}
            <div
                className="absolute inset-x-[6px] inset-y-[5px] bg-[#020813]/50 backdrop-blur-md"
                style={{ transform: "translateZ(-2px)", zIndex: -10, boxShadow: "inset 0 0 30px rgba(0, 255, 255, 0.05)" }}
            />

            {/* 2. SVG Frame Container (Front Sharp Edge) */}
            <svg
                width="160"
                height="280"
                viewBox="0 0 160 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                preserveAspectRatio="none"
                style={{ transform: "translateZ(0px)" }}
            >
                <g
                    className={twMerge(
                        "transition-colors transition-opacity",
                        isIntroPlaying ? "duration-300" : "duration-300"
                    )}
                    fill={highlightColor}
                    opacity={isActivated ? 1 : isFocused ? 0.9 : 0.4}
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M53.0433 280H8.97564L0 271.745V271.657L0.143032 27.124H114.883L143.288 1H160V279.956H109.77L102.57 273.335H60.3025L53.0433 280ZM9.16634 279.561H52.8407L60.0998 272.885H102.761L109.96 279.507H159.511V1.42755H143.479L115.074 27.5516H0.607894L0.464862 271.559L9.16634 279.561Z"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M110.905 21H0V0H133L110.905 21ZM0.4632 20.5567H110.703L131.848 0.443H0.4632V20.5567Z"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M156 276H114.271L105.706 268.102H57.6518L50.8142 274.407H13.6715L6 267.333V31.2542H117.023L145.481 5H156V276ZM114.366 275.78H155.762V5.2197H145.589L117.118 31.4739H6.23825V267.245L13.7668 274.198H50.7189L57.5566 267.882H105.801L114.366 275.78Z"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M108.369 18H5V4H123L108.369 18ZM5.2387 17.7736H108.274L122.427 4.215H5.2387V17.7736Z"
                    />
                </g>

                {/* Bottom Solid Block — activates with glow when scan complete (Access Granted sync) */}
                <path
                    d="M59 280L63.0321 276H101.027L105 279.941L59 280Z"
                    fill={highlightColor}
                    className="transition-all duration-500"
                    opacity={isActivated ? 1 : 0.1}
                    style={{
                        filter: isActivated ? `drop-shadow(0 0 6px ${glowColor})` : 'none',
                    }}
                />
            </svg>

            {/* 3. Top-Left Title */}
            <div
                className="absolute z-20 pointer-events-none flex items-center pr-[1%]"
                style={{
                    top: '1.42%',   // 4 / 280
                    left: '3.1%',   // 5 / 160
                    width: '73%',   // ~117 / 160
                    height: '5%',   // 14 / 280
                }}
            >
                <h3 className={twMerge(
                    "font-display text-[clamp(10px,4cqw,14px)] font-bold tracking-[0.2em] uppercase truncate w-full pl-[5%]",
                    "transition-colors",
                    isIntroPlaying ? "duration-300" : "duration-300",
                    isActivated ? "opacity-100" : isFocused ? "opacity-100" : "opacity-50"
                )} style={{
                    color: isActivated ? (isErrorState ? highlightColor : 'var(--color-text-accent)') : highlightColor,
                    textShadow: isActivated ? `0 0 8px ${glowColor}` : 'none',
                    lineHeight: 1,
                    marginTop: '2px'
                }}>
                    {title}
                </h3>
            </div>

            {/* 4. Center Image Container */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[4px] z-0">
                {/* 4.0 Point Matrix Background Layer — only on hover/revealed (Tier 3) */}
                <div
                    className={twMerge(
                        "absolute inset-[6px] transition-opacity duration-300 pointer-events-none",
                        isActivated ? "opacity-100" : "opacity-0"
                    )}
                    style={{
                        maskImage: 'radial-gradient(ellipse at center, black 65%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 65%, transparent 100%)'
                    }}
                >
                    <PixelGridEffect active={isActivated} color={highlightColor} className="opacity-15 mix-blend-screen" />
                </div>
                {/* Inactive Background — brightness responds to focus tier */}
                <div
                    className="absolute inset-0 bg-center bg-no-repeat mix-blend-screen transition-opacity duration-300"
                    style={{
                        backgroundImage: `url('${inactiveImage}')`,
                        backgroundSize: bgSize,
                        opacity: isActivated ? (isErrorState ? 0.4 : 0.15) : isFocused ? 0.75 : 0.45
                    }}
                />

                {/* Active Background - Rendered by Scanline ClipPath */}
                <div
                    className={twMerge(
                        "absolute inset-0 bg-center bg-no-repeat mix-blend-screen",
                        isErrorState
                            ? "drop-shadow-[0_0_10px_var(--color-status-danger)]"
                            : "drop-shadow-[0_0_8px_var(--color-brand-glow)]"
                    )}
                    style={{
                        backgroundImage: `url('${isErrorState ? inactiveImage : activeImage}')`,
                        clipPath: `polygon(0 0, 100% 0, 100% ${scanProgress}%, 0 ${scanProgress}%)`,
                        backgroundSize: bgSize,
                        ...getGlitchStyle()
                    }}
                />

                {/* Standard Scanline UI — visible during hover scan */}
                {scanProgress > 0 && scanProgress < 100 && (
                    <div
                        className="absolute inset-x-0 h-[3px] pointer-events-none z-10"
                        style={{
                            top: `${scanProgress}%`,
                            backgroundColor: highlightColor,
                            boxShadow: `0 0 15px ${glowColor}`
                        }}
                    />
                )}
            </div>

            {/* 5. Left Vertical Tag: [ Access Waiting/Granted/Denied ] */}
            <div className="absolute bottom-[20px] left-[10px] z-20 pointer-events-none">
                <div className={twMerge(
                    "[writing-mode:vertical-rl] rotate-180 text-[10px] font-mono tracking-widest transition-colors duration-300 whitespace-nowrap",
                    isActivated ? (isErrorState ? "text-status-danger" : "text-[var(--color-brand-primary)]") : "text-white/40"
                )}>
                    [ {isActivated ? (isErrorState ? "Access Denied" : "Access Granted") : "Access Waiting"} ]
                </div>
            </div>

            {/* 6. Right Bottom Subtitle */}
            {subtitle && (
                <div className={twMerge(
                    "absolute bottom-[10px] right-3 z-20 pointer-events-none transition-colors duration-300",
                    isActivated ? (isErrorState ? "text-status-danger" : "text-[var(--color-brand-primary)]") : isFocused ? "text-white/60" : "text-white/30"
                )}>
                    <span className="text-[9px] font-mono tracking-wider">
                        {subtitle}
                    </span>
                </div>
            )}

            {/* 7. Top Right Dynamic Binary Stream — only on Tier 3 (hover/revealed) */}
            {isActivated && !isErrorState && <DecodingBinaryStream active={isActivated} />}
            {isActivated && isErrorState && (
                <div className="absolute top-[18%] right-3 font-mono text-[8px] leading-[1.6] text-right flex flex-col items-end z-20 pointer-events-none text-status-danger opacity-70 animate-pulse">
                    <div>ERR_0x9A</div>
                    <div>NO_AUTH</div>
                </div>
            )}
        </div>
    );
};
