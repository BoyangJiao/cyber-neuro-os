import { useState, useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CyberSlotCard } from '../ui/CyberSlotCard';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { useAppStore } from '../../store/useAppStore';
import type { GeometryType } from '../../store/useAppStore';
import { InterceptModal } from '../ui/modals/InterceptModal';
import { useSoundSystem } from '../../hooks/useSoundSystem';
import { motion } from 'framer-motion';
import { DiamondIcon } from '../ui/DiamondIcon';

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
        subtitle: '//Work',
        glitchType: 'heavy',
        bgSize: '75%'
    },
    {
        titleKey: 'features.music',
        link: '/music',
        geometryType: 'music',
        activeImage: '/images/features/radio_active.png',
        inactiveImage: '/images/features/radio_inactive.png',
        subtitle: '//Music',
        glitchType: 'rgb',
        bgSize: '70%'
    },
    {
        titleKey: 'features.game',
        link: '/games',
        geometryType: 'game',
        activeImage: '/images/features/game_active.png',
        inactiveImage: '/images/features/game_inactive.png',
        subtitle: '//Game',
        glitchType: 'slice',
        bgSize: '70%'
    },
    {
        titleKey: 'features.sound',
        link: '/synthesis',
        geometryType: 'sound',
        activeImage: '/images/features/SFX_active.png',
        inactiveImage: '/images/features/SFX_inactive.png',
        subtitle: '//Sound',
        glitchType: 'standard',
        bgSize: '70%'
    },
    {
        titleKey: 'features.video',
        geometryType: 'video',
        activeImage: '/images/features/vide_active.png',
        inactiveImage: '/images/features/video_inactive.png',
        subtitle: '//Video',
        glitchType: 'vertical',
        bgSize: '70%'
    },
    {
        titleKey: 'features.lab',
        link: '/lab',
        geometryType: 'lab',
        activeImage: '/images/features/Lab_active.png',
        inactiveImage: '/images/features/Lab_inactive.png',
        subtitle: '//App',
        glitchType: 'subtle',
        bgSize: '65%'
    },
];

// ─── Spring transition for hydraulic-damped card animation ───
const HYDRAULIC_SPRING = {
    type: "spring" as const,
    stiffness: 180,
    damping: 26,
    mass: 0.6,
};

