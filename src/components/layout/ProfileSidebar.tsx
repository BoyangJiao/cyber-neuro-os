import { HoloFrame } from '../ui/HoloFrame';
import { useAppStore } from '../../store/useAppStore';

export const ProfileSidebar = () => {
    const { startAvatarScan, isAvatarScanning } = useAppStore();

    return (
        <div className="col-span-1 lg:col-span-2 flex flex-col items-start h-full">
            <div className="flex flex-col gap-4 lg:gap-6 shrink-0 w-[120px] lg:w-[146px] xl:w-[170px] 2xl:w-[194px]">
                {/* Profile Photo Frame - Clickable to open About Me */}
                <div id="avatar-frame" className="relative">
                    <HoloFrame
                        variant="corner"
                        className="h-[120px] lg:h-[146px] xl:h-[170px] 2xl:h-[194px] w-full bg-cyan-950/30 flex items-center justify-center group relative cursor-pointer hover:bg-cyan-900/40 transition-all duration-300"
                        onClick={startAvatarScan}
                        background={
                            isAvatarScanning ? (
                                <>
                                    {/* Pixel pattern background */}
                                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,182,212,0.15)_80%,transparent)] [mask-image:conic-gradient(from_0deg_at_3px_3px,transparent_270deg,black_270deg)] [mask-size:4px_4px]" />
                                    {/* Scanline Animation - 与 FeatureCard 完全相同 */}
                                    <div className="absolute inset-x-0 h-[2px] bg-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-[scanline_0.3s_linear_1] pointer-events-none" />
                                </>
                            ) : null
                        }
                    >
                        {/* Hover hint overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-cyan-950/60 z-10">
                            <span className="text-xs text-cyan-400 font-mono tracking-wider">ABOUT ME</span>
                        </div>
                    </HoloFrame>
                </div>

                {/* Profile Details */}
                <div className="flex flex-col gap-4 lg:gap-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs lg:text-sm font-semibold font-sans text-cyan-700 tracking-widest uppercase">NAME</span>
                        <div className="text-sm lg:text-base font-bold font-display text-cyan-50 tracking-wider">BOYANG JIAO</div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs lg:text-sm font-semibold font-sans text-cyan-700 tracking-widest uppercase">OCCUPATION</span>
                        <div className="text-sm lg:text-base font-bold font-display text-cyan-300 tracking-wide">DESIGNER & BUILDER</div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs lg:text-sm font-semibold font-sans text-cyan-700 tracking-widest uppercase">CORPORATION</span>
                        <div className="text-sm lg:text-base font-bold font-display text-cyan-300 tracking-wide">ANT GROUP</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

