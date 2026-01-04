import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CyberLine } from '../ui/CyberLine';

export const Header = () => {
    const navigate = useNavigate();
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
            <div className="flex items-center justify-between px-4 lg:px-6 xl:px-10 pt-4 pb-2 w-full">
                {/* Left: Branding - Clickable */}
                <div
                    className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate('/')}
                >
                    <h1 className="text-[18px] font-display font-bold tracking-[0.2em] text-cyan-50">
                        CYBER <span className="text-cyan-400">NEUROSPACE</span>
                    </h1>
                </div>

                {/* Right: Status Info - Single Row */}
                <div className="hidden lg:flex items-center justify-end gap-4 font-display tracking-wider">
                    <span className="relative inline-block text-emerald-400 font-bold text-sm drop-shadow-[0_0_5px_rgba(52,211,153,0.5)] group">
                        <span className="block">Online</span>
                        <span className="absolute top-0 left-0 opacity-0 group-hover:opacity-60 text-red-400 translate-x-[1px] animate-pulse">Online</span>
                        <span className="absolute top-0 left-0 opacity-0 group-hover:opacity-60 text-cyan-400 -translate-x-[1px] animate-pulse delay-75">Online</span>
                    </span>
                    <span className="text-cyan-300 font-bold text-sm font-mono">{formatTime(time)}</span>
                </div>
            </div>

            {/* Header Decorative Bottom Line */}
            <div className="absolute bottom-0 left-4 right-4 lg:left-6 lg:right-6 xl:left-10 xl:right-10">
                <CyberLine variant="surface" className="w-full" />
            </div>
        </header>
    );
};
