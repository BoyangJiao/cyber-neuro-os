import { twMerge } from 'tailwind-merge';

interface ShimmerLoaderProps {
    className?: string;
    show?: boolean; // Control visibility externally
    variant?: 'default' | 'overlay'; // default: inline block, overlay: absolute cover
    label?: string;
}

/**
 * ShimmerLoader - A cyberpunk-style loading skeleton
 * 
 * Features:
 * - Scanning line animation (shimmer-scan)
 * - Dot grid background pattern
 * - Pulsing "LOADING FEED..." text
 * - Seamless fade-out via CSS transitions
 */
export const ShimmerLoader = ({
    className,
    show = true,
    variant = 'overlay',
    label = 'LOADING FEED...'
}: ShimmerLoaderProps) => {
    return (
        <div className={twMerge(
            "transition-opacity duration-500 z-10",
            variant === 'overlay' ? "absolute inset-0" : "relative w-full h-full",
            show ? "opacity-100" : "opacity-0 pointer-events-none",
            className
        )}>
            <div className="w-full h-full bg-[var(--color-bg-surface)] relative overflow-hidden">
                {/* Scanning line animation */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-brand-primary)]/10 to-transparent animate-[shimmer-scan_2s_ease-in-out_infinite]" />

                {/* Grid dots */}
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(var(--color-brand-primary) 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                }} />

                {/* Center loading text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-mono text-[var(--color-brand-primary)]/50 tracking-[0.3em] animate-pulse">
                        {label}
                    </span>
                </div>
            </div>
        </div>
    );
};
