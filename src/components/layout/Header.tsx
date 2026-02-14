import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CyberLine } from '../ui/CyberLine';
import { GhostText } from '../ui/GhostText';
import { useTranslation } from '../../i18n';

const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    });
};

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



    return (
        <header className="relative z-50 flex-none w-full">
            <div className="flex items-center justify-between px-4 lg:px-6 xl:px-10 2xl:px-12 pt-4 2xl:pt-5 pb-2 2xl:pb-3 w-full">
                {/* Left: Branding - Clickable */}
                <div
                    className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate('/')}
                >
                    <h1 className="relative text-[16px] 2xl:text-[22px] font-display font-bold tracking-[0.2em]">
                        {/* Main Text Layer */}
                        <span className="relative z-10 text-brand-primary">
                            {t('header.brand')}<span className="text-brand-primary">{t('header.brandHighlight')}</span>
                        </span>

                        {/* Ghost / Afterimage Layer */}
                        <span className="absolute bottom-[3px] right-[4px] blur-[1px] select-none pointer-events-none opacity-50 whitespace-nowrap w-max" aria-hidden="true">
                            <span className="text-brand-primary">{t('header.brand')}</span>
                            <span className="text-brand-primary">{t('header.brandHighlight')}</span>
                        </span>
                    </h1>
                </div>

                {/* Right: Status Info - Single Row */}
                <div className="hidden lg:flex items-center justify-end gap-4 2xl:gap-6 font-display tracking-widest">
                    {/* ONLINE Status with Ghost Effect */}
                    <GhostText
                        className="text-status-success font-bold text-sm 2xl:text-base"
                        ghostOpacity={0.5}
                        ghostOffset="bottom-[3px] left-[4px]"
                    >
                        {t('header.online')}
                    </GhostText>

                    {/* Time with Ghost Effect */}
                    <GhostText
                        className="text-text-primary font-bold text-sm 2xl:text-base font-sans"
                        ghostOpacity={0.4}
                        ghostOffset="bottom-[3px] left-[4px]"
                    >
                        {formatTime(time)}
                    </GhostText>
                </div>
            </div>

            {/* Header Decorative Bottom Line - Full Width */}
            <div className="absolute bottom-0 left-0 right-0 mx-6 2xl:mx-10">
                <CyberLine variant="surface" className="w-full" />
            </div>
        </header>
    );
};
