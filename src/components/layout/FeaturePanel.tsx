import { useState, useRef, useCallback, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CyberSlotCard } from '../ui/CyberSlotCard';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation, useLanguage } from '../../i18n';
import { useAppStore } from '../../store/useAppStore';
import { useShallow } from 'zustand/react/shallow';
import type { GeometryType } from '../../store/useAppStore';
import { InterceptModal } from '../ui/modals/InterceptModal';
import { useSoundSystem } from '../../hooks/useSoundSystem';
import { motion } from 'framer-motion';
import { DiamondIcon } from '../ui/DiamondIcon';
import { MouseIcon } from '../ui/MouseIcon';

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
    const { language } = useLanguage();
    const navigate = useNavigate();
    const { isDeepDiveMode, featureActiveIndex, setFeatureActiveIndex, isBootSequenceActive, hasPlayedFeatureIntro, setHasPlayedFeatureIntro } = useAppStore(useShallow(state => ({
        isDeepDiveMode: state.isDeepDiveMode,
        featureActiveIndex: state.featureActiveIndex,
        setFeatureActiveIndex: state.setFeatureActiveIndex,
        isBootSequenceActive: state.isBootSequenceActive,
        hasPlayedFeatureIntro: state.hasPlayedFeatureIntro,
        setHasPlayedFeatureIntro: state.setHasPlayedFeatureIntro
    })));
    const [interceptedModule, setInterceptedModule] = useState<string | null>(null);

    // ─── Intro Animation Orchestration ───
    const [isIntroPlaying, setIsIntroPlaying] = useState(!hasPlayedFeatureIntro);
    const [isDeckMerged, setIsDeckMerged] = useState(!hasPlayedFeatureIntro);

    // ─── Focus State Machine ───
    const [isRevealHover, setIsRevealHover] = useState(false);   // Is user hovering the focused card? (face-on)
    const mousePosRef = useRef({ x: 0, y: 0 });                 // Track mouse without triggering renders
    const wheelCooldown = useRef(false);                         // Throttle wheel events
    const isTransitioning = useRef(false);                       // Track if a card transition is in flight

    useEffect(() => {
        // Condition 1: Don't do anything if we are currently deep diving or STILL on the BootScreen
        if (isDeepDiveMode || isBootSequenceActive) return;

        // Condition 2: If we have already fully played the intro in this session, stay in end-state
        if (hasPlayedFeatureIntro) {
            setIsIntroPlaying(false);
            setIsDeckMerged(false);
            return;
        }

        // Condition 3: Boot sequence just finished, we haven't played the intro yet.
        // Start playing the sequence. We do NOT immediately set `hasPlayedFeatureIntro = true` 
        // to avoid race conditions with GSAP effects.
        setIsIntroPlaying(true);
        setIsDeckMerged(true);

        let phaseBTimer: ReturnType<typeof setTimeout>;
        let sweepInterval: ReturnType<typeof setInterval>;

        // Phase A: Merged state for a short entry fly-in (wait 300ms for it to fly in)
        const phaseATimer = setTimeout(() => {
            // Phase B: Burst open, focus on the absolute back card
            setIsDeckMerged(false);
            setFeatureActiveIndex(features.length - 1);

            // Wait for the expansion to complete structurally before sweeping
            phaseBTimer = setTimeout(() => {
                // Phase C: Sequence sweep forward to 0 (slower, methodical pace)
                let currentIdx = features.length - 1;
                sweepInterval = setInterval(() => {
                    currentIdx--;
                    if (currentIdx >= 0) {
                        setFeatureActiveIndex(currentIdx);
                    } else {
                        clearInterval(sweepInterval);
                        setIsIntroPlaying(false); // Sequence done, unlock interactions
                        setHasPlayedFeatureIntro(true); // MARK AS PLAYED AT THE **END** OF THE SEQUENCE
                    }
                }, 200); // Rhythmic 200ms per card
            }, 500); // 500ms pause to let the user perceive the expanded queue

        }, 300);

        return () => {
            clearTimeout(phaseATimer);
            if (phaseBTimer) clearTimeout(phaseBTimer);
            if (sweepInterval) clearInterval(sweepInterval);
        };
    }, [isDeepDiveMode, setFeatureActiveIndex, isBootSequenceActive, hasPlayedFeatureIntro, setHasPlayedFeatureIntro]);

    useGSAP(() => {
        if (isDeepDiveMode || hasPlayedFeatureIntro) return;
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
    }, { scope: containerRef, dependencies: [isDeepDiveMode, hasPlayedFeatureIntro] });

    const { playAlert } = useSoundSystem();

    const handleInterceptClick = (moduleName: string) => {
        playAlert();
        setInterceptedModule(moduleName);
    };

    // ─── Wheel Navigation: scroll through focus with hydraulic damping ───
    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (isIntroPlaying || wheelCooldown.current) return;
        const delta = e.deltaY;
        if (Math.abs(delta) < 15) return; // ignore tiny scroll noise

        // ─── Boundary Guard: Don't trigger navigation if already at limit ───
        // This prevents the 'stuck' state where hover is cleared but index doesn't change
        if (delta > 0 && featureActiveIndex >= features.length - 1) return;
        if (delta < 0 && featureActiveIndex <= 0) return;

        wheelCooldown.current = true;
        isTransitioning.current = true;
        setTimeout(() => { wheelCooldown.current = false; }, 400); // 400ms cooldown = hydraulic feel

        setIsRevealHover(false); // cancel any reveal state during navigation
        if (delta > 0) {
            // Scroll down → next card
            setFeatureActiveIndex(featureActiveIndex + 1);
        } else {
            // Scroll up → previous card
            setFeatureActiveIndex(featureActiveIndex - 1);
        }
    }, [featureActiveIndex, setFeatureActiveIndex, isIntroPlaying]);

    // ─── Click to Focus: directly select a background card ───
    const handleCardClick = useCallback((index: number) => {
        if (isIntroPlaying) return;
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
            isTransitioning.current = true;
            setFeatureActiveIndex(index);
        }
    }, [featureActiveIndex, isRevealHover, navigate, t, setFeatureActiveIndex, isIntroPlaying]);

    // ─── Post-Transition Hover Sync (fixes Windows) ───
    // After a card transition completes (spring settles ~350ms), check if the mouse
    // is already over the newly focused card. This fixes Windows where mouseover
    // doesn't re-fire when a card moves *under* a stationary cursor.
    useEffect(() => {
        if (isIntroPlaying || isDeepDiveMode) return;
        
        // Wait for the spring animation to settle before checking
        const timer = setTimeout(() => {
            isTransitioning.current = false;
            const { x, y } = mousePosRef.current;
            if (x === 0 && y === 0) return; // Mouse hasn't moved yet
            const el = document.elementFromPoint(x, y);
            if (el && el.closest('[data-focused="true"]')) {
                setIsRevealHover(true);
            }
        }, 350); // Matches HYDRAULIC_SPRING settle time
        return () => clearTimeout(timer);
    }, [featureActiveIndex, isIntroPlaying, isDeepDiveMode]);

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
            <div 
                ref={containerRef} 
                className="col-span-1 lg:col-span-8 flex flex-col h-full relative overflow-hidden px-6 lg:px-0"
                onMouseMove={(e) => { mousePosRef.current = { x: e.clientX, y: e.clientY }; }}
            >
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
                        let x, y, z, rotateY, scale, opacity, blur;

                        if (isDeckMerged) {
                            // STATE 0: Merged Intro
                            x = 60 - index * 5;
                            y = 0;
                            z = -250 - index * 10;
                            rotateY = -35;
                            scale = 0.8;
                            opacity = 0.5;
                            blur = 2;
                        } else {
                            // Relative position in the queue (negative = in front of focus, positive = behind)
                            const queueOffset = index - featureActiveIndex;

                            // STATE 1: Queued (default resting position in the array)
                            x = queueOffset * 65;
                            y = queueOffset * 3;
                            z = -(Math.abs(queueOffset) * 80) - (index * 10);
                            rotateY = -35;
                            scale = 0.92;
                            opacity = Math.max(0.3, 1 - Math.abs(queueOffset) * 0.15);
                            blur = Math.min(Math.abs(queueOffset) * 1.5, 4);

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
                                isIntroPlaying={isIntroPlaying}
                            />
                        );
                        return (
                            <motion.div
                                key={`desktop-${item.titleKey}`}
                                className="absolute origin-center w-[160px] lg:w-[180px] xl:w-[220px] cursor-pointer will-change-transform feature-card"
                                data-focused={isFocused}
                                initial={{ opacity: 0, x: 150, z: -400, rotateY: -40, scale: 0.7 }}
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
                </div>
            </div>

            {/* Desktop Overlays: Indicators and Instructions (Outside of 3D Perspective) */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none z-10">
                {/* Top Focus Indicator: Diamond icons matching DeepDive nav */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-auto">
                    {features.map((_, i) => (
                        <button
                            key={`diamond-${i}`}
                            onClick={() => {
                                if (!isIntroPlaying) {
                                    setFeatureActiveIndex(i);
                                    setIsRevealHover(false);
                                }
                            }}
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

                {/* Bottom Scroll Instruction: Mouse Icon + Text + Arrow */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 select-none">
                    <MouseIcon size={24} />
                    <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">
                        <span>{language === 'zh' ? '滚动鼠标切换插槽' : 'Scroll to switch slot'}</span>
                        <span className="text-brand-secondary font-bold text-base translate-y-[1px]">←</span>
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

