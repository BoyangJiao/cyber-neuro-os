import { useEffect, useRef } from 'react';
import { useMusicStore } from '../../store/useMusicStore';

export const GlobalAudioPlayer = () => {
    const {
        currentTrack,
        isPlaying,
        volume,
        nextTrack,
        setCurrentTime,
        setDuration
    } = useMusicStore();

    const audioRef = useRef<HTMLAudioElement>(null);

    // Register seek function
    useEffect(() => {
        useMusicStore.setState({
            seek: (time: number) => {
                if (audioRef.current) {
                    audioRef.current.currentTime = time;
                    setCurrentTime(time);
                }
            }
        });
    }, [setCurrentTime]);

    // Initial Auto-play removed to respect BootScreen interaction
    // useEffect(() => { ... }, [play]);

    // Track/Url change sync
    useEffect(() => {
        if (!audioRef.current || !currentTrack) return;

        const url = currentTrack.audioUrl || currentTrack.youtubeUrl;
        if (audioRef.current.src !== url) {
            audioRef.current.src = url;
            if (isPlaying) {
                audioRef.current.play().catch(e => console.warn("Autoplay blocked or playback error:", e));
            }
        }
    }, [currentTrack]);

    // Play/Pause sync
    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play().catch(e => console.warn("Playback error:", e));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Volume sync
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    return (
        <audio
            ref={audioRef}
            className="hidden"
            onTimeUpdate={(e) => {
                setCurrentTime(e.currentTarget.currentTime);
            }}
            onLoadedMetadata={(e) => {
                setDuration(e.currentTarget.duration);
            }}
            onEnded={() => {
                nextTrack();
            }}
        />
    );
};
