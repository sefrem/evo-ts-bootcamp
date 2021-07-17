import { makeAutoObservable, runInAction } from 'mobx';

import { manageClientId } from '../utils';
import { ChipsValues, Dealer, GameStatus, InitialState, Player } from '../types/types';
import { SocketEventService } from '../services/SocketEventService';

export default class GameStore {
    private eventEmitter: SocketEventService;
    playerId: string = '';
    playersIds: string[] = [];
    status: GameStatus | null = null;
    activePlayerId: string = '';
    dealer: Dealer | null = null;
    players: Player[] = [];
    nextGameTimer: number | null = null;
    gameCode: string = '';
    hitDisabled: boolean = false;

    constructor() {
        this.playerId = manageClientId();
        this.eventEmitter = new SocketEventService(this);

        makeAutoObservable(
            this,
            {},
            {
                autoBind: true,
            },
        );
    }

    setGameCode(gameCode: string): void {
        this.gameCode = gameCode;
        const url = new URLSearchParams(window.location.search);
        url.append('code', gameCode);
        window.history.pushState({}, '', `?${url.toString()}`);
    }

    checkGameCode(): void {
        const params = new URLSearchParams(window.location.search);
        const gameCode = params.get('code');
        if (gameCode) {
            this.joinGame(gameCode);
        }
    }

    setPlayerId(playerId: string): void {
        this.playerId = playerId;
    }

    setInitialState({ dealer, players, activePlayerId, status }: InitialState): void {
        this.dealer = dealer;
        this.players = players;
        this.activePlayerId = activePlayerId;
        this.status = status;
    }

    setPlayers(players: Player[]): void {
        this.players = players;
        setTimeout(() => {
            runInAction(() => {
                this.hitDisabled = false;
            });
        }, 500);
    }

    setDealer(dealer: Dealer): void {
        this.dealer = dealer;
    }

    setActivePlayerId(activePlayerId: string): void {
        this.activePlayerId = activePlayerId;
    }

    setGameStatus(status: GameStatus): void {
        this.status = status;
    }

    setCountdown(timer: number) {
        this.nextGameTimer = timer;
    }

    startNewGame(): void {
        this.eventEmitter.startNewGame(this.playerId);
    }

    joinGame(gameCode: string): void {
        this.eventEmitter.joinGame(gameCode, this.playerId);
    }

    setBet(chipValue: ChipsValues): void {
        if (this.playerId !== this.activePlayerId) return;
        this.eventEmitter.setBet(this.playerId, chipValue);
    }

    endBetting(): void {
        this.eventEmitter.endBetting(this.playerId);
    }

    hit(): void {
        this.eventEmitter.hit(this.playerId);

        runInAction(() => {
            this.hitDisabled = true;
        });
    }

    stand(): void {
        this.eventEmitter.stand(this.playerId);
    }

    playerHasBet(): boolean {
        return !!this.players.find(({ id }) => id === this.playerId)?.bet.length;
    }

    isActivePlayerAndClient(playerId: string): boolean {
        return this.activePlayerId === this.playerId && this.activePlayerId === playerId;
    }

    isActivePlayerAndGameGoing(playerId: string): boolean {
        return this.isActivePlayerAndClient(playerId) && this.status === GameStatus.playing;
    }

    showEndBetBtn(playerId: string): boolean {
        return this.isActivePlayerAndClient(playerId) && this.playerHasBet() && this.status === GameStatus.idle;
    }
}
