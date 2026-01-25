import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { AnimatePresence } from 'framer-motion';
import { CyberSlotCard } from '../ui/CyberSlotCard';
import { HoloFeatureCard } from '../ui/HoloFeatureCard';
import { HoloFrame } from '../ui/HoloFrame';
import { CyberButton } from '../ui/CyberButton';
import { MotionDiv } from '../motion/MotionWrappers';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { useAppStore } from '../../store/useAppStore';
import type { GeometryType } from '../../store/useAppStore';

interface FeatureItem {
    titleKey: string;
    link?: string;
    inactiveImage?: string;
    activeImage?: string;
    geometryType?: GeometryType;
    icon?: string;
    subtitle?: string;
    glitchType?: 'heavy' | 'rgb' | 'slice' | 'vertical' | 'subtle' | 'standard';
}

const features: FeatureItem[] = [
    {
        titleKey: 'features.project',
        link: '/projects',
        geometryType: 'project',
        icon: '/images/features/project_active.png',
        activeImage: '/images/features/project_active.png',
        inactiveImage: '/images/features/project_inactive.png',
        subtitle: '[WORK_CORE]',
        glitchType: 'heavy'
    },
    {
        titleKey: 'features.music',
        link: '/music',
        geometryType: 'music',
        activeImage: '/images/features/radio_active.png',
        inactiveImage: '/images/features/radio_inactive.png',
        subtitle: '[FM_WAVE]',
        glitchType: 'rgb'
    },
    {
        titleKey: 'features.game',
        geometryType: 'game',
        activeImage: '/images/features/game_active.png',
        inactiveImage: '/images/features/game_inactive.png',
        subtitle: '[INTERACT]',
        glitchType: 'slice'
    },
    {
        titleKey: 'features.sound',
        geometryType: 'sound',
        activeImage: '/images/features/SFX_active.png',
        inactiveImage: '/images/features/SFX_inactive.png',
        subtitle: '[PATCH_BAY]',
        glitchType: 'standard'
    },
    {
        titleKey: 'features.video',
        geometryType: 'video',
        activeImage: '/images/features/vide_active.png',
        inactiveImage: '/images/features/video_inactive.png',
        subtitle: '[OPTIC_FEED]',
        glitchType: 'vertical'
    },
    {
        titleKey: 'features.lab',
        geometryType: 'lab',
        activeImage: '/images/features/Lab_active.png',
        inactiveImage: '/images/features/Lab_inactive.png',
        subtitle: '[UNSTABLE]',
        glitchType: 'subtle'
    },
];

export const FeaturePanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const { is3DMode } = useAppStore();
    const [interceptedModule, setInterceptedModule] = useState<string | null>(null);

    useGSAP(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.5 } });

        timeline.fromTo(".feature-card:nth-child(-n+3)",
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0 }
        );

        timeline.fromTo(".feature-card:nth-child(n+4)",
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0 },
            "-=0.3"
        );

    }, { scope: containerRef });

    const handleInterceptClick = (moduleName: string) => {
        setInterceptedModule(moduleName);
    };

    return (
        <>
            <div ref={containerRef} className="col-span-1 lg:col-span-8 flex flex-col h-full relative overflow-hidden px-6">
                <div className="relative z-10 h-full w-full flex lg:items-start lg:justify-center overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory px-8 lg:px-0">
                    <div className="flex flex-row lg:grid lg:grid-cols-3 lg:grid-rows-2 lg:w-3/4 lg:my-auto lg:gap-x-6 lg:gap-y-4 gap-2 min-w-full lg:min-w-0">
                        {features.map((item) => (
                            <div
                                key={item.titleKey}
                                className="feature-card snap-center shrink-0 w-[85vw] lg:w-full aspect-[3/4] flex flex-col"
                            >
                                {item.link ? (
                                    <Link to={item.link} className="block h-full">
                                        {is3DMode ? (
                                            <HoloFeatureCard
                                                title={t(item.titleKey)}
                                                subtitle={item.subtitle}
                                                glitchType={item.glitchType}
                                                geometryType={item.geometryType}
                                                icon={item.icon || item.activeImage || "/images/features/Lab_active.png"}
                                            />
                                        ) : (
                                            <CyberSlotCard
                                                title={t(item.titleKey)}
                                                subtitle={item.subtitle}
                                                glitchType={item.glitchType}
                                                inactiveImage={item.inactiveImage || "/images/features/Lab_inactive.png"}
                                                activeImage={item.activeImage || "/images/features/Lab_active.png"}
                                            />
                                        )}
                                    </Link>
                                ) : (
                                    <div onClick={() => handleInterceptClick(t(item.titleKey))} className="cursor-pointer h-full">
                                        {is3DMode ? (
                                            <HoloFeatureCard
                                                title={t(item.titleKey)}
                                                subtitle={item.subtitle}
                                                glitchType={item.glitchType}
                                                geometryType={item.geometryType}
                                                icon={item.icon || item.activeImage || "/images/features/Lab_active.png"}
                                            />
                                        ) : (
                                            <CyberSlotCard
                                                title={t(item.titleKey)}
                                                subtitle={item.subtitle}
                                                glitchType={item.glitchType}
                                                inactiveImage={item.inactiveImage || "/images/features/Lab_inactive.png"}
                                                activeImage={item.activeImage || "/images/features/Lab_active.png"}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="w-1 lg:hidden shrink-0"></div>
                    </div>
                </div>
            </div>

            {/* Intercept Modal - Following SettingsModal Pattern */}
            <AnimatePresence>
                {interceptedModule && (
                    <MotionDiv
                        className="fixed inset-0 z-[100] flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3, ease: "circOut" }}
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-[var(--color-bg-overlay)] backdrop-blur-[2px]"
                            onClick={() => setInterceptedModule(null)}
                        />

                        {/* Modal Container */}
                        <MotionDiv
                            className="relative w-[90vw] max-w-[360px]"
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: "circOut" }}
                        >
                            <HoloFrame variant="dots" active={true}>
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-1.5 h-5 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                    <h2 className="text-sm font-bold text-amber-500 tracking-[0.3em] uppercase">
                                        COMPILING
                                    </h2>
                                </div>

                                {/* Content */}
                                <div className="space-y-4">
                                    {/* Icon & Status */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 border border-amber-500/30 flex items-center justify-center bg-amber-500/5">
                                            <i className="ri-loader-4-line text-2xl text-amber-500 animate-spin" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                TARGET MODULE
                                            </p>
                                            <p className="text-base font-bold text-[var(--color-text-primary)] tracking-wide">
                                                {interceptedModule}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-[var(--color-text-secondary)]/80 leading-relaxed border-t border-[var(--color-text-subtle)]/20 pt-3">
                                        模块数据编译中，神经通路尚未建立连接。请稍后再次尝试访问。
                                    </p>

                                    {/* Action */}
                                    <div className="pt-2">
                                        <CyberButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setInterceptedModule(null)}
                                            className="w-full"
                                        >
                                            ACKNOWLEDGE
                                        </CyberButton>
                                    </div>
                                </div>
                            </HoloFrame>
                        </MotionDiv>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </>
    );
};
