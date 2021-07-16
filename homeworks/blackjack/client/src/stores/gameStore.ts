import { makeAutoObservable, runInAction } from 'mobx';
import socketIOClient, { Socket } from 'socket.io-client';

import { manageClientId } from '../utils';
import { ChipsValues, Dealer, GameStatus, InitialState, Player } from '../types/types';

const ENDPOINT = 'http://127.0.0.1:4001';

export default class GameStore {
    private socket: Socket;
    playerId: string = '';
    playersIds: string[] = [];
    status: GameStatus | null = null;
    activePlayerId: string = '';
    dealer: Dealer | null = null;
    players: Player[] = [];
    nextGameTimer: number | null = null;
    gameCode: string = '';

    constructor() {
        this.playerId = manageClientId();
        this.socket = socketIOClient(ENDPOINT);

        this.socket.on('gameCode', (gameCode: string) => {
            window.history.pushState({}, '', gameCode);
        });

        this.socket.on('addPlayer', playerId => {
            runInAction(() => {
                this.playerId = playerId;
            });
        });

        this.socket.on('gameStateInitial', ({ dealer, players, activePlayerId, status }: InitialState) => {
            runInAction(() => {
                this.dealer = dealer;
                this.players = players;
                this.activePlayerId = activePlayerId;
                this.status = status;
            });
        });

        this.socket.on('gameStatePlayers', (players: Player[]) => {
            runInAction(() => {
                this.players = players;
            });
        });

        this.socket.on('gameStateDealer', (dealer: Dealer) => {
            runInAction(() => {
                this.dealer = dealer;
            });
        });

        this.socket.on('gameStateActivePlayerId', (activePlayerId: string) => {
            runInAction(() => {
                this.activePlayerId = activePlayerId;
            });
        });

        this.socket.on('gameStateStatus', (status: GameStatus) => {
            runInAction(() => {
                this.status = status;
            });
        });

        this.socket.on('gameStateCountdownTimer', (timer: number) => {
            runInAction(() => {
                this.nextGameTimer = timer;
            });
        });

        this.socket.on('unknownGame', () => {
            console.log('Unknown game');
        });

        this.socket.on('disconnect', () => {
            this.socket.connect();
        });

        makeAutoObservable(
            this,
            {},
            {
                autoBind: true,
            },
        );
    }

    startNewGame() {
        this.socket.emit('newGame', this.playerId);
    }

    joinGame(gameCode: string) {
        this.socket.emit('joinGame', { roomName: gameCode, playerId: this.playerId });
    }

    setBet(chipValue: ChipsValues) {
        if (this.playerId !== this.activePlayerId) return;
        this.socket.emit('setBet', { playerId: this.playerId, chipValue });
    }

    endBetting() {
        this.socket.emit('endBetting', this.playerId);
    }

    hit() {
        this.socket.emit('hit', this.playerId);
    }

    stand() {
        this.socket.emit('stand', this.playerId);
    }

    playerHasBet(): boolean {
        return !!this.players.find(({ id }) => id === this.playerId)?.bet.length;
    }

    isActivePlayerAndClient(id: string): boolean {
        return this.activePlayerId === this.playerId && this.activePlayerId === id;
    }
}
