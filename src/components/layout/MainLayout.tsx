import { type ReactNode } from 'react';
import { Header } from './Header';
import { useLayoutMetrics } from '../../hooks/useLayoutMetrics';

interface MainLayoutProps {
    children: ReactNode;
    footer?: ReactNode;
}

export const MainLayout = ({ children, footer }: MainLayoutProps) => {
    // Dynamically measure header/footer and set CSS variables
    useLayoutMetrics();

    return (
        <div className="relative w-full h-screen bg-transparent overflow-hidden font-sans text-cyan-50 selection:bg-cyan-500/30 flex flex-col">

            {/* 3. Header: Fixed height at top */}
            <header id="site-header" className="relative z-50 flex-none w-full">
                <Header />
            </header>

            {/* 4. Main Body: Flex-1 to fill remaining space, NO horizontal padding here */}
            <main className="relative z-10 flex-1 w-full min-h-0 overflow-y-auto py-3 lg:py-4 xl:py-6">
                {/* Inner Container: Max-width + centered + horizontal padding (Basement.studio style) */}
                <div className="w-full h-full relative max-w-[1920px] mx-auto px-4 lg:px-6 xl:px-10 2xl:px-12">
                    {children}
                </div>
            </main>

            {/* Footer: Fixed height at bottom */}
            <footer id="site-footer" className="relative z-50 flex-none w-full pb-4">
                {/* Footer Content - 48px height, bottom aligned */}
                <div className="flex items-end justify-between px-4 lg:px-6 xl:px-10 h-auto w-full">
                    {footer ? (
                        footer
                    ) : (
                        <>
                            {/* Left: System Status */}
                            <div className="flex items-center gap-4 opacity-60">
                                <div className="flex items-center gap-2">
                                    <div className="h-[2px] w-4 bg-brand-secondary"></div>
                                    <div className="h-[2px] w-4 bg-brand-secondary translate-x-[-4px]"></div>
                                </div>
                                <span className="text-[9px] font-mono text-brand-secondary tracking-widest uppercase">SYS_READY</span>
                            </div>

                            {/* Right: Version Info */}
                            <div className="flex items-center gap-4 opacity-60">
                                <span className="text-[9px] font-mono text-text-muted tracking-widest uppercase">NEURAL_CORE_ACTIVE</span>
                            </div>
                        </>
                    )}
                </div>
            </footer>
        </div>
    );
};
