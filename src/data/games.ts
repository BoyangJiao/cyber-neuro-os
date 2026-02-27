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
        id: 'golden-sun',
        titleKey: 'simulation.games.goldenSun.title',
        descKey: 'simulation.games.goldenSun.desc',
        image: '/images/games/golden-sun-new.png',
        romUrl: '/roms/Golden Sun (USA, Europe).gba',
        core: 'gba'
    },
    {
        id: 'fire-emblem',
        titleKey: 'simulation.games.fireEmblem.title',
        descKey: 'simulation.games.fireEmblem.desc',
        image: '/images/games/fire-emblem-gba.png',
        romUrl: '/roms/Fire Emblem - The Binding Blade (T).gba',
        core: 'gba'
    },
    {
        id: 'wario-land-vb',
        titleKey: 'simulation.games.warioLandVb.title',
        descKey: 'simulation.games.warioLandVb.desc',
        image: '/images/games/Virtual Boy Wario Land.avif',
        romUrl: '/roms/Virtual Boy Wario Land (Japan, USA) (En).vb',
        core: 'vb'
    }
];
