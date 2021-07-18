import { BroadcastOperator } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { Dealer, GameStatus, Player } from '../types/types';

export class BroadcastService {
    private broadcastOperator: BroadcastOperator<DefaultEventsMap>;

    constructor(broadcastOperator: BroadcastOperator<DefaultEventsMap>) {
        this.broadcastOperator = broadcastOperator;
    }

    public emitStatus(status: GameStatus) {
        this.broadcastOperator.emit('gameStateStatus', status);
    }

    public emitPlayers(players: Player[]) {
        this.broadcastOperator.emit('gameStatePlayers', players);
    }

    public emitActivePlayerId(activePlayerId: string) {
        this.broadcastOperator.emit('gameStateActivePlayerId', activePlayerId);
    }

    public emitDealer(dealer: Dealer) {
        this.broadcastOperator.emit('gameStateDealer', dealer);
    }

    public emitCountdownTimer(timer: number) {
        this.broadcastOperator.emit('gameStateCountdownTimer', timer);
    }

    public emitPlayersIds(playersIds: string[]) {
        this.broadcastOperator.emit('gameStatePlayersIds')
    }
}
