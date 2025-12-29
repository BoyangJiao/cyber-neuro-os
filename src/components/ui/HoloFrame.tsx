import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export interface HoloFrameProps {
    children: ReactNode;
    className?: string;
    type?: 'corner' | 'outline';
    deco?: boolean;
}

export const HoloFrame = ({
    children,
    className,
    type = 'corner',
    deco = true,
}: HoloFrameProps) => {
    const baseStyles = "relative p-8 transition-all duration-300 group";

    const typeStyles = {
        corner: "bg-cyber-900/40",
        outline: "border border-cyan-500/30 bg-cyber-900/10",
    };

    const mergedClasses = twMerge(
        baseStyles,
        typeStyles[type],
        className
    );

    return (
        <div className={mergedClasses}>
            {/* Decorative Elements */}
            {type === 'corner' && (
                <div className="absolute inset-0 pointer-events-none z-0">
                    {/* Main Border Box (Offset) */}
                    <div className="absolute inset-0.5 border border-cyan-900/50 opacity-50" />

                    {/* Corner Brackets */}
                    <svg className="absolute top-0 left-0 w-6 h-6 text-cyan-500" viewBox="0 0 24 24" fill="none">
                        <path d="M2 22V2H22" stroke="currentColor" strokeWidth="2" />
                        {deco && <rect x="5" y="5" width="4" height="4" fill="currentColor" className="opacity-60" />}
                    </svg>
                    <svg className="absolute top-0 right-0 w-6 h-6 text-cyan-500" viewBox="0 0 24 24" fill="none">
                        <path d="M22 22V2H2" stroke="currentColor" strokeWidth="2" />
                        {deco && <path d="M16 5L20 9" stroke="currentColor" strokeWidth="1" className="opacity-60" />}
                    </svg>
                    <svg className="absolute bottom-0 left-0 w-6 h-6 text-cyan-500" viewBox="0 0 24 24" fill="none">
                        <path d="M2 2V22H22" stroke="currentColor" strokeWidth="2" />
                        {deco && <rect x="5" y="15" width="4" height="4" fill="currentColor" className="opacity-60" />}
                    </svg>
                    <svg className="absolute bottom-0 right-0 w-6 h-6 text-cyan-500" viewBox="0 0 24 24" fill="none">
                        <path d="M22 2V22H2" stroke="currentColor" strokeWidth="2" />
                        {deco && <path d="M16 19L20 15" stroke="currentColor" strokeWidth="1" className="opacity-60" />}
                    </svg>
                </div>
            )}

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};
