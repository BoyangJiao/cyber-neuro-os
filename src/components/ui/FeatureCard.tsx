import { HoloFrame } from './HoloFrame';
import { useSoundSystem } from '../../hooks/useSoundSystem';
import { MotionDiv } from '../motion/MotionWrappers';

export interface FeatureCardProps {
    title: string;
    icon: string;
    onClick?: () => void;
}

export const FeatureCard = ({ title, icon, onClick }: FeatureCardProps) => {
    const { playHover, playClick } = useSoundSystem();

    return (
        <HoloFrame
            variant="lines"
            className="group h-full cursor-pointer transition-colors duration-300"
            onClick={() => {
                playClick();
                onClick?.();
            }}
            onMouseEnter={() => playHover()}
            background={
                <>
                    {/* Hover Background: Pixel Pattern (Solid Squares) */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[linear-gradient(to_bottom,rgba(6,182,212,0.15)_80%,transparent)] [mask-image:conic-gradient(from_0deg_at_3px_3px,transparent_270deg,black_270deg)] [mask-size:4px_4px]"></div>

                    {/* Scanline Animation */}
                    <div className="absolute inset-x-0 h-[2px] bg-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.8)] opacity-0 group-hover:animate-[scanline_0.3s_linear_1] pointer-events-none"></div>
                </>
            }
        >
            {/* Content Layer: fills container */}
            <MotionDiv layout className="relative flex-1 w-full" exit={{ opacity: 0, transition: { duration: 0.01 } }}>

                {/* Title: positioned at top */}
                <div className="absolute top-0 left-0 right-0 pt-4 font-display text-lg lg:text-xl 2xl:text-2xl font-bold tracking-wider text-cyan-100 z-10 text-center uppercase leading-none">
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
                        <i className={`${icon} text-[72px] xl:text-[90px] 2xl:text-[108px] text-cyan-50 leading-none`}></i>
                    )}
                </div>
            </MotionDiv>
        </HoloFrame>
    );
};
