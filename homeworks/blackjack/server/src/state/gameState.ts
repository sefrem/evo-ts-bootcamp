import { Card, Dealer, GameStatus, InitialState, Player } from "../types";
import { ChipsValues } from "../../../client/src/types/types";
import { shuffleArray } from "../../utils/shuffleArray";
import { createDeck } from "../../utils/createDeck";
import { BroadcastOperator } from "socket.io";
import { countScoreInHand } from "../../utils/countScoreInHand";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const initialDealerState: Dealer = {
  id: 0,
  name: "Dealer",
  hand: [],
  score: 0,
  isBusted: false,
};

export class GameState {
  public deck: Card[] = [];
  public dealer: Dealer = initialDealerState;
  public playersIds: string[] = [];
  public activePlayerId: string = "";
  public status: GameStatus = GameStatus.idle;
  public players: Player[] = [];
  private broadcastOperator: BroadcastOperator<DefaultEventsMap>;

  public getInitialState(): InitialState {
    return {
      dealer: this.dealer,
      players: this.players,
      activePlayerId: this.activePlayerId,
      status: this.status,
    };
  }

  public initGame(
    playerId: string,
    broadcastOperator: BroadcastOperator<DefaultEventsMap>
  ): void {
    this.addPlayer(playerId);
    this.deck = shuffleArray(createDeck());
    this.broadcastOperator = broadcastOperator;
  }

  public addPlayer(playerId: string): void {
    this.players.push({
      id: playerId,
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
      bet: [],
    });
    this.playersIds.push(playerId);
  }

  public setActivePlayer(playerId: string) {
    this.activePlayerId = playerId;
  }

  public setBet(playerId: string, chipValue: ChipsValues): void {
    if (playerId !== this.activePlayerId) return;
    if (this.status !== GameStatus.idle) return;
    const player = this.getPlayerById(playerId);

    if (player?.chips[chipValue] === 0) return;

    player.bet.push(chipValue);

    this.removePlayerChip(chipValue);
  }

  public endBetting(): void {
    if (!this.setNextPlayer()) {
      this.status = GameStatus.playing;
      this.broadcastOperator.emit("gameStateStatus", this.status);
      this.deal();
    }
  }

  private deal() {
    const players = this.players.slice(-this.players.length);

    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        for (let j = 0; j <= players.length; j++) {
          setTimeout(() => {
            if (j === players.length) {
              this.dealer?.hand.push(this.getCardFromTop());
              this.broadcastOperator.emit("gameStateDealer", this.dealer);
            } else {
              players[j].hand.push(this.getCardFromTop());
              players[j].score = countScoreInHand(players[j].hand);
              this.broadcastOperator.emit("gameStatePlayers", this.players);
            }
          }, j * 500);
        }
      }, i * 500 * (this.playersIds.length + 1));
    }
    this.setActivePlayer(this.playersIds[0]);
    this.broadcastOperator.emit("gameStateActivePlayerId", this.activePlayerId);
  }

  private getCardFromTop(): Card {
    return this.deck.splice(0, 1)[0];
  }

  // Set the next player as active and return false if it was the last one
  private setNextPlayer(): boolean {
    if (!this.activePlayerId) return false;
    const activePlayerIndex = this.playersIds.indexOf(this.activePlayerId);
    if (activePlayerIndex === this.playersIds.length - 1) {
      return false;
    } else {
      this.activePlayerId = this.playersIds[activePlayerIndex + 1];
      return true;
    }
  }

  private removePlayerChip(chipValue: ChipsValues) {
    const player = this.getActivePlayer();
    if (player) {
      player.chips[chipValue]--;
    }
  }

  private getActivePlayer() {
    if (this.activePlayerId) {
      return this.getPlayerById(this.activePlayerId);
    }
  }

  private getPlayerById(playerId: string): Player {
    return this.players.find(({ id }) => id === playerId);
  }
}
