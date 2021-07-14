import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { BroadcastOperator } from "socket.io";

import {
  Card,
  Dealer,
  GameStatus,
  InitialState,
  Player,
  ChipsValues,
} from "../types";
import { shuffleArray, createDeck, countScoreInHand } from "../../utils";
import { BroadcastService } from "./broadcastService";

const initialDealerState: Dealer = {
  id: 0,
  name: "Dealer",
  hand: [],
  score: 0,
  isBusted: false,
};

export class GameState {
  private broadcastService: BroadcastService;
  private deck: Card[] = [];
  public dealer: Dealer = initialDealerState;
  public playersIds: string[] = [];
  public activePlayerId: string = "";
  public status: GameStatus = GameStatus.idle;
  public players: Player[] = [];

  constructor(broadcastOperator: BroadcastOperator<DefaultEventsMap>) {
    this.broadcastService = new BroadcastService(broadcastOperator);
  }

  public getInitialState(): InitialState {
    return {
      dealer: this.dealer,
      players: this.players,
      activePlayerId: this.activePlayerId,
      status: this.status,
    };
  }

  public initGame(playerId: string): void {
    this.addPlayer(playerId);
    this.deck = shuffleArray(createDeck());
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

  public setActivePlayer(playerId: string): void {
    this.activePlayerId = playerId;
  }

  public setBet(playerId: string, chipValue: ChipsValues): void {
    if (playerId !== this.activePlayerId) return;
    if (this.status !== GameStatus.idle) return;
    const player = this.getPlayerById(playerId);

    if (player?.chips[chipValue] === 0) return;

    player.bet.push(chipValue);

    this.removePlayerChip(chipValue);

    this.broadcastService.emitPlayers(this.players);
  }

  public endBetting(): void {
    if (!this.setNextPlayer()) {
      this.status = GameStatus.playing;
      this.broadcastService.emitStatus(this.status);
      this.deal();
    }
    this.broadcastService.emitActivePlayerId(this.activePlayerId);
  }

  public hit(): void {
    const activePlayer = this.getActivePlayer();
    activePlayer.hand.push(this.getCardFromTop());
    this.updateActivePlayerScore();

    this.broadcastService.emitPlayers(this.players);

    if (activePlayer.score > 21) {
      this.handlePlayerBusted();
    }
  }

  public stand() {
    if (!this.setNextPlayer()) {
      this.dealerPlay();
      return;
    }
    this.updateActivePlayerScore();

    this.broadcastService.emitPlayers(this.players);
    this.broadcastService.emitActivePlayerId(this.activePlayerId);
  }

  private handlePlayerBusted(): void {
    this.setBusted(this.activePlayerId);
    setTimeout(() => {
      this.removePlayerBet(this.activePlayerId);
      this.broadcastService.emitPlayers(this.players);
    }, 500);
    setTimeout(() => {
      if (!this.setNextPlayer()) {
        this.dealerPlay();
      }
      this.broadcastService.emitActivePlayerId(this.activePlayerId);
    }, 1000);
  }

  private dealerPlay(): void {
    this.setActivePlayer("");
    this.updateDealerScore();

    this.broadcastService.emitActivePlayerId(this.activePlayerId);
    this.broadcastService.emitDealer(this.dealer);

    if (this.checkIfAllBusted()) {
      this.resetGame();
      return;
    }

    const dealerInterval = setInterval(() => {
      if (this.dealer.score >= 17) {
        clearInterval(dealerInterval);
        this.checkGameEnd();
        return;
      }
      this.dealerHit();
      this.broadcastService.emitDealer(this.dealer);
    }, 500);
  }

  private checkGameEnd(): void {
    const dealerScore = this.dealer.score;

    if (!dealerScore) return;

    this.players.forEach(({ id, score, isBusted }) => {
      if (isBusted) {
        return;
      }

      if (dealerScore <= 21 && score <= 21) {
        if (dealerScore > score) {
          console.log(id, "here in second if removePlayerBet");
          this.removePlayerBet(id);
          this.broadcastService.emitPlayers(this.players);
          return;
        }
        if (score > dealerScore) {
          console.log(
            id,
            "here in second if updateChipsPlayerWon",
            score,
            dealerScore
          );
          this.updateChipsPlayerWon(id);
          this.broadcastService.emitPlayers(this.players);
          return;
        }
      }

      if (dealerScore > 21) {
        console.log(id, "here in updateChipsPlayerWon");
        if (this.dealer) {
          this.dealer.isBusted = true;
          this.broadcastService.emitDealer(this.dealer);
        }
        this.updateChipsPlayerWon(id);
        this.broadcastService.emitPlayers(this.players);
        return;
      }
      if (dealerScore === score) {
        console.log(id, "here in updateChipsStandoff");
        this.updateChipsStandoff(id);
        this.broadcastService.emitPlayers(this.players);
        return;
      }
    });
    this.resetGame();
  }

  resetGame() {
    let nextGameTimer = 5;
    const countdownTimer = setInterval(() => {
      nextGameTimer -= 1;
      this.broadcastService.emitCountdownTimer(nextGameTimer);
      if (nextGameTimer! <= 0) {
        this.resetPlayers();
        this.resetDealer();
        this.deck = shuffleArray(createDeck());
        this.setActivePlayer(this.playersIds[0]);
        this.status = GameStatus.idle;
        clearInterval(countdownTimer);
        this.broadcastService.emitPlayers(this.players);
        this.broadcastService.emitDealer(this.dealer);
        this.broadcastService.emitActivePlayerId(this.activePlayerId);
        this.broadcastService.emitStatus(this.status);
      }
    }, 1000);
  }

  private resetPlayers(): void {
    this.players = this.players.map((player) => ({
      ...player,
      hand: [],
      bet: [],
      score: 0,
      isBusted: false,
    }));
  }

  private resetDealer(): void {
    if (this.dealer) {
      this.dealer.hand = [];
      this.dealer.score = 0;
      this.dealer.isBusted = false;
    }
  }

  private updateChipsPlayerWon(playerId: string) {
    const player = this.getPlayerById(playerId);
    player.bet.forEach((value) => {
      player.chips[value] += 2;
    });
  }

  private updateChipsStandoff(playerId: string) {
    const player = this.getPlayerById(playerId);
    player.bet.forEach((value) => {
      player.chips[value] += 1;
    });
  }

  private dealerHit(): void {
    this.dealer.hand.push(this.getCardFromTop());
    this.updateDealerScore();
  }

  private checkIfAllBusted(): boolean {
    return this.players.every(({ isBusted }) => isBusted);
  }

  private updateDealerScore(): void {
    this.dealer.score = countScoreInHand(this.dealer.hand);
  }

  private updateActivePlayerScore(): void {
    const activePlayer = this.getActivePlayer();
    activePlayer.score = countScoreInHand(activePlayer.hand);
  }

  private deal(): void {
    const players = this.players.slice(-this.players.length);

    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        for (let j = 0; j <= players.length; j++) {
          setTimeout(() => {
            if (j === players.length) {
              this.dealer.hand.push(this.getCardFromTop());
              this.broadcastService.emitDealer(this.dealer);
            } else {
              players[j].hand.push(this.getCardFromTop());
              players[j].score = countScoreInHand(players[j].hand);
              this.broadcastService.emitPlayers(this.players);
            }
          }, j * 500);
        }
      }, i * 500 * (this.playersIds.length + 1));
    }
    this.setActivePlayer(this.playersIds[0]);
    this.broadcastService.emitActivePlayerId(this.activePlayerId);
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

  private removePlayerChip(chipValue: ChipsValues): void {
    this.getActivePlayer().chips[chipValue]--;
  }

  private getActivePlayer(): Player {
    return this.getPlayerById(this.activePlayerId);
  }

  private getPlayerById(playerId: string): Player {
    return this.players.find(({ id }) => id === playerId);
  }

  private setBusted(playerId: string): void {
    this.getPlayerById(playerId).isBusted = true;
  }

  private removePlayerBet(playerId: string): void {
    this.getPlayerById(playerId).bet = [];
  }
}