export const FeaturePanel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isDeepDiveMode, featureActiveIndex, setFeatureActiveIndex } = useAppStore();
    const [interceptedModule, setInterceptedModule] = useState<string | null>(null);

    // ─── Focus State Machine ───
    const [isRevealHover, setIsRevealHover] = useState(false);   // Is user hovering the focused card? (face-on)
    const wheelCooldown = useRef(false);                         // Throttle wheel events

    useGSAP(() => {
        if (isDeepDiveMode) return;
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
    }, { scope: containerRef, dependencies: [isDeepDiveMode] });

    const { playAlert } = useSoundSystem();

    const handleInterceptClick = (moduleName: string) => {
        playAlert();
        setInterceptedModule(moduleName);
    };

    // ─── Wheel Navigation: scroll through focus with hydraulic damping ───
    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (wheelCooldown.current) return;
        const delta = e.deltaY;
        if (Math.abs(delta) < 15) return; // ignore tiny scroll noise

        wheelCooldown.current = true;
        setTimeout(() => { wheelCooldown.current = false; }, 400); // 400ms cooldown = hydraulic feel

        setIsRevealHover(false); // cancel any reveal state during navigation
        if (delta > 0) {
            // Scroll down → next card
            setFeatureActiveIndex(Math.min(featureActiveIndex + 1, features.length - 1));
        } else {
            // Scroll up → previous card
            setFeatureActiveIndex(Math.max(featureActiveIndex - 1, 0));
        }
    }, [featureActiveIndex, setFeatureActiveIndex]);

    // ─── Click to Focus: directly select a background card ───
    const handleCardClick = useCallback((index: number) => {
        const isRevealed = index === featureActiveIndex && isRevealHover;
        if (isRevealed) {
            // Click on the revealed (face-on) card → Enter action
            const item = features[index];
            if (item.link) {
                navigate(item.link);
            } else {
                handleInterceptClick(t(item.titleKey));
            }
        } else if (index !== featureActiveIndex) {
            // Click on a background card → promote it to Focus
            setIsRevealHover(false);
            setFeatureActiveIndex(index);
        }
    }, [featureActiveIndex, isRevealHover, navigate, t, setFeatureActiveIndex]);

    // ─── DeepDive Mode ───
    if (isDeepDiveMode) {
        return (
            <div className="relative w-full h-full min-h-[400px] xl:min-h-[500px] 2xl:min-h-[600px]">
                {/* Intentionally empty — particles + header nav dock provide navigation */}
            </div>
        );
    }

    // ─── Default Mode: Cybernetic Slot Cards ───
    return (
        <>
            <div ref={containerRef} className="col-span-1 lg:col-span-8 flex flex-col h-full relative overflow-hidden px-6 lg:px-0">
                {/* Mobile View: Horizontal Scroll */}
                <div className="lg:hidden relative z-10 w-full h-full flex items-center justify-start overflow-x-auto no-scrollbar snap-x snap-mandatory">
                    <div className="flex flex-row gap-4 items-center py-8">
                        {features.map((item) => {
                            const cardContent = (
                                <CyberSlotCard
                                    title={t(item.titleKey)}
                                    subtitle={item.subtitle}
                                    glitchType={item.glitchType}
                                    inactiveImage={item.inactiveImage || "/images/features/Lab_inactive.png"}
                                    activeImage={item.activeImage || "/images/features/Lab_active.png"}
                                    bgSize={item.bgSize}
                                    isErrorState={item.geometryType === 'video'}
                                />
                            );
                            return (
                                <div
                                    key={`mobile-${item.titleKey}`}
                                    className="feature-card snap-center shrink-0 w-[60vw] max-w-[240px] aspect-[4/7] flex flex-col"
                                >
                                    {item.link ? (
                                        <Link to={item.link} className="block h-full">
                                            {cardContent}
                                        </Link>
                                    ) : (
                                        <div onClick={() => handleInterceptClick(t(item.titleKey))} className="cursor-pointer h-full text-left">
                                            {cardContent}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Desktop View: 3D Focus State Machine Coverflow */}
                <div
                    className="hidden lg:flex relative z-10 w-full h-full items-center justify-center [perspective:1400px] [transform-style:preserve-3d]"
                    onWheel={handleWheel}
                >
                    {features.map((item, index) => {
                        const isFocused = featureActiveIndex === index;
                        const isRevealed = isFocused && isRevealHover;

                        // ─── Three-State Spatial Coordinates ───
                        // Relative position in the queue (negative = in front of focus, positive = behind)
                        const queueOffset = index - featureActiveIndex;

                        // STATE 1: Queued (default resting position in the array)
                        let x = queueOffset * 65;
                        let y = queueOffset * 3;
                        let z = -(Math.abs(queueOffset) * 80) - (index * 10);
                        let rotateY = -35;
                        let scale = 0.92;
                        let opacity = Math.max(0.3, 1 - Math.abs(queueOffset) * 0.15);
                        let blur = Math.min(Math.abs(queueOffset) * 1.5, 4);

                        if (isFocused && !isRevealed) {
                            // STATE 2: Focused — extracted from queue, angled "side view"
                            x = -60;
                            y = 0;
                            z = 120;
                            rotateY = -25;
                            scale = 1.08;
                            opacity = 1;
                            blur = 0;
                        } else if (isRevealed) {
                            // STATE 3: Revealed — flipped face-on toward user
                            x = 0;
                            y = -10;
                            z = 200;
                            rotateY = 0;
                            scale = 1.15;
                            opacity = 1;
                            blur = 0;
                        }

                        const cardContent = (
                            <CyberSlotCard
                                title={t(item.titleKey)}
                                subtitle={item.subtitle}
                                glitchType={item.glitchType}
                                inactiveImage={item.inactiveImage || "/images/features/Lab_inactive.png"}
                                activeImage={item.activeImage || "/images/features/Lab_active.png"}
                                bgSize={item.bgSize}
                                isFocused={isFocused}
                                isRevealed={isRevealed}
                                isErrorState={item.geometryType === 'video'}
                            />
                        );

                        return (
                            <motion.div
                                key={`desktop-${item.titleKey}`}
                                className="absolute origin-center w-[160px] lg:w-[180px] xl:w-[220px] cursor-pointer will-change-transform"
                                initial={false}
                                animate={{
                                    opacity,
                                    x,
                                    y,
                                    z,
                                    rotateY,
                                    scale,
                                    filter: `blur(${blur}px)`,
                                }}
                                transition={HYDRAULIC_SPRING}
                                style={{ transformStyle: "preserve-3d" }}
                                onMouseEnter={() => {
                                    if (isFocused) setIsRevealHover(true);
                                }}
                                onMouseLeave={() => {
                                    if (isFocused) setIsRevealHover(false);
                                }}
                                onClick={() => handleCardClick(index)}
                            >
                                {cardContent}
                            </motion.div>
                        );
                    })}

                    {/* Focus Indicator: Diamond icons matching DeepDive nav */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                        {features.map((_, i) => (
                            <button
                                key={`diamond-${i}`}
                                onClick={() => { setFeatureActiveIndex(i); setIsRevealHover(false); }}
                                className="p-1 transition-transform hover:scale-110 active:scale-95"
                            >
                                <DiamondIcon
                                    size="sm"
                                    active={i === featureActiveIndex}
                                    className="transition-all duration-300"
                                />
                            </button>
                        ))}
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

