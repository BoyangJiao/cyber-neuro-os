/**
 * MobileNavDrawer — slide-in navigation for <lg viewports.
 *
 * The desktop nav dock (Header center, DeepDive-only) and the FeaturePanel
 * cards both disappear or change shape on mobile, so this drawer is the
 * guaranteed global navigation path on small screens.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { NAV_NODES } from './navNodes';
import { DiamondIcon } from '../ui/DiamondIcon';
import { CyberLine } from '../ui/CyberLine';
import { CyberButton } from '../ui/CyberButton';
import { useTranslation } from '../../i18n';

interface MobileNavDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    /** Called for nodes without a route (e.g. video) — opens InterceptModal. */
    onIntercept: (moduleName: string) => void;
}

export const MobileNavDrawer = ({ isOpen, onClose, onIntercept }: MobileNavDrawerProps) => {
    const { t } = useTranslation();
    const location = useLocation();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] lg:hidden">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.nav
                        className="absolute right-0 top-0 h-full w-[78vw] max-w-[320px] flex flex-col bg-[#020406]/95 backdrop-blur-md border-l border-[var(--color-brand-primary)]/25"
                        style={{
                            paddingTop: 'env(safe-area-inset-top)',
                            paddingBottom: 'env(safe-area-inset-bottom)',
                        }}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 pt-5 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-5 bg-[var(--color-brand-secondary)] shadow-[0_0_10px_var(--color-brand-secondary)]" />
                                <span className="text-xs font-bold font-display text-[var(--color-brand-secondary)] tracking-[0.2em] uppercase">
                                    NAVIGATION
                                </span>
                            </div>
                            <CyberButton
                                variant="ghost"
                                size="sm"
                                iconOnly
                                onClick={onClose}
                                className="text-[var(--color-brand-primary)]"
                            >
                                <i className="ri-close-line text-lg" />
                            </CyberButton>
                        </div>
                        <div className="px-5">
                            <CyberLine variant="surface" className="w-full" />
                        </div>

                        {/* Nav items */}
                        <div className="flex-1 overflow-y-auto no-scrollbar py-3">
                            {NAV_NODES.map((node) => {
                                const isActive = !!node.link && location.pathname.startsWith(node.link);
                                const itemContent = (
                                    <div
                                        className={`flex items-center gap-3 px-5 py-3.5 min-h-[44px] transition-colors duration-200 ${
                                            isActive ? 'bg-[var(--color-brand-primary)]/8' : 'active:bg-[var(--color-brand-primary)]/5'
                                        }`}
                                    >
                                        <DiamondIcon size="sm" active={isActive} />
                                        <span
                                            className="font-display text-xs font-semibold tracking-[0.15em] uppercase"
                                            style={{
                                                color: isActive
                                                    ? 'var(--color-text-accent)'
                                                    : 'var(--color-text-primary)',
                                                textShadow: isActive ? '0 0 6px var(--color-brand-glow)' : 'none',
                                            }}
                                        >
                                            {t(node.titleKey)}
                                        </span>
                                        {isActive && (
                                            <span className="ml-auto text-[9px] font-mono text-[var(--color-brand-secondary)]/70 tracking-[0.2em]">
                                                [ACTIVE]
                                            </span>
                                        )}
                                    </div>
                                );

                                return node.link ? (
                                    <Link key={node.id} to={node.link} className="block" onClick={onClose}>
                                        {itemContent}
                                    </Link>
                                ) : (
                                    <button
                                        key={node.id}
                                        type="button"
                                        className="block w-full text-left"
                                        onClick={() => {
                                            onClose();
                                            onIntercept(t(node.titleKey));
                                        }}
                                    >
                                        {itemContent}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer deco */}
                        <div className="px-5 pb-5">
                            <CyberLine variant="surface" className="w-full mb-3" />
                            <div className="flex items-center justify-between text-[9px] font-mono tracking-[0.25em] uppercase">
                                <span className="text-status-success">{t('header.online')}</span>
                                <span className="text-[var(--color-text-muted)]">NEURAL_OS</span>
                            </div>
                        </div>
                    </motion.nav>
                </div>
            )}
        </AnimatePresence>
    );
};
