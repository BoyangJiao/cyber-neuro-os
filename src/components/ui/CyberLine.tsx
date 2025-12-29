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
                {/* Left Cap */}
                <div className="w-[3px] h-[3px] bg-[var(--color-cyan-400)] shadow-[0_0_8px_var(--color-cyan-400)]" />

                {/* Main Line */}
                <div className="h-[1px] bg-cyan-100/50 flex-grow shadow-[0_0_4px_var(--color-cyan-400)] mx-px" />

                {/* Right Cap */}
                <div className="w-[3px] h-[3px] bg-[var(--color-cyan-400)] shadow-[0_0_8px_var(--color-cyan-400)]" />
            </div>
        );
    }

    if (variant === 'hud') {
        const strokeColor = "rgba(22, 78, 99, 0.6)"; // cyan-900/60
        return (
            <div className={twMerge("h-[16px] flex items-center justify-center", baseStyles, className)}>
                {/* Left Connector Group */}
                <div className="flex items-center h-full grow basis-0 min-w-[20px]">
                    {/* End Cap */}
                    <div className="w-[3px] h-full bg-cyan-500/80 shrink-0" />
                    <div className="w-[2px] h-full shrink-0" /> {/* Spacer */}
                    <div className="w-[1px] h-[60%] bg-cyan-500/50 shrink-0" />

                    {/* Top Line connects to slope */}
                    <div className="h-[1px] bg-cyan-900/60 flex-grow mx-1 relative top-[0.5px]" />
                </div>

                {/* Central Dip Section (Wide) */}
                <div className="flex items-end h-full w-[65%] shrink-0 relative">
                    {/* Left Slope: Starts at Top (50%) -> Bottom (100%) */}
                    <svg width="10" height="100%" viewBox="0 0 10 16" fill="none" className="shrink-0 overflow-visible">
                        <path d="M0 8.5 L10 15.5" stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    </svg>

                    {/* Bottom Line */}
                    <div className="h-[1px] bg-cyan-900/60 flex-grow mb-[0.5px] relative">
                        {/* Center Highlight */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-[2px] bg-cyan-500 shadow-[0_0_6px_var(--color-cyan-500)]" />
                    </div>

                    {/* Right Slope: Starts at Bottom (100%) -> Top (50%) */}
                    <svg width="10" height="100%" viewBox="0 0 10 16" fill="none" className="shrink-0 overflow-visible">
                        <path d="M0 15.5 L10 8.5" stroke={strokeColor} strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    </svg>
                </div>

                {/* Right Connector Group */}
                <div className="flex items-center h-full grow basis-0 min-w-[20px] flex-row-reverse">
                    {/* End Cap */}
                    <div className="w-[3px] h-full bg-cyan-500/80 shrink-0" />
                    <div className="w-[2px] h-full shrink-0" /> {/* Spacer */}
                    <div className="w-[1px] h-[60%] bg-cyan-500/50 shrink-0" />

                    {/* Top Line connects to slope */}
                    <div className="h-[1px] bg-cyan-900/60 flex-grow mx-1 relative top-[0.5px]" />
                </div>
            </div>
        );
    }

    return null;
};
