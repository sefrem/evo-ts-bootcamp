import { createDeck } from "../../utils/createDeck";
import { shuffleArray } from "../../utils/shuffleArray";
import { GameRoom } from "./gameRoom";

class GameState {
  public state: Record<string, GameRoom> = {};
  public clientRooms: Record<string, string> = {};

  public initGame(roomName: string, clientId: string) {
    this.state[roomName] = new GameRoom();
    this.addPlayer(roomName, clientId);
    this.state[roomName].deck = shuffleArray(createDeck());
    this.state[roomName].playersIds.push(clientId);
  }

  public getInitialState(roomName: string) {
    return {
      state: this.state[roomName],
      activePlayerId: this.state[roomName].activePlayer,
      status: this.state[roomName].status,
    };
  }

  public addPlayer(roomName: string, clientId: string) {
    this.state[roomName].players.push({
      id: clientId,
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
    this.state[roomName].playersIds.push(clientId);
  }

  public setActivePlayer(playerId: string) {
    this.state[this.clientRooms[playerId]].activePlayer = playerId;
  }

  // public setBet(chipValue: ChipsValues) {
  //   if (this.getActivePlayer()?.chips[chipValue] === 0) return;
  //   if (!this.activePlayer) return;
  //   if (!this.bets || !this.bets[this.activePlayer]) {
  //     //@ts-ignore
  //     this.bets = {
  //       ...this.bets,
  //       [this.activePlayer]: new Array(chipValue),
  //     };
  //   } else {
  //     this.bets[this.activePlayer].push(chipValue);
  //   }
  //   this.removePlayerChip(chipValue);
  // }

  // private getActivePlayer() {
  //   if (this.activePlayer) {
  //     return this.getPlayerById(this.activePlayer);
  //   }
  // }

  // private getPlayerById(playerId: string) {
  //   return this.players.find(({ id }) => id === playerId);
  // }

  removeRoom(roomName: string) {
    delete this.state[roomName];
  }
}

export const gameState = new GameState();
