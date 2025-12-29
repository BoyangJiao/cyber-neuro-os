import type { ReactNode } from 'react';
import { CyberLine } from '../ui/CyberLine';
import { CyberButton } from '../ui/CyberButton';

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="relative min-h-screen w-full bg-cyber-950 overflow-hidden font-sans text-cyan-50 selection:bg-cyan-500/30">
            {/* Background Grid Overlay */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(0, 240, 255, 0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                }}
            />

            {/* Top Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 flex flex-col pointer-events-none">
                <div className="flex items-center justify-between px-8 py-4 pointer-events-auto bg-gradient-to-b from-cyber-950/90 to-transparent backdrop-blur-sm">
                    {/* Left: Branding */}
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                        <h1 className="text-xl font-display font-bold tracking-[0.2em] text-cyan-100">
                            CYBER<span className="text-cyan-600">NEURO</span>
                        </h1>
                    </div>

                    {/* Center: Status / Clock */}
                    <div className="flex items-center gap-8 text-xs font-mono text-cyan-500/60 tracking-widest">
                        <span>SYS.STATUS: <span className="text-cyan-400">ONLINE</span></span>
                        <span>NET: <span className="text-cyan-400">SECURE</span></span>
                        <span>MEM: <span className="text-cyan-400">OTPT</span></span>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        <CyberButton variant="dot" size="sm" onClick={() => console.log('Settings')}>
                            SETTINGS
                        </CyberButton>
                        <CyberButton variant="ghost" size="sm" onClick={() => console.log('Logout')}>
                            LOGOUT
                        </CyberButton>
                    </div>
                </div>

                {/* Separator Line */}
                <div className="px-4">
                    <CyberLine variant="surface" className="w-full opacity-50" />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 w-full h-screen pt-24 px-8 pb-8 overflow-y-auto scrollbar-hide">
                <div className="max-w-7xl mx-auto h-full">
                    {children}
                </div>
            </main>

            {/* Decorative Side Elements */}
            <div className="fixed left-4 bottom-8 z-0 flex flex-col gap-2 opacity-30 text-[10px] font-mono writing-mode-vertical text-cyan-500">
                <span>SYSTEM READY</span>
                <span>V.1.0.4</span>
            </div>
        </div>
    );
};
