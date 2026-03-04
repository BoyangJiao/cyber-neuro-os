/**
 * ConstellationNav v3.2 — Horizontal Dock Navigation
 *
 * Top-bar dock layout with diamond icons + text labels.
 * Hover triggers particle shape morphing via Zustand store.
 */
import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { useSoundSystem } from '../../hooks/useSoundSystem';
import { InterceptModal } from '../ui/modals/InterceptModal';
import { useAppStore } from '../../store/useAppStore';

// ─── Node Data ─────────────────────────────────────────────
interface ConstellationNodeData {
    id: string;
    titleKey: string;
    subtitle: string;
    link?: string;
}

const NODES: ConstellationNodeData[] = [
    { id: 'project', titleKey: 'features.project', subtitle: 'WORK_CORE', link: '/projects' },
    { id: 'game', titleKey: 'features.game', subtitle: 'INTERACT', link: '/games' },
    { id: 'music', titleKey: 'features.music', subtitle: 'FM_WAVE', link: '/music' },
    { id: 'lab', titleKey: 'features.lab', subtitle: 'UNSTABLE', link: '/lab' },
    { id: 'sound', titleKey: 'features.sound', subtitle: 'PATCH_BAY', link: '/synthesis' },
    { id: 'video', titleKey: 'features.video', subtitle: 'OPTIC_FEED' },
];

// ─── Diamond Icon Component ────────────────────────────────
const DiamondIcon = ({ active }: { active: boolean }) => (
    <div className="relative w-4 h-4 flex items-center justify-center flex-shrink-0">
        {/* Outer diamond ring */}
        <div
            className="absolute w-3.5 h-3.5 transition-all duration-300"
            style={{
                transform: 'rotate(45deg)',
                border: `1px solid var(--color-brand-primary)`,
                opacity: active ? 0.9 : 0.3,
                background: active ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                boxShadow: active
                    ? '0 0 8px var(--color-brand-glow), inset 0 0 4px rgba(0, 255, 255, 0.1)'
                    : 'none',
            }}
        />
        {/* Inner diamond core */}
        <div
            className="w-1.5 h-1.5 transition-all duration-300"
            style={{
                transform: 'rotate(45deg)',
                background: 'var(--color-brand-primary)',
                opacity: active ? 1 : 0.5,
                boxShadow: active
                    ? '0 0 6px var(--color-brand-glow)'
                    : 'none',
            }}
        />
    </div>
);

// ─── Component ─────────────────────────────────────────────
export const ConstellationNav = () => {
    const { t } = useTranslation();
    const { playAlert } = useSoundSystem();
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [interceptedModule, setInterceptedModule] = useState<string | null>(null);
    const setActiveNodeId = useAppStore((s) => s.setActiveNodeId);

    const handleNodeHover = useCallback(
        (nodeId: string) => {
            setHoveredId(nodeId);
            setActiveNodeId(nodeId);
        },
        [setActiveNodeId]
    );

    const handleNodeLeave = useCallback(() => {
        setHoveredId(null);
        setActiveNodeId(null);
    }, [setActiveNodeId]);

    const handleInterceptClick = useCallback(
        (moduleName: string) => {
            playAlert();
            setInterceptedModule(moduleName);
        },
        [playAlert]
    );

    return (
        <>
            {/* Horizontal Dock Navigation Bar */}
            <nav className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-3 xl:gap-4 w-full py-3">
                {NODES.map((node) => {
                    const isHovered = hoveredId === node.id;
                    const isDimmed = hoveredId !== null && !isHovered;

                    const buttonContent = (
                        <div
                            className="flex items-center gap-2 px-3 py-1.5 rounded-sm cursor-pointer relative group"
                            onMouseEnter={() => handleNodeHover(node.id)}
                            onMouseLeave={handleNodeLeave}
                            style={{
                                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                                opacity: isDimmed ? 0.25 : 1,
                                background: isHovered
                                    ? 'rgba(0, 255, 255, 0.06)'
                                    : 'transparent',
                                borderBottom: isHovered
                                    ? '1px solid var(--color-brand-primary)'
                                    : '1px solid transparent',
                            }}
                        >
                            <DiamondIcon active={isHovered} />
                            <span
                                className="font-display text-[10px] xl:text-xs 2xl:text-sm font-semibold tracking-[0.15em] uppercase whitespace-nowrap"
                                style={{
                                    color: isHovered ? 'var(--color-text-accent)' : 'var(--color-text-primary)',
                                    textShadow: isHovered
                                        ? '0 0 8px var(--color-brand-glow)'
                                        : 'none',
                                    transition: 'color 0.3s, text-shadow 0.3s',
                                }}
                            >
                                {t(node.titleKey)}
                            </span>

                            {/* Active underline glow */}
                            {isHovered && (
                                <div
                                    className="absolute bottom-0 left-2 right-2 h-[1px] pointer-events-none"
                                    style={{
                                        background: 'linear-gradient(90deg, transparent, var(--color-brand-primary), transparent)',
                                        opacity: 0.6,
                                        filter: 'blur(1px)',
                                    }}
                                />
                            )}
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

            <InterceptModal
                isOpen={!!interceptedModule}
                onClose={() => setInterceptedModule(null)}
                moduleName={interceptedModule}
            />
        </>
    );
};

export { NODES };
