import { type ReactNode } from 'react';
import { Header } from './Header';
import { CyberLine } from '../ui/CyberLine';
import { useLayoutMetrics } from '../../hooks/useLayoutMetrics';
import { useTranslation } from '../../i18n';

interface MainLayoutProps {
    children: ReactNode;
    footer?: ReactNode;
}

export const MainLayout = ({ children, footer }: MainLayoutProps) => {
    // Dynamically measure header/footer and set CSS variables
    useLayoutMetrics();
    const { t } = useTranslation();

    return (
        // h-dvh (not h-screen): mobile browser address bars shrink the visual
        // viewport; 100vh would push the footer below the fold on iOS Safari
        <div className="relative w-full h-dvh bg-transparent overflow-hidden font-sans text-cyan-50 selection:bg-cyan-500/30 flex flex-col">

            {/* 3. Header: Fixed height at top — mobile gets an explicit fill so
                header/footer read as one chrome frame around the content */}
            <header id="site-header" className="relative z-50 flex-none w-full max-lg:bg-[#020406]/90">
                <Header />
            </header>

            {/* 4. Main Body: Flex-1 to fill remaining space, NO horizontal padding here */}
            <main className="relative z-10 flex-1 w-full min-h-0 overflow-y-auto no-scrollbar py-3 lg:py-4 xl:py-6">
                {/* Inner Container: Full width for custom layouts */}
                <div className="w-full h-full relative">
                    {children}
                </div>
            </main>

            {/* Footer: Fixed height at bottom — tight bottom padding on mobile
                (Safari's own chrome already adds a gap we can't remove) */}
            <footer
                id="site-footer"
                className="relative z-50 flex-none w-full pb-[max(0.375rem,env(safe-area-inset-bottom))] lg:pb-4 max-lg:bg-[#020406]/90"
            >
                {/* Mobile: top divider mirroring the header's bottom line */}
                <div className="lg:hidden mx-4">
                    <CyberLine variant="surface" className="w-full" />
                </div>
                {/* Footer Content - 48px height, bottom aligned */}
                <div className="flex items-end justify-between px-4 lg:px-6 xl:px-8 2xl:px-10 h-auto w-full">
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
                                <span className="text-[9px] font-mono text-brand-secondary tracking-widest uppercase">{t('layout.sysReady')}</span>
                            </div>

                            {/* Right: Version Info */}
                            <div className="flex items-center gap-4 opacity-60">
                                <span className="text-[9px] font-mono text-text-muted tracking-widest uppercase">{t('layout.neuralCoreActive')}</span>
                            </div>
                        </>
                    )}
                </div>
            </footer>
        </div>
    );
};
