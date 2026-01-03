import { useRef } from 'react';
import { FeatureCard } from '../ui/FeatureCard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface FeatureItem {
    title: string;
    icon: string;
}

const features: FeatureItem[] = [
    { title: 'PROJECT', icon: 'ri-rocket-2-line' },
    { title: 'VIDEO', icon: 'ri-movie-2-line' },
    { title: 'GAME', icon: 'ri-gamepad-line' },
    { title: 'SOUND', icon: 'ri-voiceprint-line' },
    { title: 'MUSIC', icon: 'ri-music-2-line' },
    { title: 'LAB', icon: 'ri-flask-line' },
];

export const FeaturePanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const cards = gsap.utils.toArray<HTMLElement>(".feature-card");
        const row1 = cards.slice(0, 3);
        const row2 = cards.slice(3, 6);

        const tl = gsap.timeline({ delay: 0.2 });

        // Row 1 entrance
        tl.fromTo(row1,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out"
            }
        );

        // Row 2 entrance (starts slightly after row 1 begins)
        tl.fromTo(row2,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out"
            },
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
                <div className="flex flex-row lg:grid lg:grid-cols-3 lg:gap-8 gap-4 min-w-full lg:min-w-0 h-full">
                    {features.map((item) => (
                        <div
                            key={item.title}
                            className="feature-card snap-center shrink-0 w-[85vw] lg:w-[279px] h-[60vh] lg:h-full"
                        >
                            <FeatureCard
                                title={item.title}
                                icon={item.icon}
                            />
                        </div>
                    ))}
                    {/* Spacer for mobile scroll end padding */}
                    <div className="w-4 shrink-0 lg:hidden"></div>
                </div>
            </div>
        </div>
    );
};
