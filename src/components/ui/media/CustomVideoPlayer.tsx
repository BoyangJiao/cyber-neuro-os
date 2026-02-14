import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusicStore } from '../../../store/useMusicStore';

interface CustomVideoPlayerProps {
    src: string;
    loop?: boolean;
    poster?: string;
    className?: string;
}

export const CustomVideoPlayer = ({ src, loop = false, poster, className = '' }: CustomVideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    // Global Audio Store
    const globalVolume = useMusicStore((state) => state.volume);
    const pauseGlobalMusic = useMusicStore((state) => state.pause);

    // Sync volume with global settings
    useEffect(() => {
        if (videoRef.current) {
            // Convert 0-100 to 0-1 range
            videoRef.current.volume = globalVolume / 100;
        }
    }, [globalVolume]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateTime = () => {
            setCurrentTime(video.currentTime);
            setProgress((video.currentTime / video.duration) * 100);
        };

        const updateDuration = () => {
            setDuration(video.duration);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            if (loop) {
                video.currentTime = 0;
                video.play().catch(console.error);
                setIsPlaying(true);
            }
        };

        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('loadedmetadata', updateDuration);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('timeupdate', updateTime);
            video.removeEventListener('loadedmetadata', updateDuration);
            video.removeEventListener('ended', handleEnded);
        };
    }, [loop]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                // Pause background music before playing video
                pauseGlobalMusic();
                // Ensure volume is synced before playing
                videoRef.current.volume = globalVolume / 100;
                videoRef.current.play().catch(console.error);
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current) {
            const progressBar = e.currentTarget;
            const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
            videoRef.current.currentTime = clickPosition * videoRef.current.duration;
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div
            className={`relative group rounded-lg overflow-hidden border-0 outline-none ring-0 select-none ${className}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-auto object-cover"
                onClick={togglePlay}
                playsInline
                // Default unmuted as requested ("打开声音")
                muted={false}
            />

            {/* Overlay Gradient on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'}`} />

            {/* Center Play Button (only when paused) */}
            <AnimatePresence>
                {!isPlaying && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-brand-primary/20 hover:bg-brand-primary/30 border border-brand-primary/50 text-brand-primary backdrop-blur-sm transition-all duration-300 group-hover:scale-110"
                        onClick={togglePlay}
                    >
                        <i className="ri-play-fill text-3xl sm:text-4xl ml-1" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Controls Bar */}
            <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 transform ${isHovering || !isPlaying ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                {/* Progress Bar */}
                <div
                    className="w-full h-1 bg-white/20 mb-4 cursor-pointer relative group/progress"
                    onClick={handleSeek}
                >
                    <div
                        className="h-full bg-brand-primary relative"
                        style={{ width: `${progress}%` }}
                    >
                        {/* Glow effect on progress bar end */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-brand-primary rounded-full shadow-[0_0_10px_var(--color-brand-primary)] opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Play/Pause Toggle */}
                        <button
                            onClick={togglePlay}
                            className="text-text-primary hover:text-brand-primary transition-colors focus:outline-none"
                        >
                            <i className={`ri-${isPlaying ? 'pause' : 'play'}-fill text-2xl`} />
                        </button>

                        {/* Time */}
                        <div className="text-xs font-mono text-text-secondary tracking-wider">
                            <span className="text-brand-primary">{formatTime(currentTime)}</span>
                            <span className="mx-1">/</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Right Side: Settings / Fullscreen (optional) */}
                    <div className="flex items-center gap-3">
                        {/* Add Cyberpunk decorative elements */}
                        <div className="h-px w-8 bg-brand-primary/30" />
                        <div className="w-1.5 h-1.5 bg-brand-primary/50 rotate-45" />
                    </div>
                </div>
            </div>
        </div>
    );
};
