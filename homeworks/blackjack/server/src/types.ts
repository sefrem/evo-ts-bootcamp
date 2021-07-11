export interface Card {
  rank: number | string;
  suit: Suits;
}

export type Suits = "hearts" | "spades" | "diamonds" | "clubs";

export type ChipsValues = "10" | "25" | "50" | "100";

export type Chips = Record<ChipsValues, number>;

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  score: number;
  chips: Chips;
  isBusted: boolean;
}

// export type Dealer = Omit<Player, "chips">;

export interface Dealer {
  id: number;
  name: string;
  hand: Card[];
  score: number;
  isBusted: boolean;
}

export interface State {
  dealer: Dealer;
  players: Player[];
}

export enum GameStatus {
  idle = "idle",
  playing = "playing",
  over = "over",
}
