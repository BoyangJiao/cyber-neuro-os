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
        coverUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=500',
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
        coverUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=500',
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
        coverUrl: 'https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=500',
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
        coverUrl: 'https://images.unsplash.com/photo-1625119047196-8488e36783d7?q=80&w=500',
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
        coverUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=500',
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
        coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=500',
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
        coverUrl: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=500',
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
        coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=500',
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
        coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=500',
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
        coverUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=500',
        duration: 395,
        genre: 'Ambient',
        bpm: 85,
        youtubeUrl: '',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3'
    }
];
