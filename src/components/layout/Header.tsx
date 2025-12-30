import { useState, useEffect } from 'react';
import { CyberLine } from '../ui/CyberLine';

export const Header = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <header className="relative z-50 flex-none w-full">
            <div className="flex items-center justify-between px-10 h-20 w-full">
                {/* Left: Branding */}
                <div className="flex items-center gap-4">
                    <i className="ri-brain-line text-cyan-400 text-3xl animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"></i>
                    <div className="flex flex-col leading-none">
                        <h1 className="text-2xl font-display font-bold tracking-[0.2em] text-cyan-50">
                            CYBER <span className="text-cyan-400">NEUROSPACE</span>
                        </h1>
                    </div>
                </div>

                {/* Right: Status Info */}
                <div className="flex flex-col items-end justify-center font-display tracking-wider gap-1">
                    {/* Network Status */}
                    <div className="flex items-center gap-2 text-cyan-700">
                        <span className="text-sm font-bold uppercase">NEURAL LINK:</span>
                        <span className="text-emerald-400 font-bold text-sm drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">Online_Secure</span>
                    </div>
                    {/* Time */}
                    <div className="flex items-center gap-2 text-cyan-700">
                        <span className="text-sm font-bold uppercase">LOCAL TIME:</span>
                        <span className="text-cyan-300 font-bold text-sm font-mono">{formatTime(time)}</span>
                    </div>
                </div>
            </div>

            {/* Header Decorative Bottom Line */}
            <div className="absolute bottom-0 left-10 right-10">
                <CyberLine variant="hud" className="w-full" />
            </div>
        </header>
    );
};
