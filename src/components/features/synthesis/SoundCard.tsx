import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../../i18n';
import type { Sound } from '../../../data/sounds';
import { ChamferFrame } from '../../ui/frames/ChamferFrame';
import { ActualWaveform } from './ActualWaveform';
import { useAppStore } from '../../../store/useAppStore';
import { twMerge } from 'tailwind-merge';

interface SoundCardProps {
    sound: Sound;
}

export const SoundCard = ({ sound }: SoundCardProps) => {
    const { t } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [playStartTime, setPlayStartTime] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [audioDurationMs, setAudioDurationMs] = useState(1000); // Default 1s

    const audioRef = useRef<HTMLAudioElement>(null);
    const playTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const { sfxVolume } = useAppStore();

    // Update volume when global store changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = sfxVolume / 100;
        }
    }, [sfxVolume]);

    // Cleanup timeouts to avoid memory leaks if unmounted while playing
    useEffect(() => {
        return () => {
            clearTimeout(playTimeoutRef.current);
            clearTimeout(stopTimeoutRef.current);
        };
    }, []);

    const handleClick = () => {
        if (isPlaying) return; // Ignore clicks if already doing a playback sequence

        if (audioRef.current && sfxVolume > 0) {
            // Precise orchestrated timing for visual entry/exit frames
            const FRONT_PAD_MS = 300;
            const BACK_PAD_MS = 500;
            // Use local state tracked duration, fallback to 1 sec if missing
            const duration = isNaN(audioRef.current.duration) ? audioDurationMs : (audioRef.current.duration * 1000);
            const totalVisualMs = FRONT_PAD_MS + duration + BACK_PAD_MS;

            setIsPlaying(true);
            setPlayStartTime(Date.now());

            // 1. Play actual audio only after the playhead strikes past the front padding
            playTimeoutRef.current = setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch(e => console.warn('Audio playback blocked:', e));
                }
            }, FRONT_PAD_MS);

            // 2. Stop visual sweeping after it has crossed the back empty frames
            stopTimeoutRef.current = setTimeout(() => {
                setIsPlaying(false);
            }, totalVisualMs);
        }
    };

    return (
        <div
            className="flex flex-col items-center group cursor-pointer w-full"
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            // Add keyboard support for accessibility
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
            tabIndex={0}
        >
            {/* Hidden audio element for actual playback */}
            <audio
                ref={audioRef}
                src={sound.audioSrc}
                preload="auto"
                onLoadedMetadata={(e) => setAudioDurationMs(e.currentTarget.duration * 1000)}
            />

            <ChamferFrame
                chamferSize={12}
                className={twMerge(
                    "w-full aspect-square overflow-hidden mb-3 relative flex flex-col transition-all duration-300",
                    isPlaying && "shadow-[0_0_15px_rgba(255,0,85,0.4)] border-brand-primary"
                )}
                showEffects={true} // use standard grid and scanline inherited from ChamferFrame defaults!
                isActive={isPlaying || isHovered} // lock the chamfer frame active effect (bright border+scanline) while playing
            >
                {/* Visual Waveform Area - Top 70% */}
                <div className="flex-[7] w-full relative flex items-center justify-center pt-6 pb-2 px-4 border-b border-brand-primary/10 group-hover:border-brand-primary/40 transition-colors z-20">
                    <ActualWaveform
                        audioUrl={sound.audioSrc}
                        isPlaying={isPlaying}
                        isHovered={isHovered}
                        playStartTime={playStartTime}
                        durationMs={audioDurationMs}
                        barCount={24}
                        color="#00f0ff"
                    />
                </div>

                {/* Metadata Area - Bottom 30% */}
                <div className="flex-[3] w-full flex flex-row items-center justify-start gap-3 px-4 z-20 transition-colors">
                    <span className={twMerge(
                        "text-xl xs:text-2xl transition-all duration-300",
                        isPlaying ? "saturate-100 opacity-100" : "saturate-0 opacity-50 group-hover:saturate-50 group-hover:opacity-80"
                    )}>
                        {sound.icon}
                    </span>
                    <span className={twMerge(
                        "text-[10px] xs:text-xs font-mono tracking-widest uppercase transition-colors truncate",
                        isPlaying ? "text-brand-primary font-bold" : "text-text-secondary group-hover:text-text-primary"
                    )}>
                        {t(sound.titleKey)}
                    </span>
                </div>
            </ChamferFrame>
        </div>
    );
};

