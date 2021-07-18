export interface Card {
    rank: number | string;
    suit: Suits;
}

export type Suits = 'hearts' | 'spades' | 'diamonds' | 'clubs';

export type ChipsValues = '10' | '25' | '50' | '100';

export type Chips = Record<ChipsValues, number>;

export interface Player {
    id: string;
    name: string;
    hand: Card[];
    score: number;
    chips: Chips;
    status: 'busted' | 'win' | 'lose' | 'gameLost' | 'standoff' | 'bankrupt' | '';
    bet: ChipsValues[];
}

export interface InitialState {
    players: Player[];
    activePlayerId: string;
    status: GameStatus;
    dealer: Dealer;
}

export interface Dealer {
    id: number;
    name: string;
    hand: Card[];
    score: number;
    status: 'busted' | '';
}

export interface State {
    dealer: Dealer;
    players: Player[];
}

export enum GameStatus {
    idle = 'idle',
    playing = 'playing',
    over = 'over',
}
