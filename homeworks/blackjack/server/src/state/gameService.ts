import { BroadcastOperator } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { GameState } from "./gameState";
import { ChipsValues, InitialState } from "../types";

class GameService {
  private clientRooms: Record<string, string> = {};
  public state: Record<string, GameState> = {};

  public initGame(
    roomName: string,
    playerId: string,
    broadcastOperator: BroadcastOperator<DefaultEventsMap>
  ): void {
    this.state[roomName] = new GameState(broadcastOperator);
    this.state[roomName].initGame(playerId);
  }

  public getInitialState(roomName: string): InitialState {
    return this.state[roomName].getInitialState();
  }

  public addPlayer(roomName: string, playerId: string): void {
    this.state[roomName].addPlayer(playerId);
  }

  public setActivePlayer(playerId: string): void {
    this.getPlayerRoom(playerId).setActivePlayer(playerId);
  }

  public setBet(playerId: string, chipValue: ChipsValues): void {
    this.getPlayerRoom(playerId).setBet(playerId, chipValue);
  }

  public endBetting(playerId: string): void {
    this.getPlayerRoom(playerId).endBetting();
  }

  public hit(playerId: string): void {
    this.getPlayerRoom(playerId).hit();
  }

  public stand(playerId: string): void {
    this.getPlayerRoom(playerId).stand();
  }

  public getPlayerRoom(playerId: string): GameState {
    const roomName = this.clientRooms[playerId];
    return this.state[roomName];
  }

  public setPlayerRoom(playerId: string, roomName: string): void {
    this.clientRooms[playerId] = roomName;
  }

  public getPlayerRoomName(playerId: string): string {
    return this.clientRooms[playerId];
  }

  removeRoom(roomName: string) {
    delete this.state[roomName];
  }
}

export const gameService = new GameService();
