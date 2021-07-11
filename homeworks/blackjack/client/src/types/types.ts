// import { initialState } from '../stores/gameStore';

export interface Card {
    rank: number | string;
    suit: Suits;
}

export type Suits = 'hearts' | 'spades' | 'diamonds' | 'clubs';

export interface InitialState {
    state: GameState;
    activePlayerId: string;
    status: GameStatus;
}

export interface GameState {
    dealer: Dealer;
    players: Player[];
}

// export type Players = keyof typeof initialState;

// export type Players = '0' | '1' | '2';

export type ChipsValues = '10' | '25' | '50' | '100';

export type Chips = Record<ChipsValues, number>;

export interface Player {
    id: string;
    name: string;
    hand: Card[];
    score: number;
    chips: Chips;
    isBusted: boolean;
}

export type Dealer = Omit<Player, 'chips'>;

export enum GameStatus {
    idle = 'idle',
    playing = 'playing',
    over = 'over',
}
