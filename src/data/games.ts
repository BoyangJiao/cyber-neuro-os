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
    }
];
