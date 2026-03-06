import { useEffect, useRef } from 'react';
import { useMusicStore } from '../../store/useMusicStore';

export const GlobalAudioPlayer = () => {
    const {
        currentTrack,
        isPlaying,
        volume,
        nextTrack,
        setCurrentTime,
        setDuration,
        setAnalyser
    } = useMusicStore();

    const audioRef = useRef<HTMLAudioElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);

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

    // Initialize WebAudio API
    useEffect(() => {
        if (!audioRef.current) return;

        // Lazy initialization when audio starts to play to comply with browser autoplay policies
        const initAudioContext = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                analyserRef.current = audioContextRef.current.createAnalyser();

                // Configure Analyser
                analyserRef.current.fftSize = 64; // Small size for 6 bars
                analyserRef.current.smoothingTimeConstant = 0.8; // Smooth the transitions

                // Prevent duplicate connection if React StrictMode fires twice
                if (!sourceNodeRef.current && audioRef.current) {
                    sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
                    sourceNodeRef.current.connect(analyserRef.current);
                    analyserRef.current.connect(audioContextRef.current.destination);
                    setAnalyser(analyserRef.current);
                }
            }

            // Resume audio context if it was in suspended state
            if (audioContextRef.current?.state === 'suspended') {
                audioContextRef.current.resume();
            }
        };

        const handlePlayAttempt = () => {
            initAudioContext();
        };

        const audioElement = audioRef.current;
        audioElement.addEventListener('play', handlePlayAttempt);

        return () => {
            audioElement.removeEventListener('play', handlePlayAttempt);
        };
    }, [setAnalyser]);

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
    }, [currentTrack, isPlaying]);

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
            loop={currentTrack?.id === 'ambient_bg'}
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
