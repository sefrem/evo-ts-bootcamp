export interface Card {
    rank: number | string;
    suit: Suits;
}

export type Suits = 'hearts' | 'spades' | 'diamonds' | 'clubs';

export type Players = '0' | '1';

export interface Player {
    id: number;
    name: string;
    hand: Card[];
    score: number;
}
