import { Card, Dealer, GameStatus, Player } from "../types";
import { ChipsValues } from "../../../client/src/types/types";

const initialDealerState: Dealer = {
  id: 0,
  name: "Dealer",
  hand: [],
  score: 0,
  isBusted: false,
};

export class GameRoom {
  public deck: Card[] = [];
  public dealer: Dealer = initialDealerState;
  public playersIds: string[] = [];
  public activePlayer: string = "";
  public status: GameStatus = GameStatus.idle;
  public bets: Record<string, ChipsValues[]> | null = null;
  public players: Player[] = [];
}
