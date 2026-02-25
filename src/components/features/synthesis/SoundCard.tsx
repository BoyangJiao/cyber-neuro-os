import { useState } from 'react';
import { useTranslation } from '../../../i18n';
import type { Sound } from '../../../data/sounds';
import { ChamferFrame } from '../../ui/frames/ChamferFrame';
import { SoundWave } from './SoundWave';

interface SoundCardProps {
    sound: Sound;
}

export const SoundCard = ({ sound }: SoundCardProps) => {
    const { t } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(false);

    // This mimics the structure from Image #2 (RyoOS Soundboard)
    // - Top Area: Waverform visualization
    // - Bottom Area: Icon + Metadata (Title)

    return (
        <div
            className="flex flex-col items-center group cursor-pointer w-full"
            onMouseEnter={() => setIsPlaying(true)}
            onMouseLeave={() => setIsPlaying(false)}
        >
            <ChamferFrame
                chamferSize={12}
                className="w-full aspect-square overflow-hidden mb-3 border border-border-subtle group-hover:border-brand-primary/80 transition-colors duration-300 relative flex flex-col shadow-sm group-hover:shadow-glow"
                bgClassName="bg-bg-surface-2 group-hover:bg-bg-surface transition-colors duration-300"
                showEffects={false}
            >
                {/* Visual Waveform Area - Top 70% */}
                <div className="flex-[7] w-full relative flex items-center justify-center pt-4 pb-2 px-6">
                    {/* The soundwave components animates independently */}
                    <SoundWave
                        isPlaying={isPlaying}
                        color={isPlaying ? "bg-brand-primary" : "bg-text-muted"}
                    />
                </div>

                {/* Metadata Area - Bottom 30% */}
                <div className="flex-[3] w-full border-t border-border-subtle/50 group-hover:border-brand-primary/50 bg-black/20 flex flex-row items-center justify-center gap-3 px-2 z-10">
                    <span className="text-xl xs:text-2xl filter saturate-50 group-hover:saturate-100 transition-all">
                        {sound.icon}
                    </span>
                    <span className="text-[10px] xs:text-xs font-mono tracking-widest text-text-secondary uppercase group-hover:text-brand-primary transition-colors truncate">
                        {t(sound.titleKey)}
                    </span>
                </div>
            </ChamferFrame>
        </div>
    );
};
