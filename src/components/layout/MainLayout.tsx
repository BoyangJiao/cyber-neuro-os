import { type ReactNode } from 'react';
import { CyberLine } from '../ui/CyberLine';
import { Header } from './Header';
import { Animator } from '@arwes/react';

interface MainLayoutProps {
    children: ReactNode;
    footer?: ReactNode;
}

export const MainLayout = ({ children, footer }: MainLayoutProps) => {
    return (
        <Animator>
            <div className="relative w-screen h-screen bg-neutral-950 overflow-hidden font-sans text-cyan-50 selection:bg-cyan-500/30 flex flex-col">

                {/* --- BACKGROUND LAYERS --- */}
                {/* Removed GridLines and Puffs */}

                {/* --- FOREGROUND CONTENT --- */}

                {/* 3. Header: Fixed height at top */}
                <Header />

                {/* 4. Main Body: Flex-1 to fill remaining space */}
                <main className="relative z-10 flex-1 w-full min-h-0 overflow-y-auto px-10 py-6">
                    {/* Inner Container: Sets the bounds but allows full width usage */}
                    <div className="w-full h-full relative">
                        {children}
                    </div>
                </main>

                {/* Footer: Fixed height at bottom with rotated HUD line */}
                <footer className="relative z-50 flex-none w-full">
                    {/* Footer Decorative Top Line - Rotated 180° */}
                    <div className="absolute top-0 left-10 right-10 rotate-180">
                        <CyberLine variant="hud" className="w-full" />
                    </div>

                    {/* Footer Content */}
                    <div className="flex items-center justify-between px-10 h-24 w-full">
                        {footer ? (
                            footer
                        ) : (
                            <>
                                {/* Left: System Status */}
                                <div className="flex items-center gap-4 opacity-60">
                                    <div className="flex items-center gap-2">
                                        <div className="h-[2px] w-4 bg-cyan-600"></div>
                                        <div className="h-[2px] w-4 bg-cyan-600 translate-x-[-4px]"></div>
                                    </div>
                                    <span className="text-[9px] font-mono text-cyan-600 tracking-widest uppercase">SYS_READY</span>
                                </div>

                                {/* Right: Version Info */}
                                <div className="flex items-center gap-4 opacity-60">
                                    <span className="text-[9px] font-mono text-cyan-700 tracking-widest uppercase">NEURAL_CORE_ACTIVE</span>
                                </div>
                            </>
                        )}
                    </div>
                </footer>
            </div>
        </Animator>
    );
};
