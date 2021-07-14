export interface Card {
    rank: number | string;
    suit: Suits;
}

export type Suits = 'hearts' | 'spades' | 'diamonds' | 'clubs';

export interface InitialState {
    players: Player[];
    activePlayerId: string;
    status: GameStatus;
    dealer: Dealer;
}

export interface GameState {
    dealer: Dealer;
    players: Player[];
}

export type ChipsValues = '10' | '25' | '50' | '100';

export type Chips = Record<ChipsValues, number>;

export interface Player {
    id: string;
    name: string;
    hand: Card[];
    score: number;
    chips: Chips;
    isBusted: boolean;
    bet: ChipsValues[];
}

export type Dealer = Omit<Player, 'chips'>;

export enum GameStatus {
    idle = 'idle',
    playing = 'playing',
    over = 'over',
}
