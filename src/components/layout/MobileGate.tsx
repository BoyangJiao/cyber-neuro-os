/**
 * MobileGate - Blocks mobile viewport access with a styled warning screen
 * 
 * Uses the same design pattern as SettingsModal (HoloFrame + backdrop).
 * Pure CSS visibility: `lg:hidden` ensures zero-JS, zero-delay gating.
 */
import { useState } from 'react';
import { HoloFrame } from '../ui/HoloFrame';
import { CyberButton } from '../ui/CyberButton';
import { useTranslation } from '../../i18n';

export const MobileGate = () => {
    const { t } = useTranslation();
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    return (
        /* CSS-only visibility: hidden on lg+ screens, shown below lg */
        <div
            className="fixed inset-0 z-[99999] flex lg:hidden items-center justify-center p-6"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />

            {/* Modal Container — same pattern as SettingsModal */}
            <div className="relative w-full max-w-[380px]">
                <HoloFrame
                    variant="dots"
                    className="relative"
                    active={true}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-5 bg-[var(--color-brand-secondary)] shadow-[0_0_10px_var(--color-brand-secondary)]" />
                            <h2 className="text-xs font-bold text-[var(--color-brand-secondary)] tracking-[0.2em] uppercase">
                                SYSTEM ALERT
                            </h2>
                        </div>
                        <CyberButton
                            variant="ghost"
                            size="sm"
                            iconOnly
                            onClick={() => setDismissed(true)}
                            className="text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)]"
                        >
                            <i className="ri-close-line text-lg" />
                        </CyberButton>
                    </div>

                    {/* Content */}
                    <div className="space-y-5">
                        {/* Error code */}
                        <div className="text-[9px] font-mono text-[var(--color-brand-primary)]/40 tracking-[0.25em]">
                            ERR::VIEWPORT_INSUFFICIENT
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-bold text-[var(--color-text-primary)] tracking-[0.15em] uppercase">
                            {t('mobile.title')}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                            {t('mobile.description')}
                        </p>

                        {/* Divider */}
                        <div className="border-t border-[var(--color-text-subtle)]/30" />

                        {/* Instruction */}
                        <div className="flex items-start gap-2">
                            <i className="ri-computer-line text-[var(--color-brand-primary)]/60 mt-0.5" />
                            <p className="text-[11px] text-[var(--color-brand-secondary)]/80 tracking-wider leading-relaxed">
                                {t('mobile.instruction')}
                            </p>
                        </div>

                        {/* Force entry button */}
                        <div className="pt-2">
                            <CyberButton
                                variant="ghost"
                                className="w-full text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-brand-primary)]"
                                onClick={() => setDismissed(true)}
                            >
                                [ {t('mobile.dismiss')} ]
                            </CyberButton>
                        </div>
                    </div>
                </HoloFrame>
            </div>
        </div>
    );
};
