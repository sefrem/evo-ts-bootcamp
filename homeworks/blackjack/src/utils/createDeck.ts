import { Card } from '../types/types';

export function createDeck(): Card[] {
    const deck: Card[] = [];
    const ranks = ['A', 'K', 'Q', 'J', 10, 9, 8, 7, 6, 5, 4, 3, 2];
    const suits = ['S', 'H', 'D', 'C'];

    ranks.forEach(rank => {
        suits.forEach(suit => {
            deck.push({ rank, suit });
        });
    });

    return deck;
}
