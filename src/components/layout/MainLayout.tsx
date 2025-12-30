import { type ReactNode } from 'react';
import { CyberLine } from '../ui/CyberLine';
import { CyberButton } from '../ui/CyberButton';
import { Animator } from '@arwes/react';

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <Animator>
            <div className="relative w-screen h-screen bg-neutral-950 overflow-hidden font-sans text-cyan-50 selection:bg-cyan-500/30 flex flex-col">

                {/* --- BACKGROUND LAYERS --- */}
                {/* Removed GridLines and Puffs */}

                {/* --- FOREGROUND CONTENT --- */}

                {/* 3. Header: Fixed height at top */}
                <header className="relative z-50 flex-none w-full border-b border-cyan-900/30 bg-cyber-950/80 backdrop-blur-sm">
                    <div className="flex items-center justify-between px-10 h-20 w-full">
                        {/* Left: Branding */}
                        <div className="flex items-center gap-4">
                            <i className="ri-brain-line text-cyan-400 text-3xl animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"></i>
                            <div className="flex flex-col leading-none">
                                <h1 className="text-2xl font-display font-bold tracking-[0.2em] text-cyan-50">
                                    CYBER <span className="text-cyan-400">NEUROSPACE</span>
                                </h1>
                                <span className="text-[9px] font-mono text-cyan-600 tracking-[0.4em] uppercase">System v2.0.4</span>
                            </div>
                        </div>

                        {/* Right: Status Info */}
                        <div className="flex items-center gap-8">
                            {/* Network Status */}
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[9px] font-mono text-cyan-700 tracking-widest uppercase">Network Status</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_5px_rgba(52,211,153,0.8)] animate-pulse"></div>
                                    <span className="text-xs font-mono text-emerald-400 font-bold tracking-wider">ONLINE_SECURE</span>
                                </div>
                            </div>

                            {/* Vertical Divider */}
                            <div className="h-8 w-[1px] bg-cyan-800/40"></div>

                            {/* Time */}
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[9px] font-mono text-cyan-700 tracking-widest uppercase">Local Time</span>
                                <span className="text-xl font-display font-medium text-cyan-300 tracking-widest tabular-nums">15:42</span>
                            </div>
                        </div>
                    </div>

                    {/* Header Decorative Bottom Line */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <CyberLine variant="surface" className="w-full opacity-50" />
                    </div>
                </header>

                {/* 4. Main Body: Flex-1 to fill remaining space */}
                <main className="relative z-10 flex-1 w-full overflow-hidden p-8 lg:p-12">
                    {/* Inner Container: Sets the bounds but allows full width usage */}
                    <div className="w-full h-full relative">
                        {children}
                    </div>
                </main>

                {/* Decorative Footer Indicators (Fixed overlay) */}
                <div className="fixed bottom-6 left-8 z-0 flex flex-col gap-1 pointer-events-none opacity-40">
                    <div className="h-[2px] w-4 bg-cyan-600"></div>
                    <div className="h-[2px] w-4 bg-cyan-600 translate-x-2"></div>
                    <div className="text-[9px] font-mono text-cyan-600 mt-2 tracking-widest">SYS_READY</div>
                </div>
            </div>
        </Animator>
    );
};
