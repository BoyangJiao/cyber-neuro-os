export interface Track {
    id: string;
    title: string;
    artist: string;
    album: string;
    coverUrl: string;
    duration: number; // seconds
    genre: 'Synthwave' | 'Darkstep' | 'Industrial' | 'Ambient' | 'Rock' | 'Pop';
    bpm: number;
    youtubeUrl: string;
    audioUrl?: string;
}

export const mockTracks: Track[] = [
    {
        id: 'sh_01',
        title: 'NEURAL HANDSHAKE',
        artist: 'SYSTEM DIAGNOSTIC',
        album: 'NETWORK OPS',
        coverUrl: '/images/music/sh_01.png',
        duration: 372,
        genre: 'Synthwave',
        bpm: 120,
        youtubeUrl: '',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
        id: 'sh_02',
        title: 'NEON RAIN PROTOCOL',
        artist: 'BINARY SOUL',
        album: 'WETWARE',
        coverUrl: '/images/music/sh_02.png',
        duration: 420,
        genre: 'Ambient',
        bpm: 90,
        youtubeUrl: '',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
        id: 'sh_03',
        title: 'SYNTHETIC DREAMS',
        artist: 'CHROME HEART',
        album: 'ANDROID LULLABIES',
        coverUrl: '/images/music/sh_03.png',
        duration: 350,
        genre: 'Pop',
        bpm: 128,
        youtubeUrl: '',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    },
    {
        id: 'sh_04',
        title: 'CYBER HEARTBEAT',
        artist: 'PULSE NETWORK',
        album: 'CORE',
        coverUrl: '/images/music/sh_01.png',
        duration: 310,
        genre: 'Industrial',
        bpm: 140,
        youtubeUrl: '',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    },
    {
        id: 'sh_05',
        title: 'DATA STREAM FLOW',
        artist: 'THE GLITCH',
        album: 'BANDWIDTH',
        coverUrl: '/images/music/sh_02.png',
        duration: 385,
        genre: 'Darkstep',
        bpm: 110,
        youtubeUrl: '',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
    },
    {
        id: 'sh_06',
        title: 'SYSTEM OVERRIDE',
        artist: 'ROOT ACCESS',
        album: 'PERMISSION DENIED',
        coverUrl: '/images/music/sh_03.png',
        duration: 335,
        genre: 'Rock',
        bpm: 135,
        youtubeUrl: '',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
    },
    {
        id: 'sh_07',
        title: 'NIGHT CITY DRIVE',
        artist: 'NEON RIDER',
        album: 'AFTER DARK',
        coverUrl: '/images/music/sh_01.png',
        duration: 298,
        genre: 'Synthwave',
        bpm: 100,
        youtubeUrl: '',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
    },
    {
        id: 'sh_08',
        title: 'PROTOCOL UPLOAD',
        artist: '0xDEADBEEF',
        album: 'MEMORY LEAK',
        coverUrl: '/images/music/sh_02.png',
        duration: 410,
        genre: 'Industrial',
        bpm: 125,
        youtubeUrl: '',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
    },
    {
        id: 'sh_09',
        title: 'MAINFRAME ACCESS',
        artist: 'GATEKEEPER',
        album: 'SECURITY BREACH',
        coverUrl: '/images/music/sh_03.png',
        duration: 360,
        genre: 'Darkstep',
        bpm: 130,
        youtubeUrl: '',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3'
    },
    {
        id: 'sh_10',
        title: 'DIGITAL GHOST',
        artist: 'PHANTOM SIGNAL',
        album: 'VOID',
        coverUrl: '/images/music/sh_01.png',
        duration: 395,
        genre: 'Ambient',
        bpm: 85,
        youtubeUrl: '',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3'
    }
];
