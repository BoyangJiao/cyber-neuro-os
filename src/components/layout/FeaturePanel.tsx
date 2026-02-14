import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CyberSlotCard } from '../ui/CyberSlotCard';
import { HoloFeatureCard } from '../ui/HoloFeatureCard';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { useAppStore } from '../../store/useAppStore';
import type { GeometryType } from '../../store/useAppStore';
import { InterceptModal } from '../ui/modals/InterceptModal';

interface FeatureItem {
    titleKey: string;
    link?: string;
    inactiveImage?: string;
    activeImage?: string;
    geometryType?: GeometryType;
    icon?: string;
    subtitle?: string;
    glitchType?: 'heavy' | 'rgb' | 'slice' | 'vertical' | 'subtle' | 'standard';
    bgSize?: string;
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
        glitchType: 'heavy',
        bgSize: '75%'
    },
    {
        titleKey: 'features.music',
        link: '/music',
        geometryType: 'music',
        activeImage: '/images/features/radio_active.png',
        inactiveImage: '/images/features/radio_inactive.png',
        subtitle: '[FM_WAVE]',
        glitchType: 'rgb',
        bgSize: '70%'
    },
    {
        titleKey: 'features.game',
        geometryType: 'game',
        activeImage: '/images/features/game_active.png',
        inactiveImage: '/images/features/game_inactive.png',
        subtitle: '[INTERACT]',
        glitchType: 'slice',
        bgSize: '70%'
    },
    {
        titleKey: 'features.sound',
        geometryType: 'sound',
        activeImage: '/images/features/SFX_active.png',
        inactiveImage: '/images/features/SFX_inactive.png',
        subtitle: '[PATCH_BAY]',
        glitchType: 'standard',
        bgSize: '70%'
    },
    {
        titleKey: 'features.video',
        geometryType: 'video',
        activeImage: '/images/features/vide_active.png',
        inactiveImage: '/images/features/video_inactive.png',
        subtitle: '[OPTIC_FEED]',
        glitchType: 'vertical',
        bgSize: '70%'
    },
    {
        titleKey: 'features.lab',
        geometryType: 'lab',
        activeImage: '/images/features/Lab_active.png',
        inactiveImage: '/images/features/Lab_inactive.png',
        subtitle: '[UNSTABLE]',
        glitchType: 'subtle',
        bgSize: '65%'
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
                        {features.map((item) => {
                            const cardContent = is3DMode ? (
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
                                    bgSize={item.bgSize}
                                />
                            );

                            return (
                                <div
                                    key={item.titleKey}
                                    className="feature-card snap-center shrink-0 w-[85vw] lg:w-full aspect-[3/4] flex flex-col"
                                >
                                    {item.link ? (
                                        <Link to={item.link} className="block h-full">
                                            {cardContent}
                                        </Link>
                                    ) : (
                                        <div onClick={() => handleInterceptClick(t(item.titleKey))} className="cursor-pointer h-full">
                                            {cardContent}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div className="w-1 lg:hidden shrink-0"></div>
                    </div>
                </div>
            </div>

            <InterceptModal
                isOpen={!!interceptedModule}
                onClose={() => setInterceptedModule(null)}
                moduleName={interceptedModule}
            />
        </>
    );
};

