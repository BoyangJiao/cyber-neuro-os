import { useState } from 'react';
import { HoloFrame } from '../ui/HoloFrame';
import { GhostText } from '../ui/GhostText';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../i18n';
import { PixelGridEffect, ScanlineEffect } from '../ui/effects';

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
                                        <PixelGridEffect active className="z-20" />
                                        {/* Scanline Animation */}
                                        <ScanlineEffect variant="flash" active className="z-30" />
                                    </>
                                )}
                            </div>
                        }
                    />
                </div>

                {/* Profile Details */}
                <div className="flex flex-col gap-4 lg:gap-6 2xl:gap-7">
                    <div className="flex flex-col gap-1 2xl:gap-1.5">
                        <GhostText
                            className="text-xs lg:text-sm 2xl:text-base font-semibold font-sans text-text-secondary tracking-widest uppercase"
                            ghostOpacity={0.3}
                        >
                            {t('profile.name')}
                        </GhostText>
                        <GhostText
                            className="text-sm lg:text-base 2xl:text-lg font-bold font-display text-text-primary tracking-wider"
                            ghostOpacity={0.4}
                        >
                            {t('profile.nameValue')}
                        </GhostText>
                    </div>
                    <div className="flex flex-col gap-1 2xl:gap-1.5">
                        <GhostText
                            className="text-xs lg:text-sm 2xl:text-base font-semibold font-sans text-text-secondary tracking-widest uppercase"
                            ghostOpacity={0.3}
                        >
                            {t('profile.occupation')}
                        </GhostText>
                        <GhostText
                            className="text-sm lg:text-base 2xl:text-lg font-bold font-display text-text-primary tracking-wide"
                            ghostOpacity={0.4}
                        >
                            {t('profile.occupationValue')}
                        </GhostText>
                    </div>
                    <div className="flex flex-col gap-1 2xl:gap-1.5">
                        <GhostText
                            className="text-xs lg:text-sm 2xl:text-base font-semibold font-sans text-text-secondary tracking-widest uppercase"
                            ghostOpacity={0.3}
                        >
                            {t('profile.corporation')}
                        </GhostText>
                        <GhostText
                            className="text-sm lg:text-base 2xl:text-lg font-bold font-display text-text-primary tracking-wide"
                            ghostOpacity={0.4}
                        >
                            {t('profile.corporationValue')}
                        </GhostText>
                    </div>
                </div>
            </div>
        </div>
    );
};

