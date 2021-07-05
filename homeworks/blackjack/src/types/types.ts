import { initialState } from '../stores/gameStore';

export interface Card {
    rank: number | string;
    suit: Suits;
}

export type Suits = 'hearts' | 'spades' | 'diamonds' | 'clubs';

export type Players = keyof typeof initialState;

// export type Players = '0' | '1' | '2';

export type ChipsValues = '10' | '25' | '50' | '100';

export type Chips = Record<ChipsValues, number>;

export interface Player {
    id: number;
    name: string;
    hand: Card[];
    score: number;
    chips: Chips;
    isBusted: boolean;
}

export enum GameStatus {
    idle = 'idle',
    playing = 'playing',
    over = 'over',
}
