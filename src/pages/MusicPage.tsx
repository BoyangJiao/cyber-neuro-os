import { useNavigate } from 'react-router-dom';
import { MotionDiv } from '../components/motion/MotionWrappers';
import { HoloFrame } from '../components/ui/HoloFrame';
import { CyberButton } from '../components/ui/CyberButton';
import { StationList } from '../components/features/music/StationList';
import { MusicPlayer } from '../components/features/music/MusicPlayer';
import { useTranslation } from '../i18n';

export const MusicPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <MotionDiv
            className="absolute top-0 left-0 w-full h-full z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.3, ease: "circOut" }}
        >
            <HoloFrame
                variant="lines"
                className="w-full h-full bg-black/40 backdrop-blur-[1px] relative overflow-hidden p-0"
                showAtmosphere={true}
                showMask={true}
            >
                {/* Main Container - Vertical Flex */}
                <div className="w-full h-full flex flex-col">

                    {/* === HEADER === */}
                    <div className="w-full shrink-0 flex items-center justify-between relative z-[60] px-1 2xl:px-2 pt-1 2xl:pt-1 pb-1 2xl:pb-1">
                        {/* Left Placeholder */}
                        <div className="w-16 2xl:w-20" />

                        {/* Center Title */}
                        <div className="flex flex-col items-center">
                            <h1 className="text-sm 2xl:text-lg font-bold text-brand-secondary tracking-[0.3em] uppercase">
                                {t('features.music')}
                            </h1>
                        </div>

                        {/* Right Close Button */}
                        <div className="flex justify-end w-16 2xl:w-20">
                            <CyberButton
                                variant="ghost"
                                icon={<i className="ri-close-line text-xl 2xl:text-2xl" />}
                                onClick={() => navigate('/')}
                                className="text-brand-primary hover:text-brand-secondary transition-colors"
                                iconOnly
                            />
                        </div>
                    </div>

                    {/* === MAIN CONTENT === */}
                    <div className="flex-1 w-full min-h-0 px-4 2xl:px-6 pb-4 2xl:pb-6 relative z-10">
                        {/* Content Grid — mobile: player on top, station list scrolls below */}
                        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full h-full overflow-hidden">

                            {/* Playlist */}
                            <div className="order-2 lg:order-1 flex-1 min-h-0 w-full lg:w-1/3 lg:flex-none lg:h-full flex flex-col overflow-hidden lg:border-r border-brand-primary/20 lg:pr-4">
                                <div className="h-full">
                                    <StationList />
                                </div>
                            </div>

                            {/* Player Interface */}
                            <div className="order-1 lg:order-2 shrink-0 lg:flex-1 lg:h-full relative flex flex-col overflow-hidden">
                                <div className="w-full lg:h-full p-0 lg:pr-8">
                                    <MusicPlayer />
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </HoloFrame>
        </MotionDiv>
    );
};
