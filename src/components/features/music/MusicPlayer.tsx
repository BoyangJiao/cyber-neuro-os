import { useMusicStore } from '../../../store/useMusicStore';
import { ChamferFrame } from '../../ui/frames/ChamferFrame';
import clsx from 'clsx';
import { useTranslation } from '../../../i18n';

export const MusicPlayer = () => {
    const { t } = useTranslation();
    const {
        currentTrack,
        isPlaying,
        togglePlay,
        nextTrack,
        prevTrack,
        volume,
        setVolume,
        currentTime,
        duration,
        seek
    } = useMusicStore();

    const formatTime = (secs: number) => {
        if (!secs) return "0:00";
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Seek Handler
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!currentTrack || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = percent * duration;
        seek(newTime);
    };

    if (!currentTrack) return <div className="text-white/50">NO DISC INSERTED</div>;

    return (
        <div className="flex flex-col h-full w-full relative">
            {/* Track Header - Integrated state identifier */}
            <div className="flex items-center mb-4 border-b border-brand-primary/30 pb-2">
                <span className="text-[10px] font-sans font-medium text-brand-primary/80 tracking-widest uppercase">
                    {t('music.nowPlaying')}
                </span>
            </div>

            {/* Main Visual Area (Album Art + Viz) */}
            <div className="flex-1 relative w-full h-full grid grid-cols-[30%_1fr] gap-6 items-center content-center overflow-hidden min-h-0">
                {/* Album Cover */}
                <div className="relative w-full aspect-square max-w-[240px] mx-auto">
                    <ChamferFrame
                        chamferSize={16}
                        bgClassName="bg-black/40"
                        className="w-full h-full"
                        disableHover
                    >
                        <div className="w-full h-full relative overflow-hidden">
                            <img
                                src={currentTrack.coverUrl}
                                alt="Cover"
                                className="relative z-10 w-full h-full object-cover opacity-90"
                            />
                            <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                        </div>
                    </ChamferFrame>
                </div>

                {/* Meta Right */}
                <div className="flex flex-col justify-center h-full min-w-0 pr-2">
                    <h2 className="text-2xl lg:text-3xl font-display font-bold text-white uppercase tracking-tight leading-tight shadow-brand-glow whitespace-pre-wrap break-words">
                        {currentTrack.title}
                    </h2>
                </div>
            </div>

            {/* Controls Area */}
            <div className="flex flex-col gap-6 py-4 border-t border-brand-primary/10">
                {/* Row 1: Progress Bar & Time */}
                <div className="flex items-center gap-4 text-[10px] font-mono text-brand-secondary/60">
                    <span className="min-w-[40px] tabular-nums">{formatTime(currentTime)}</span>
                    <div
                        className="flex-1 h-1 bg-brand-primary/10 rounded-full overflow-hidden relative group cursor-pointer lg:hover:h-1.5 transition-all"
                        onClick={handleSeek}
                    >
                        <div
                            className="h-full bg-brand-primary shadow-brand-glow absolute top-0 left-0"
                            style={{ width: `${(duration ? currentTime / duration : 0) * 100}%` }}
                        ></div>
                    </div>
                    <span className="min-w-[40px] tabular-nums text-right">{formatTime(duration)}</span>
                </div>

                {/* Row 2: Controls & Volume */}
                <div className="flex items-center justify-between">
                    {/* Playback Controls */}
                    <div className="flex items-center gap-6">
                        <button onClick={prevTrack} className="p-1.5 text-brand-secondary/70 hover:text-white transition-colors">
                            <i className="ri-skip-back-line text-2xl"></i>
                        </button>

                        <button
                            onClick={togglePlay}
                            className="w-12 h-12 rounded-full bg-brand-primary text-black hover:bg-white hover:scale-105 transition-all flex items-center justify-center shadow-brand-glow"
                        >
                            <i className={clsx("text-2xl", isPlaying ? "ri-pause-fill" : "ri-play-fill")}></i>
                        </button>

                        <button onClick={nextTrack} className="p-1.5 text-brand-secondary/70 hover:text-white transition-colors">
                            <i className="ri-skip-forward-line text-2xl"></i>
                        </button>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center gap-3 min-w-[140px]">
                        <i className="ri-volume-down-line text-brand-secondary/60 text-lg"></i>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                            className="flex-1 h-0.5 bg-brand-primary/20 rounded-lg appearance-none cursor-pointer hover:bg-brand-primary/40 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-brand-primary [&::-webkit-slider-thumb]:rounded-full shadow-sm"
                        />
                        <span className="text-[10px] font-mono text-brand-secondary/60 w-8 text-right font-bold tabular-nums">{volume}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
