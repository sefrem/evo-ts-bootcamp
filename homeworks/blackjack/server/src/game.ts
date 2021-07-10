import { Card, Dealer, Player, State } from "./types";

import { createDeck } from "../utils/createDeck";
import { shuffleArray } from "../utils/shuffleArray";

const initialPlayersState: Player[] = [
  {
    id: 1,
    name: "SomeTestName",
    hand: [],
    score: 0,
    chips: {
      "10": 5,
      "25": 4,
      "50": 3,
      "100": 2,
    },
    isBusted: false,
  },
];

const initialDealerState: Dealer = {
  id: 0,
  name: "Dealer",
  hand: [],
  score: 0,
  isBusted: false,
};

class GameState {
  private deck: Card[] = [];
  public state: Record<string, State> = {};
  public clientRooms: Record<string, string> = {};

  initGame(roomName: string) {
    this.state[roomName] = {
      dealer: initialDealerState,
      players: initialPlayersState,
    };
    this.deck = shuffleArray(createDeck());
  }

  addPlayer(roomName: string) {
    this.state[roomName].players.push({
      id: 2,
      name: "SomeTestName",
      hand: [],
      score: 0,
      chips: {
        "10": 5,
        "25": 4,
        "50": 3,
        "100": 2,
      },
      isBusted: false,
    });
  }
}

export const gameState = new GameState();
