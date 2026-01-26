import { useNavigate } from 'react-router-dom';
import { MotionDiv } from '../components/motion/MotionWrappers';
import { HoloFrame } from '../components/ui/HoloFrame';
import { CyberButton } from '../components/ui/CyberButton';
import { StationList } from '../components/features/music/StationList';
import { MusicPlayer } from '../components/features/music/MusicPlayer';

export const MusicPage = () => {
    const navigate = useNavigate();

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
                className="w-full h-full bg-[var(--color-bg-app)] relative overflow-hidden p-0"
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
                                BROADCAST
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
                        {/* Content Grid */}
                        <div className="flex flex-col lg:flex-row gap-6 w-full h-full overflow-hidden">

                            {/* Left Column: Playlist */}
                            <div className="w-full lg:w-1/3 h-full flex flex-col overflow-hidden border-r border-brand-primary/20 pr-4">
                                <div className="h-full">
                                    <StationList />
                                </div>
                            </div>

                            {/* Right Column: Player Interface */}
                            <div className="flex-1 h-full relative flex flex-col overflow-hidden">
                                <div className="h-full w-full p-0 lg:pr-8">
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
