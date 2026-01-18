import { useState } from 'react';
import { HoloFrame } from '../ui/HoloFrame';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../i18n';

export const ProfileSidebar = () => {
    const { startAvatarScan, isAvatarScanning } = useAppStore();
    const { t } = useTranslation();
    const [isPressed, setIsPressed] = useState(false);

    return (
        <div className="col-span-1 lg:col-span-2 flex flex-col items-start h-full">
            <div className="flex flex-col gap-4 lg:gap-6 2xl:gap-8 shrink-0 w-[120px] lg:w-[146px] xl:w-[170px] 2xl:w-[220px]">
                {/* Profile Photo Frame - Clickable to open About Me */}
                <div id="avatar-frame" className="relative group">
                    <HoloFrame
                        variant="corner"
                        isPressed={isPressed}
                        showGhost={true}
                        className="h-[120px] lg:h-[146px] xl:h-[170px] 2xl:h-[220px] w-full flex items-center justify-center relative cursor-pointer p-0"
                        onClick={startAvatarScan}
                        onMouseDown={() => setIsPressed(true)}
                        onMouseUp={() => setIsPressed(false)}
                        onMouseLeave={() => setIsPressed(false)}
                        background={
                            <div className="absolute inset-[2px]">
                                {/* Ghost Image Layer */}
                                <img
                                    src="/images/avatars/avatar.gif"
                                    className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[2px] select-none pointer-events-none -translate-x-1 -translate-y-1"
                                    aria-hidden="true"
                                />

                                {/* Avatar Image - Layer 10 */}
                                <img
                                    src="/images/avatars/avatar.gif"
                                    alt="Profile Avatar"
                                    className="relative z-10 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />

                                {/* Hover Overlay - Matched to inset */}
                                <div className="absolute inset-1 z-20 group-hover:bg-[var(--color-brand-primary)]/10 transition-all duration-300 pointer-events-none" />

                                {/* Scan animations - Only shown during scan */}
                                {isAvatarScanning && (
                                    <>
                                        {/* Pixel pattern background */}
                                        <div className="absolute inset-0 z-20 bg-[linear-gradient(to_bottom,var(--color-brand-dim)_80%,transparent)] [mask-image:conic-gradient(from_0deg_at_3px_3px,transparent_270deg,black_270deg)] [mask-size:4px_4px]" />
                                        {/* Scanline Animation */}
                                        <div className="absolute inset-x-0 h-[2px] z-30 bg-[var(--color-brand-secondary)]/50 shadow-[0_0_10px_var(--color-brand-glow)] animate-[scanline_0.3s_linear_1] pointer-events-none" />
                                    </>
                                )}
                            </div>
                        }
                    />
                </div>

                {/* Profile Details */}
                <div className="flex flex-col gap-4 lg:gap-6 2xl:gap-7">
                    <div className="flex flex-col gap-1 2xl:gap-1.5">
                        <div className="relative inline-block w-max">
                            <span className="relative z-10 text-xs lg:text-sm 2xl:text-base font-semibold font-sans text-[var(--color-text-secondary)] tracking-widest uppercase">{t('profile.name')}</span>
                            <span className="absolute bottom-[2px] right-[3px] text-[var(--color-text-secondary)]/30 blur-[1px] select-none pointer-events-none whitespace-nowrap text-xs lg:text-sm 2xl:text-base uppercase" aria-hidden="true">
                                {t('profile.name')}
                            </span>
                        </div>
                        <div className="relative inline-block text-sm lg:text-base 2xl:text-lg font-bold font-display text-[var(--color-text-primary)] tracking-wider w-max">
                            <span className="relative z-10">{t('profile.nameValue')}</span>
                            <span className="absolute bottom-[2px] right-[3px] text-[var(--color-text-primary)]/40 blur-[1px] select-none pointer-events-none whitespace-nowrap" aria-hidden="true">
                                {t('profile.nameValue')}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 2xl:gap-1.5">
                        <div className="relative inline-block w-max">
                            <span className="relative z-10 text-xs lg:text-sm 2xl:text-base font-semibold font-sans text-[var(--color-text-secondary)] tracking-widest uppercase">{t('profile.occupation')}</span>
                            <span className="absolute bottom-[2px] right-[3px] text-[var(--color-text-secondary)]/30 blur-[1px] select-none pointer-events-none whitespace-nowrap text-xs lg:text-sm 2xl:text-base uppercase" aria-hidden="true">
                                {t('profile.occupation')}
                            </span>
                        </div>
                        <div className="relative inline-block text-sm lg:text-base 2xl:text-lg font-bold font-display text-[var(--color-text-primary)] tracking-wide w-max">
                            <span className="relative z-10">{t('profile.occupationValue')}</span>
                            <span className="absolute bottom-[2px] right-[3px] text-[var(--color-text-primary)]/40 blur-[1px] select-none pointer-events-none whitespace-nowrap" aria-hidden="true">
                                {t('profile.occupationValue')}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 2xl:gap-1.5">
                        <div className="relative inline-block w-max">
                            <span className="relative z-10 text-xs lg:text-sm 2xl:text-base font-semibold font-sans text-[var(--color-text-secondary)] tracking-widest uppercase">{t('profile.corporation')}</span>
                            <span className="absolute bottom-[2px] right-[3px] text-[var(--color-text-secondary)]/30 blur-[1px] select-none pointer-events-none whitespace-nowrap text-xs lg:text-sm 2xl:text-base uppercase" aria-hidden="true">
                                {t('profile.corporation')}
                            </span>
                        </div>
                        <div className="relative inline-block text-sm lg:text-base 2xl:text-lg font-bold font-display text-[var(--color-text-primary)] tracking-wide w-max">
                            <span className="relative z-10">{t('profile.corporationValue')}</span>
                            <span className="absolute bottom-[2px] right-[3px] text-[var(--color-text-primary)]/40 blur-[1px] select-none pointer-events-none whitespace-nowrap" aria-hidden="true">
                                {t('profile.corporationValue')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

