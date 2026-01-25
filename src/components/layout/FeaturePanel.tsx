import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CyberSlotCard } from '../ui/CyberSlotCard';
import { HoloFeatureCard } from '../ui/HoloFeatureCard';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { useAppStore } from '../../store/useAppStore';
import type { GeometryType } from '../../store/useAppStore';

interface FeatureItem {
    titleKey: string;
    link?: string;
    // For now we use the same image placeholders for all cards as requested
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

    useGSAP(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.5 } });

        // Row 1 (Index 0, 1, 2)
        timeline.fromTo(".feature-card:nth-child(-n+3)",
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0 }
        );

        // Row 2 (Index 3, 4, 5) - Starts slightly before Row 1 ends
        timeline.fromTo(".feature-card:nth-child(n+4)",
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0 },
            "-=0.3"
        );

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="col-span-1 lg:col-span-8 flex flex-col h-full relative overflow-hidden px-6">
            {/*
              Desktop: Centered Grid (Stable 6-column Layout)
              Mobile: Horizontal Scroll List
            */}
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
                                is3DMode ? (
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
                                )
                            )}
                        </div>
                    ))}
                    {/* Spacer for mobile scroll end padding */}
                    <div className="w-1 lg:hidden shrink-0"></div>
                </div>
            </div>
        </div>
    );
};
