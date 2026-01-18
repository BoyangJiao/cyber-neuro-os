import { twMerge } from 'tailwind-merge';

export interface CyberLineProps {
    className?: string;
    variant?: 'surface' | 'hud';
}

export const CyberLine = ({ className, variant = 'surface' }: CyberLineProps) => {
    const baseStyles = "w-full relative";

    if (variant === 'surface') {
        return (
            <div className={twMerge("h-[3px] flex items-center justify-between", baseStyles, className)}>
                {/* Left Cap - Bright with primary glow */}
                <div className="w-4 h-[1px] bg-[var(--color-brand-secondary)] shadow-[0_0_6px_var(--color-brand-primary),0_0_8px_var(--color-brand-glow)]" />

                {/* Main Line */}
                <div className="h-[1px] bg-[var(--color-brand-primary)]/30 flex-grow mx-px" />

                {/* Right Cap - Bright with primary glow */}
                <div className="w-4 h-[1px] bg-[var(--color-brand-secondary)] shadow-[0_0_6px_var(--color-brand-primary),0_0_8px_var(--color-brand-glow)]" />
            </div>
        );
    }

    if (variant === 'hud') {
        const strokeColor = "var(--color-brand-primary)";

        return (
            <div className={twMerge("h-[24px] flex items-center justify-center", baseStyles, className)}>
                {/* Left Connector Group */}
                <div className="flex items-center h-full grow basis-0 min-w-[20px]">
                    {/* End Cap */}
                    <div className="w-4 h-[2px] bg-[var(--color-brand-secondary)] shrink-0" />
                    <div className="w-1 h-1 shrink-0" /> {/* Spacer */}
                    <div className="w-4 h-[2px] bg-[var(--color-brand-secondary)]/50 shrink-0" />

                    {/* Top Line connects to slope */}
                    <div className="h-[1px] bg-[var(--color-brand-primary)]/30 flex-grow relative top-[0.5px]" />
                </div>

                {/* Central Dip Section (Wide) */}
                <div className="flex items-end h-full w-[65%] shrink-0 relative">
                    {/* Left Slope: 45-degree angle down */}
                    <svg width="12" height="100%" viewBox="0 0 12 24" fill="none" className="shrink-0" preserveAspectRatio="none">
                        <path d="M0 12 L12 24" stroke={strokeColor} strokeWidth={1} style={{ vectorEffect: 'non-scaling-stroke', opacity: 0.4 }} />
                    </svg>

                    {/* Bottom Line - no margin, directly connected */}
                    <div className="h-[1px] bg-[var(--color-brand-primary)]/40 flex-grow relative" />

                    {/* Right Slope: 45-degree angle up */}
                    <svg width="12" height="100%" viewBox="0 0 12 24" fill="none" className="shrink-0" preserveAspectRatio="none">
                        <path d="M0 24 L12 12" stroke={strokeColor} strokeWidth={1} style={{ vectorEffect: 'non-scaling-stroke', opacity: 0.4 }} />
                    </svg>
                </div>

                {/* Right Connector Group */}
                <div className="flex items-center h-full grow basis-0 min-w-[20px] flex-row-reverse">
                    {/* End Cap */}
                    <div className="w-4 h-[2px] bg-[var(--color-brand-secondary)] shrink-0" />
                    <div className="w-1 h-1 shrink-0" /> {/* Spacer */}
                    <div className="w-4 h-[2px] bg-[var(--color-brand-secondary)]/50 shrink-0" />

                    {/* Top Line connects to slope */}
                    <div className="h-[1px] bg-[var(--color-brand-primary)]/30 flex-grow relative top-[0.5px]" />
                </div>
            </div>
        );
    }

    return null;
};
