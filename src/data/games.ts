export interface Game {
    id: string;
    titleKey: string;
    descKey: string;
    image: string;
    romUrl: string;
    core: string;
}

export const games: Game[] = [
    {
        id: 'doom-gba',
        titleKey: 'simulation.games.doomGba.title',
        descKey: 'simulation.games.doomGba.desc',
        image: '/images/games/doom-gba.png',
        romUrl: '/roms/GBADoom.gba',
        core: 'gba'
    },
    {
        id: 'pacman-gba',
        titleKey: 'simulation.games.pacmanGba.title',
        descKey: 'simulation.games.pacmanGba.desc',
        image: '/images/games/pacman-gba.png',
        romUrl: '/roms/GapMan.gba',
        core: 'gba'
    },
    {
        id: 'golden-sun-2',
        titleKey: 'simulation.games.goldenSun2.title',
        descKey: 'simulation.games.goldenSun2.desc',
        image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=500', // Temporary placeholder
        romUrl: '/roms/GoldenSun2.gba',
        core: 'gba'
    }
];
