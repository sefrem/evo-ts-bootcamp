import socketIOClient, { Socket } from 'socket.io-client';
import GameStore from '../stores/gameStore';
import { ChipsValues, Dealer, GameStatus, InitialState, Player } from '../types/types';
//    private ENDPOINT = 'https://dry-headland-71756.herokuapp.com/';
export class SocketEventService {
    private ENDPOINT = 'http://127.0.0.1:8080';
    private socket: Socket;
    private store: GameStore;

    constructor(store: GameStore) {
        this.store = store;
        this.socket = socketIOClient(this.ENDPOINT);

        this.socket.on('gameCode', (gameCode: string) => {
            this.store.setGameCode(gameCode);
        });

        this.socket.on('addPlayer', (playerId: string) => {
            this.store.setPlayerId(playerId);
        });

        this.socket.on('gameStateInitial', (initialState: InitialState) => {
            this.store.setInitialState(initialState);
        });

        this.socket.on('gameStatePlayers', (players: Player[]) => {
            this.store.setPlayers(players);
        });

        this.socket.on('gameStateDealer', (dealer: Dealer) => {
            this.store.setDealer(dealer);
        });

        this.socket.on('gameStateActivePlayerId', (activePlayerId: string) => {
            this.store.setActivePlayerId(activePlayerId);
        });

        this.socket.on('gameStateStatus', (status: GameStatus) => {
            this.store.setGameStatus(status);
        });

        this.socket.on('gameStateCountdownTimer', (timer: number) => {
            this.store.setCountdown(timer);
        });

        this.socket.on('unknownGame', () => {
            console.log('Unknown game');
        });

        this.socket.on('disconnect', () => {
            this.socket.connect();
        });
    }

    public startNewGame(playerId: string): void {
        this.socket.emit('newGame', playerId);
    }

    public joinGame(roomName: string, playerId: string): void {
        this.socket.emit('joinGame', { roomName, playerId });
    }

    public setBet(playerId: string, chipValue: ChipsValues): void {
        this.socket.emit('setBet', { playerId, chipValue });
    }

    public endBetting(playerId: string): void {
        this.socket.emit('endBetting', playerId);
    }

    public hit(playerId: string): void {
        this.socket.emit('hit', playerId);
    }

    public stand(playerId: string): void {
        this.socket.emit('stand', playerId);
    }
}
