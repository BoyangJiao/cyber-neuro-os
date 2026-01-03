import { HoloFrame } from '../ui/HoloFrame';

export const ProfileSidebar = () => {
    return (
        <div className="col-span-1 lg:col-span-2 flex flex-col items-start p-4 h-full">
            <div className="flex flex-col gap-8 shrink-0 w-[194px]">
                {/* Profile Photo Frame */}
                <HoloFrame variant="corner" className="h-[194px] w-full bg-cyan-950/30 flex items-center justify-center group overflow-hidden relative">
                </HoloFrame>

                {/* Profile Details */}
                <div className="flex flex-col gap-6 pl-2">
                    <div className="flex flex-col gap-1">
                        <span className="text-[14px] font-semibold font-sans text-cyan-700 tracking-widest uppercase">NAME</span>
                        <div className="text-[16px] font-bold font-display text-cyan-50 tracking-wider">BOYANG JIAO</div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[14px] font-semibold font-sans text-cyan-700 tracking-widest uppercase">OCCUPATION</span>
                        <div className="text-[16px] font-bold font-display text-cyan-300 tracking-wide">DESIGNER & BUILDER</div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[14px] font-semibold font-sans text-cyan-700 tracking-widest uppercase">CORPORATION</span>
                        <div className="text-[16px] font-bold font-display text-cyan-300 tracking-wide">ANT GROUP</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
