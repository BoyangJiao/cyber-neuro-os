export interface Game {
    id: string;
    titleKey: string;
    descKey: string;
    image: string;
    url?: string;
}

export const games: Game[] = [
    {
        id: 'gain-life',
        titleKey: 'simulation.games.gainLife.title',
        descKey: 'simulation.games.gainLife.desc',
        image: '/images/games/gain-life.webp'
    },
    {
        id: 'escape-the-storm',
        titleKey: 'simulation.games.escapeStorm.title',
        descKey: 'simulation.games.escapeStorm.desc',
        image: '/images/games/escape-storm.webp'
    },
    {
        id: 'dr-mario',
        titleKey: 'simulation.games.drMario.title',
        descKey: 'simulation.games.drMario.desc',
        image: '/images/games/dr-mario.webp'
    },
    {
        id: 'snake-2',
        titleKey: 'simulation.games.snake2.title',
        descKey: 'simulation.games.snake2.desc',
        image: '/images/games/snake-2.webp'
    },
    {
        id: 'arcanoid',
        titleKey: 'simulation.games.arcanoid.title',
        descKey: 'simulation.games.arcanoid.desc',
        image: '/images/games/arcanoid.webp'
    },
    {
        id: 'snake',
        titleKey: 'simulation.games.snake.title',
        descKey: 'simulation.games.snake.desc',
        image: '/images/games/snake.webp'
    }
];
