import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CyberLine } from '../ui/CyberLine';
import { useTranslation } from '../../i18n';

export const Header = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
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
            <div className="flex items-center justify-between px-4 lg:px-6 xl:px-10 2xl:px-12 pt-4 2xl:pt-5 pb-2 2xl:pb-3 w-full">
                {/* Left: Branding - Clickable */}
                <div
                    className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate('/')}
                >
                    <h1 className="text-[18px] 2xl:text-[22px] font-display font-bold tracking-[0.2em] text-cyan-50">
                        {t('header.brand')} <span className="text-cyan-400">{t('header.brandHighlight')}</span>
                    </h1>
                </div>

                {/* Right: Status Info - Single Row */}
                <div className="hidden lg:flex items-center justify-end gap-4 2xl:gap-5 font-display tracking-wider">
                    <span className="relative inline-block text-emerald-400 font-bold text-sm 2xl:text-base drop-shadow-[0_0_5px_rgba(52,211,153,0.5)] group">
                        <span className="block">{t('header.online')}</span>
                        <span className="absolute top-0 left-0 opacity-0 group-hover:opacity-60 text-red-400 translate-x-[1px] animate-pulse">{t('header.online')}</span>
                        <span className="absolute top-0 left-0 opacity-0 group-hover:opacity-60 text-cyan-400 -translate-x-[1px] animate-pulse delay-75">{t('header.online')}</span>
                    </span>
                    <span className="text-cyan-300 font-bold text-sm 2xl:text-base font-mono">{formatTime(time)}</span>
                </div>
            </div>

            {/* Header Decorative Bottom Line */}
            <div className="absolute bottom-0 left-4 right-4 lg:left-6 lg:right-6 xl:left-10 xl:right-10 2xl:left-12 2xl:right-12">
                <CyberLine variant="surface" className="w-full" />
            </div>
        </header>
    );
};
