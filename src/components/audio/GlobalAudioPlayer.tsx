import { useEffect, useRef } from 'react';
import { useMusicStore } from '../../store/useMusicStore';
import { useShallow } from 'zustand/react/shallow';

export const GlobalAudioPlayer = () => {
    const {
        currentTrack,
        isPlaying,
        volume,
        nextTrack,
        setCurrentTime,
        setDuration,
        setAnalyser
    } = useMusicStore(useShallow(state => ({
        currentTrack: state.currentTrack,
        isPlaying: state.isPlaying,
        volume: state.volume,
        nextTrack: state.nextTrack,
        setCurrentTime: state.setCurrentTime,
        setDuration: state.setDuration,
        setAnalyser: state.setAnalyser
    })));

    const audioRef = useRef<HTMLAudioElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

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
    // Note: volume changes are handled by the separate Volume sync effect below.
    // This effect only initializes the AudioContext/GainNode once on first play.
    const volumeRef = useRef(volume);
    useEffect(() => { volumeRef.current = volume; }, [volume]);

    useEffect(() => {
        if (!audioRef.current) return;

        // Lazy initialization when audio starts to play to comply with browser autoplay policies
        const initAudioContext = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                analyserRef.current = audioContextRef.current.createAnalyser();
                gainNodeRef.current = audioContextRef.current.createGain();

                // Configure Analyser
                analyserRef.current.fftSize = 64; // Small size for 6 bars
                analyserRef.current.smoothingTimeConstant = 0.5; // snappier transitions

                // Prevent duplicate connection if React StrictMode fires twice
                if (!sourceNodeRef.current && audioRef.current) {
                    sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);

                    // CONNECT: Source -> Analyser -> Gain -> Destination
                    // This keeps Analyser independent of Gain (Volume)
                    sourceNodeRef.current.connect(analyserRef.current);
                    analyserRef.current.connect(gainNodeRef.current);
                    gainNodeRef.current.connect(audioContextRef.current.destination);

                    // Set initial volume from ref (latest value)
                    gainNodeRef.current.gain.value = volumeRef.current / 100;
                    if (audioRef.current) audioRef.current.volume = 1.0;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setAnalyser]);

    // Track/Url change sync
    useEffect(() => {
        if (!audioRef.current || !currentTrack) return;

        const url = currentTrack.audioUrl || currentTrack.youtubeUrl;
        if (!url) return;

        // Correct for absolute paths when comparing to audioRef.current.src
        const currentSrc = audioRef.current.src;
        const targetUrl = url.startsWith('http') ? url : window.location.origin + (url.startsWith('/') ? '' : '/') + url;

        if (currentSrc !== targetUrl) {
            if (import.meta.env.DEV) console.log(`[GlobalAudioPlayer] Switching source: ${targetUrl}`);
            audioRef.current.src = url;
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("[GlobalAudioPlayer] Playback error on src change:", e));
            }
        }
    }, [currentTrack, isPlaying]);

    // Play/Pause sync
    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play().catch(e => console.warn("[GlobalAudioPlayer] Playback error:", e));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Volume sync - uses GainNode if available, else element volume
    useEffect(() => {
        if (gainNodeRef.current) {
            // Apply volume to GainNode instead of audio element
            gainNodeRef.current.gain.setTargetAtTime(volume / 100, audioContextRef.current?.currentTime || 0, 0.05);
            if (audioRef.current) audioRef.current.volume = 1.0;
        } else if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    return (
        <audio
            ref={audioRef}
            className="hidden"
            crossOrigin="anonymous"
            onTimeUpdate={(e) => {
                setCurrentTime(e.currentTarget.currentTime);
            }}
            onLoadedMetadata={(e) => {
                setDuration(e.currentTarget.duration);
            }}
            onEnded={() => {
                nextTrack();
            }}
            onError={(e) => {
                const error = (e.target as HTMLAudioElement).error;
                console.error("[GlobalAudioPlayer] Audio element error:", error?.message, error?.code);
            }}
        />
    );
};
