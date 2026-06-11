/**
 * MobileProfileBar — compact <lg replacement for the desktop ProfileSidebar.
 *
 * Rendered on the home route only (vertical space is scarce on phones).
 * Tapping it triggers the same avatar-scan → About Me flow as the sidebar.
 */
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../i18n';

export const MobileProfileBar = () => {
    const startAvatarScan = useAppStore((s) => s.startAvatarScan);
    const { t } = useTranslation();

    return (
        <button
            type="button"
            onClick={startAvatarScan}
            className="lg:hidden flex-none flex items-center gap-3 mx-4 px-3 py-2.5 text-left border border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-primary)]/[0.03] active:bg-[var(--color-brand-primary)]/10 transition-colors"
        >
            {/* Avatar */}
            <div className="relative w-11 h-11 flex-none border border-[var(--color-brand-primary)]/40 overflow-hidden">
                <video
                    src="/images/avatars/avatar.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-90"
                />
            </div>

            {/* Identity */}
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="text-xs font-bold font-display text-text-primary tracking-wider truncate">
                    {t('profile.nameValue')}
                </span>
                <span className="text-[10px] font-display text-text-secondary tracking-widest uppercase truncate">
                    {t('profile.occupationValue')}
                </span>
            </div>

            {/* Affordance */}
            <div className="flex items-center gap-2 flex-none">
                <span className="text-[8px] font-mono text-[var(--color-brand-secondary)]/60 tracking-[0.2em] uppercase">
                    ID//SCAN
                </span>
                <i className="ri-arrow-right-s-line text-brand-primary/70" />
            </div>
        </button>
    );
};
