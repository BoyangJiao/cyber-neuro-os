import { type ReactNode } from 'react';

export interface DotsFrameProps {
    children?: ReactNode;
}

export const DotsFrame = ({ children }: DotsFrameProps) => {
    return (
        <div className="relative h-full w-full">
            {/* Background Layer - Solid Core with Deep Mist 
                1. -inset-2: Slightly expanded solid core so dots sit comfortably "inside".
                2. bg-neutral-950/90: High opacity for the "solid" feel requested.
                3. shadow-[...]: Thick, heavy black shadow to create the surrounding "black fog".
            */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundColor: 'var(--color-bg-app)',
                    boxShadow: '0 0 24px 16px var(--color-bg-app)'
                }}
            />

            {/* Corner Dots Layer - No connecting border */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Top Left */}
                <div className="absolute -top-[1.5px] -left-[1.5px] w-[6px] h-[3px] bg-[var(--color-brand-primary)] shadow-[0_0_6px_var(--color-brand-glow)]" />
                {/* Top Right */}
                <div className="absolute -top-[1.5px] -right-[1.5px] w-[6px] h-[3px] bg-[var(--color-brand-primary)] shadow-[0_0_6px_var(--color-brand-glow)]" />
                {/* Bottom Left */}
                <div className="absolute -bottom-[1.5px] -left-[1.5px] w-[6px] h-[3px] bg-[var(--color-brand-primary)] shadow-[0_0_6px_var(--color-brand-glow)]" />
                {/* Bottom Right */}
                <div className="absolute -bottom-[1.5px] -right-[1.5px] w-[6px] h-[3px] bg-[var(--color-brand-primary)] shadow-[0_0_6px_var(--color-brand-glow)]" />
            </div>

            {/* Content Content by Content */}
            <div className="relative z-20 h-full w-full flex flex-col p-4">
                {children}
            </div>
        </div>
    );
};
