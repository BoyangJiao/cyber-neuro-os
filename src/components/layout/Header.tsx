import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CyberLine } from '../ui/CyberLine';
import { GhostText } from '../ui/GhostText';
import { NeuralLogo } from '../ui/NeuralLogo';
import { useTranslation } from '../../i18n';
import { useSoundSystem } from '../../hooks/useSoundSystem';
import { InterceptModal } from '../ui/modals/InterceptModal';
import { useAppStore } from '../../store/useAppStore';

// ─── Navigation Node Data ──────────────────────────────────
interface NavNodeData {
    id: string;
    titleKey: string;
    link?: string;
}

const NAV_NODES: NavNodeData[] = [
    { id: 'project', titleKey: 'features.project', link: '/projects' },
    { id: 'game', titleKey: 'features.game', link: '/games' },
    { id: 'music', titleKey: 'features.music', link: '/music' },
    { id: 'lab', titleKey: 'features.lab', link: '/lab' },
    { id: 'sound', titleKey: 'features.sound', link: '/synthesis' },
    { id: 'video', titleKey: 'features.video' },
];

// ─── Diamond Icon ──────────────────────────────────────────
const DiamondIcon = ({ active }: { active: boolean }) => (
    <div className="relative w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">
        <div
            className="absolute w-3 h-3 transition-all duration-300"
            style={{
                transform: 'rotate(45deg)',
                border: `1px solid var(--color-brand-primary)`,
                opacity: active ? 0.9 : 0.25,
                background: active ? 'rgba(0, 255, 255, 0.08)' : 'transparent',
                boxShadow: active ? '0 0 6px var(--color-brand-glow)' : 'none',
            }}
        />
        <div
            className="w-1.5 h-1.5 transition-all duration-300"
            style={{
                transform: 'rotate(45deg)',
                background: 'var(--color-brand-primary)',
                opacity: active ? 1 : 0.4,
                boxShadow: active ? '0 0 4px var(--color-brand-glow)' : 'none',
            }}
        />
    </div>
);

const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const Header = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { playAlert } = useSoundSystem();
    const [time, setTime] = useState(new Date());
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [interceptedModule, setInterceptedModule] = useState<string | null>(null);
    const setActiveNodeId = useAppStore((s) => s.setActiveNodeId);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleNodeHover = useCallback((nodeId: string) => {
        setHoveredId(nodeId);
        setActiveNodeId(nodeId);
    }, [setActiveNodeId]);

    const handleNodeLeave = useCallback(() => {
        setHoveredId(null);
        setActiveNodeId(null);
    }, [setActiveNodeId]);

    const handleInterceptClick = useCallback((moduleName: string) => {
        playAlert();
        setInterceptedModule(moduleName);
    }, [playAlert]);

    return (
        <>
            <header className="relative z-50 flex-none w-full">
                <div className="flex items-center justify-between px-4 lg:px-6 xl:px-8 2xl:px-10 pt-4 2xl:pt-5 pb-2 2xl:pb-3 w-full">
                    {/* Left: Branding */}
                    <div
                        className="flex items-center gap-2 2xl:gap-3 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                        onClick={() => navigate('/')}
                    >
                        <NeuralLogo size={28} className="hidden sm:inline-flex 2xl:!w-[34px] 2xl:!h-[34px]" />
                        <h1 className="relative text-[16px] 2xl:text-[22px] font-display font-bold tracking-[0.2em]">
                            <span className="relative z-10 text-brand-primary">
                                {t('header.brand')}<span className="text-brand-primary">{t('header.brandHighlight')}</span>
                            </span>
                            <span className="absolute bottom-[3px] right-[4px] blur-[1px] select-none pointer-events-none opacity-50 whitespace-nowrap w-max" aria-hidden="true">
                                <span className="text-brand-primary">{t('header.brand')}</span>
                                <span className="text-brand-primary">{t('header.brandHighlight')}</span>
                            </span>
                        </h1>
                    </div>

                    {/* Center: Navigation Dock */}
                    <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 2xl:gap-2">
                        {NAV_NODES.map((node) => {
                            const isHovered = hoveredId === node.id;
                            const isDimmed = hoveredId !== null && !isHovered;

                            const buttonContent = (
                                <div
                                    className="flex items-center gap-1.5 px-2 xl:px-2.5 2xl:px-3 py-1 cursor-pointer relative"
                                    onMouseEnter={() => handleNodeHover(node.id)}
                                    onMouseLeave={handleNodeLeave}
                                    style={{
                                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                        opacity: isDimmed ? 0.2 : 1,
                                        borderBottom: isHovered
                                            ? '1px solid var(--color-brand-primary)'
                                            : '1px solid transparent',
                                    }}
                                >
                                    <DiamondIcon active={isHovered} />
                                    <span
                                        className="font-display text-[9px] xl:text-[10px] 2xl:text-xs font-semibold tracking-[0.15em] uppercase whitespace-nowrap"
                                        style={{
                                            color: isHovered ? 'var(--color-text-accent)' : 'var(--color-text-primary)',
                                            textShadow: isHovered ? '0 0 6px var(--color-brand-glow)' : 'none',
                                            transition: 'color 0.3s, text-shadow 0.3s',
                                        }}
                                    >
                                        {t(node.titleKey)}
                                    </span>
                                </div>
                            );

                            return node.link ? (
                                <Link key={node.id} to={node.link} className="block">
                                    {buttonContent}
                                </Link>
                            ) : (
                                <div key={node.id} onClick={() => handleInterceptClick(t(node.titleKey))}>
                                    {buttonContent}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Right: Status Info */}
                    <div className="hidden lg:flex items-center justify-end gap-4 2xl:gap-6 font-display tracking-widest flex-shrink-0">
                        <GhostText
                            className="text-status-success font-bold text-sm 2xl:text-base"
                            ghostOpacity={0.5}
                            ghostOffset="bottom-[3px] left-[4px]"
                        >
                            {t('header.online')}
                        </GhostText>
                        <GhostText
                            className="text-text-primary font-bold text-sm 2xl:text-base font-sans"
                            ghostOpacity={0.4}
                            ghostOffset="bottom-[3px] left-[4px]"
                        >
                            {formatTime(time)}
                        </GhostText>
                    </div>
                </div>

                {/* Header Bottom Line */}
                <div className="absolute bottom-0 left-0 right-0 mx-4 lg:mx-6 xl:mx-8 2xl:mx-10">
                    <CyberLine variant="surface" className="w-full" />
                </div>
            </header>

            <InterceptModal
                isOpen={!!interceptedModule}
                onClose={() => setInterceptedModule(null)}
                moduleName={interceptedModule}
            />
        </>
    );
};
