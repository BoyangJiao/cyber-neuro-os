import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { FeatureCard } from '../ui/FeatureCard';
import { HoloFeatureCard } from '../ui/HoloFeatureCard';
import { CyberSlotCard } from '../ui/CyberSlotCard';
import { Link } from 'react-router-dom';
import { MotionDiv } from '../motion/MotionWrappers';
import { useTranslation } from '../../i18n';

import rockThreeIcon from '../../assets/icons/rock-three.svg';

interface FeatureItem {
    titleKey: string;
    icon: string;
    link?: string;
}

const features: FeatureItem[] = [
    { titleKey: 'features.project', icon: rockThreeIcon, link: '/projects' },
    { titleKey: 'features.video', icon: 'ri-movie-2-line' },
    { titleKey: 'features.game', icon: 'ri-gamepad-line' },
    { titleKey: 'features.sound', icon: 'ri-voiceprint-line' },
    { titleKey: 'features.music', icon: 'ri-music-2-line' },
    { titleKey: 'features.lab', icon: 'ri-flask-line' },
];

export const FeaturePanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

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
        <div ref={containerRef} className="col-span-1 lg:col-span-8 flex flex-col h-full relative overflow-hidden">
            {/* 
              Desktop: Centered Grid 
              Mobile: Horizontal Scroll List
            */}
            <div className="h-full w-full flex lg:items-center lg:justify-center overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory px-8 lg:px-0 py-4 lg:py-0">
                <div className="flex flex-row lg:grid lg:grid-cols-3 lg:grid-rows-2 lg:w-3/4 lg:gap-4 xl:gap-6 2xl:gap-8 gap-4 min-w-full lg:min-w-0 h-full">
                    {features.map((item) => (
                        <div
                            key={item.titleKey}
                            className="feature-card snap-center shrink-0 w-[85vw] lg:w-full h-[60vh] lg:h-full"
                        >
                            {item.titleKey === 'features.project' ? (
                                <MotionDiv layoutId="project-expand" className="h-full">
                                    <Link to={item.link!} className="block h-full">
                                        <HoloFeatureCard
                                            title={t(item.titleKey)}
                                            icon={item.icon}
                                        />
                                    </Link>
                                </MotionDiv>
                            ) : item.titleKey === 'features.lab' ? (
                                <CyberSlotCard
                                    title={t(item.titleKey)}
                                    inactiveImage="/images/features/Lab_inactive.png"
                                    activeImage="/images/features/Lab_active.png"
                                />
                            ) : (
                                item.link ? (
                                    <Link to={item.link} className="block h-full">
                                        <FeatureCard
                                            title={t(item.titleKey)}
                                            icon={item.icon}
                                        />
                                    </Link>
                                ) : (
                                    <FeatureCard
                                        title={t(item.titleKey)}
                                        icon={item.icon}
                                    />
                                )
                            )}
                        </div>
                    ))}
                    {/* Spacer for mobile scroll end padding */}
                    <div className="w-4 shrink-0 lg:hidden"></div>
                </div>
            </div>
        </div>
    );
};
