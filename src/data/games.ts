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
        id: 'pokemon-emerald',
        titleKey: 'simulation.games.pokemonEmerald.title',
        descKey: 'simulation.games.pokemonEmerald.desc',
        image: '/images/games/pokemon-emerald.webp',
        romUrl: 'https://archive.org/download/pokemon-emerald-version_202206/Pokemon%20Emerald%20%28U%29%20%28Trashman%29.gba',
        core: 'gba'
    },
    {
        id: 'zelda-minish-cap',
        titleKey: 'simulation.games.zeldaMinish.title',
        descKey: 'simulation.games.zeldaMinish.desc',
        image: '/images/games/zelda-minish.webp',
        romUrl: 'https://archive.org/cors/Zelda_Link_to_the_Past_GBA/Legend%20of%20Zelda%2C%20The%20-%20The%20Minish%20Cap%20%28Europe%29%20%28En%2CFr%2CDe%2CEs%2CIt%29.gba',
        core: 'gba'
    },
    {
        id: 'kirby-amazing-mirror',
        titleKey: 'simulation.games.kirbyMirror.title',
        descKey: 'simulation.games.kirbyMirror.desc',
        image: '/images/games/kirby-mirror.webp',
        romUrl: 'https://archive.org/cors/Kirby_Amazing_Mirror/Kirby%20and%20the%20Amazing%20Mirror.gba',
        core: 'gba'
    },
    {
        id: 'mario-advance-4',
        titleKey: 'simulation.games.marioAdvance.title',
        descKey: 'simulation.games.marioAdvance.desc',
        image: '/images/games/mario-advance.webp',
        romUrl: 'https://archive.org/cors/Super_Mario_Bros_3_GBA/Super%20Mario%20Advance%204%20-%20Super%20Mario%20Bros.%203%20%28USA%2C%20Australia%29%20%28Rev%201%29.gba',
        core: 'gba'
    },
    {
        id: 'metroid-fusion',
        titleKey: 'simulation.games.metroidFusion.title',
        descKey: 'simulation.games.metroidFusion.desc',
        image: '/images/games/metroid-fusion.webp',
        romUrl: 'https://archive.org/cors/Metroid_Fusion_GBA/Metroid%20Fusion%20%28USA%，%20Australia%29.gba',
        core: 'gba'
    },
    {
        id: 'castlevania-aria',
        titleKey: 'simulation.games.castlevaniaAria.title',
        descKey: 'simulation.games.castlevaniaAria.desc',
        image: '/images/games/castlevania-aria.webp',
        romUrl: 'https://archive.org/cors/Castlevania-AriaOfSorrow_Europe_EnFrDe/Castlevania%20-%20Aria%20of%20Sorrow%20%28Europe%29%20%28En%2CFr%2CDe%29.gba',
        core: 'gba'
    }
];
