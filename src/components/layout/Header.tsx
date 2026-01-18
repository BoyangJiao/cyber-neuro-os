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
                    <h1 className="relative text-[18px] 2xl:text-[22px] font-display font-bold tracking-[0.2em]">
                        {/* Main Text Layer */}
                        <span className="relative z-10 text-brand-primary">
                            {t('header.brand')} <span className="text-brand-primary">{t('header.brandHighlight')}</span>
                        </span>

                        {/* Ghost / Afterimage Layer */}
                        <span className="absolute bottom-[3px] right-[4px] blur-[1px] select-none pointer-events-none opacity-50 whitespace-nowrap w-max" aria-hidden="true">
                            <span className="text-brand-primary">{t('header.brand')} </span>
                            <span className="text-brand-primary">{t('header.brandHighlight')}</span>
                        </span>
                    </h1>
                </div>

                {/* Right: Status Info - Single Row */}
                <div className="hidden lg:flex items-center justify-end gap-4 2xl:gap-6 font-display tracking-widest">
                    {/* ONLINE Status with Ghost Effect */}
                    <span className="relative inline-block text-status-success font-bold text-sm 2xl:text-base">
                        <span className="relative z-10">{t('header.online')}</span>
                        {/* Ghost / Afterimage Layer */}
                        <span className="absolute bottom-[3px] left-[4px] text-status-success/50 blur-[1px] select-none pointer-events-none" aria-hidden="true">
                            {t('header.online')}
                        </span>
                    </span>

                    {/* Time with Ghost Effect */}
                    <span className="relative inline-block text-[var(--color-text-primary)] font-bold text-sm 2xl:text-base font-sans">
                        <span className="relative z-10">{formatTime(time)}</span>
                        {/* Ghost / Afterimage Layer - Energy Color */}
                        <span className="absolute bottom-[3px] left-[4px] text-[var(--color-brand-primary)]/40 blur-[1px] select-none pointer-events-none" aria-hidden="true">
                            {formatTime(time)}
                        </span>
                    </span>
                </div>
            </div>

            {/* Header Decorative Bottom Line */}
            <div className="absolute bottom-0 left-4 right-4 lg:left-6 lg:right-6 xl:left-10 xl:right-10 2xl:left-12 2xl:right-12">
                <CyberLine variant="surface" className="w-full" />
            </div>
        </header>
    );
};
