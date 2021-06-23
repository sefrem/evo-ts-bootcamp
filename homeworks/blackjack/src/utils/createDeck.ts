import { ICard, Suits } from '../types/types';

export function createDeck(): ICard[] {
    const deck: ICard[] = [];
    const ranks = ['A', 'K', 'Q', 'J', 10, 9, 8, 7, 6, 5, 4, 3, 2];
    const suits: Suits[] = ['spades', 'hearts', 'diamonds', 'clubs'];

    ranks.forEach(rank => {
        suits.forEach(suit => {
            deck.push({ rank, suit });
        });
    });

    return deck;
}
