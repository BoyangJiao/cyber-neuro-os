import { HoloFrame } from '../ui/HoloFrame';

export const ProfileSidebar = () => {
    return (
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-8 shrink-0 p-4 h-full">
            {/* Profile Photo Frame */}
            <HoloFrame variant="corner" className="aspect-[3/4] w-full bg-cyan-950/30 flex items-center justify-center group overflow-hidden relative">
                {/* Placeholder Avatar / Scanlines */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,240,255,0.05)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
                <i className="ri-user-3-line text-6xl text-cyan-500/20 group-hover:text-cyan-400/50 transition-colors duration-500"></i>
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></div>
            </HoloFrame>

            {/* Profile Details */}
            <div className="flex flex-col gap-6 pl-2">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-cyan-700 tracking-widest uppercase">NAME</span>
                    <div className="text-xl font-display font-bold text-cyan-50 tracking-wider">BOYANG JIAO</div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-cyan-700 tracking-widest uppercase">OCCUPATION</span>
                    <div className="text-sm font-mono text-cyan-300 tracking-wide">DESIGNER & BUILDER</div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-cyan-700 tracking-widest uppercase">CORPORATION</span>
                    <div className="text-sm font-mono text-cyan-300 tracking-wide">ANT GROUP</div>
                </div>
            </div>
        </div>
    );
};
