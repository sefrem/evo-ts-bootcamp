export interface Card {
    rank: number | string;
    suit: Suits;
}

export type Suits = 'hearts' | 'spades' | 'diamonds' | 'clubs';

export type Players = '0' | '1';

type ChipsValues = '10' | '25' | '50' | '100';

export type Chips = Record<ChipsValues, number>;

export interface Player {
    id: number;
    name: string;
    hand: Card[];
    score: number;
    chips: Chips;
}
