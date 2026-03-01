import { create } from 'zustand';
import { type Track, mockTracks } from '../data/mockMusicData';

export const ambientTrack: Track = {
    id: 'ambient_bg',
    title: 'NEURAL AMBIENCE',
    artist: 'SYSTEM PROTOCOL',
    album: 'BACKGROUND',
    coverUrl: '/images/music/sh_02.png', // Fallback cover, user won't normally see this
    duration: 439,
    genre: 'Ambient',
    bpm: 0,
    youtubeUrl: '',
    audioUrl: '/music/ambient_dream.m4a'
};

interface MusicState {
    currentTrack: Track | null;
    isPlaying: boolean;
    volume: number; // 0 to 100
    playlist: Track[];
    currentTime: number;
    duration: number;
    // Actions
    play: (track?: Track) => void;
    pause: () => void;
    togglePlay: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
    setVolume: (vol: number) => void;
    setPlaylist: (tracks: Track[]) => void;
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
    seek: (time: number) => void;
}

export const useMusicStore = create<MusicState>((set, get) => ({
    currentTrack: ambientTrack, // Initially play ambient background track
    isPlaying: false,
    volume: 75,
    playlist: mockTracks,
    currentTime: 0,
    duration: ambientTrack.duration,

    play: (track) => {
        if (track) {
            set({ currentTrack: track, isPlaying: true });
        } else {
            set({ isPlaying: true });
        }
    },

    pause: () => set({ isPlaying: false }),

    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

    nextTrack: () => {
        const { playlist, currentTrack } = get();
        if (!currentTrack) return;
        let currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
        if (currentIndex === -1) currentIndex = -1; // If current is ambient, it starts at first track in playlist
        const nextIndex = (currentIndex + 1) % playlist.length;
        set({ currentTrack: playlist[nextIndex], isPlaying: true, currentTime: 0 });
    },

    prevTrack: () => {
        const { playlist, currentTrack } = get();
        if (!currentTrack) return;
        const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
        const prevIndex = currentIndex === -1
            ? playlist.length - 1
            : (currentIndex - 1 + playlist.length) % playlist.length;
        set({ currentTrack: playlist[prevIndex], isPlaying: true, currentTime: 0 });
    },

    setVolume: (vol) => set({ volume: Math.max(0, Math.min(100, vol)) }),

    setPlaylist: (tracks) => set({ playlist: tracks }),

    setCurrentTime: (time) => set({ currentTime: time }),

    setDuration: (duration) => set({ duration: duration }),

    // Initial dummy seek, will be overwritten by GlobalAudioPlayer
    seek: () => { },
}));
