import { GameState } from "./gameState";
import { ChipsValues, InitialState, Player } from "../types";
import { BroadcastOperator } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

class GameService {
  public state: Record<string, GameState> = {};
  public clientRooms: Record<string, string> = {};

  public initGame(
    roomName: string,
    playerId: string,
    broadcastOperator: BroadcastOperator<DefaultEventsMap>
  ): void {
    this.state[roomName] = new GameState();
    this.state[roomName].initGame(playerId, broadcastOperator);
  }

  public getInitialState(roomName: string): InitialState {
    return this.state[roomName].getInitialState();
  }

  // public getBetsState(playerId: string): Bets {
  //   return this.getPlayerRoom(playerId)?.bets;
  // }

  public getPlayersState(playerId: string): Player[] {
    return this.getPlayerRoom(playerId).players;
  }

  public getActivePlayerId(playerId: string): string {
    return this.getPlayerRoom(playerId).activePlayerId;
  }

  public addPlayer(roomName: string, playerId: string): void {
    this.state[roomName].addPlayer(playerId);
  }

  public setActivePlayer(playerId: string): void {
    this.getPlayerRoom(playerId).setActivePlayer(playerId);
  }

  public setBet(playerId: string, chipValue: ChipsValues): void {
    this.getPlayerRoom(playerId)?.setBet(playerId, chipValue);
  }

  public endBetting(playerId: string): void {
    this.getPlayerRoom(playerId).endBetting();
  }

  private getPlayerRoom(playerId: string): GameState {
    const roomName = this.clientRooms[playerId];
    return this.state[roomName];
  }

  public getPlayerRoomName(playerId: string): string {
    return this.clientRooms[playerId];
  }

  removeRoom(roomName: string) {
    delete this.state[roomName];
  }
}

export const gameService = new GameService();
