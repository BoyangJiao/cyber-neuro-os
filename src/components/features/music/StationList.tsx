
import { motion } from 'framer-motion';
import { useMusicStore } from '../../../store/useMusicStore';
import { type Track } from '../../../data/mockMusicData';
import { AudioWaveform } from '../../ui/AudioWaveform';
import clsx from 'clsx';

export const StationList = () => {
    const { playlist, currentTrack, play, isPlaying } = useMusicStore();

    return (
        <div className="flex flex-col h-full w-full relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-brand-primary/30 pb-2">
                <h3 className="text-xs font-display font-bold text-brand-primary tracking-wider uppercase">
                    <i className="ri-radio-2-line mr-2"></i>
                    Signal Source
                </h3>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-2">
                {playlist.map((track, index) => (
                    <StationItem
                        key={track.id}
                        track={track}
                        isActive={currentTrack?.id === track.id}
                        isPlaying={isPlaying}
                        index={index}
                        onClick={() => play(track)}
                    />
                ))}
            </div>
        </div>
    );
};

interface StationItemProps {
    track: Track;
    isActive: boolean;
    isPlaying: boolean;
    index: number;
    onClick: () => void;
}

const StationItem = ({ track, isActive, isPlaying, index, onClick }: StationItemProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={onClick}
            className={clsx(
                "group relative w-full p-3 cursor-pointer transition-all duration-300 border-l-2",
                isActive
                    ? "bg-brand-primary/10 border-brand-primary"
                    : "bg-black/20 border-transparent hover:bg-brand-primary/5 hover:border-brand-primary/50"
            )}
        >
            {/* Active Highlight Overlay */}
            {isActive && (
                <div className="absolute inset-0 bg-brand-primary/5 pointer-events-none animate-pulse-slow"></div>
            )}

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    {/* Frequency Number (Fake) */}
                    <span className={clsx(
                        "font-mono text-sm tracking-tighter",
                        isActive ? "text-brand-primary" : "text-brand-secondary/70"
                    )}>
                        {(88.9 + index * 1.4).toFixed(1)}
                    </span>

                    <div className="flex flex-col">
                        <span className={clsx(
                            "font-display font-medium text-sm transition-colors",
                            isActive ? "text-cyan-50 shadow-cyan-glow" : "text-white/80 group-hover:text-white"
                        )}>
                            {track.title}
                        </span>
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                            {track.artist}
                        </span>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-center w-6">
                    {isActive ? (
                        <AudioWaveform isPlaying={isPlaying} className="text-brand-primary" />
                    ) : (
                        <i className="ri-play-fill text-white/30 group-hover:text-white/80 transition-colors text-lg"></i>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
