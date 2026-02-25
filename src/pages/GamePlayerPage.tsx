import { useParams, useNavigate } from 'react-router-dom';
import { games } from '../data/games';
import { RetroEmulator } from '../components/features/game/RetroEmulator';
import { MotionDiv } from '../components/motion/MotionWrappers';
import { HoloFrame } from '../components/ui/HoloFrame';
import { CyberButton } from '../components/ui/CyberButton';
import { useTranslation } from '../i18n';

/**
 * GamePlayerPage
 * 
 * Main screen for playing a loaded Retro Emulator game.
 */
export const GamePlayerPage = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const game = games.find(g => g.id === gameId);

    if (!game) {
        return (
            <div className="w-full h-full flex items-center justify-center text-status-error font-mono flex-col gap-4">
                <h2>ERROR: ROM NOT FOUND</h2>
                <CyberButton onClick={() => navigate('/games')}>RETURN TO DIRECTORY</CyberButton>
            </div>
        );
    }

    return (
        <MotionDiv
            className="absolute top-0 left-0 w-full h-full z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.4, ease: "circOut" }}
        >
            <HoloFrame
                variant="lines"
                className="w-full h-full bg-black relative overflow-hidden p-0 flex flex-col"
                showAtmosphere={false}
                showMask={false}
            >
                {/* Header matching OS style */}
                <div className="w-full shrink-0 flex items-center justify-between relative z-[60] px-4 py-3 bg-black/80 backdrop-blur-md border-b border-border-subtle">
                    <div className="flex-1 flex items-center justify-start">
                        <CyberButton
                            variant="ghost"
                            icon={<i className="ri-arrow-left-line text-xl" />}
                            onClick={() => navigate('/games')}
                            className="text-text-secondary hover:text-white"
                        >
                            <span className="ml-2 font-mono tracking-widest text-sm uppercase">BACK</span>
                        </CyberButton>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center">
                        <h1 className="text-sm md:text-base font-display tracking-[0.3em] text-status-error uppercase">
                            {t(game.titleKey)}
                        </h1>
                    </div>

                    <div className="flex-1 flex justify-end">
                        <div className="text-[10px] font-mono tracking-widest text-text-muted uppercase">
                            EMULATOR JS INSTANCE
                        </div>
                    </div>
                </div>

                {/* Main Player Area */}
                <div className="flex-1 w-full relative">
                    <RetroEmulator
                        gameUrl={game.romUrl}
                        gameName={t(game.titleKey)}
                        core={game.core}
                    />
                </div>
            </HoloFrame>
        </MotionDiv>
    );
};
