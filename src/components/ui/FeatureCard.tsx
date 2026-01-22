import { useState } from 'react';
import { HoloFrame } from './HoloFrame';
import { useSoundSystem } from '../../hooks/useSoundSystem';
import { MotionDiv } from '../motion/MotionWrappers';
import { PixelGridEffect, ScanlineEffect } from './effects';

export interface FeatureCardProps {
    title: string;
    icon: string;
    onClick?: () => void;
}

export const FeatureCard = ({ title, icon, onClick }: FeatureCardProps) => {
    const { playHover, playClick } = useSoundSystem();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <HoloFrame
            variant="lines"
            className="group h-full w-full cursor-pointer transition-colors duration-300"
            onClick={() => {
                playClick();
                onClick?.();
            }}
            onMouseEnter={() => {
                playHover();
                setIsHovered(true);
            }}
            onMouseLeave={() => setIsHovered(false)}
            background={
                <>
                    {/* Hover Background: Pixel Pattern */}
                    <PixelGridEffect active={isHovered} />

                    {/* Scanline Animation */}
                    <ScanlineEffect variant="flash" active={isHovered} />
                </>
            }
        >
            {/* Content Layer: fills container */}
            <MotionDiv layout className="relative flex-1 w-full" exit={{ opacity: 0, transition: { duration: 0.01 } }}>

                {/* Title: positioned at top */}
                <div className="absolute top-0 left-0 right-0 pt-4 font-display text-lg lg:text-xl 2xl:text-2xl font-bold tracking-wider text-[var(--color-text-primary)] z-10 text-center uppercase leading-none">
                    {title}
                </div>

                {/* Icon: Fully centered in the container */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {icon?.includes('/') || icon?.includes('data:') ? (
                        <img
                            src={icon}
                            alt=""
                            className="w-[72px] h-[72px] xl:w-[90px] xl:h-[90px] 2xl:w-[108px] 2xl:h-[108px] object-contain opacity-90"
                        />
                    ) : (
                        <i className={`${icon} text-[72px] xl:text-[90px] 2xl:text-[108px] text-[var(--color-text-primary)] leading-none`}></i>
                    )}
                </div>
            </MotionDiv>
        </HoloFrame>
    );
};
