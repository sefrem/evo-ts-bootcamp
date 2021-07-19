import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { BroadcastOperator } from 'socket.io';

import { Card, Dealer, GameStatus, InitialState, Player, ChipsValues } from '../types';
import { shuffleArray, createDeck, countScoreInHand, generateNickname } from '../../utils';
import { BroadcastService } from './broadcastService';

export const initialDealerState: Dealer = {
    id: 0,
    name: 'Dealer',
    hand: [],
    score: 0,
    status: '',
};

export class GameState {
    private broadcastService: BroadcastService;
    private deck: Card[] = [];
    public dealer: Dealer = {
        id: 0,
        name: 'Dealer',
        hand: [],
        score: 0,
        status: '',
    };
    public playersIds: string[] = [];
    public activePlayerId: string = '';
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
        this.createDeck();
    }

    public addPlayer(playerId: string): void {
        this.players.push({
            id: playerId,
            name: generateNickname(),
            hand: [],
            score: 0,
            chips: {
                '10': 5,
                '25': 4,
                '50': 3,
                '100': 2,
            },
            status: '',
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

    public stand(): void {
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
        this.setActivePlayer('');
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

        this.players.forEach(({ id, score, status }) => {
            if (status === 'busted') {
                this.checkIfBankrupt(id);
                return;
            }

            if (status === 'bankrupt') {
                return;
            }

            if (dealerScore <= 21 && score <= 21) {
                if (dealerScore > score) {
                    this.removePlayerBet(id);
                    this.setPlayerLose(id);
                    this.checkIfBankrupt(id);
                    this.broadcastService.emitPlayers(this.players);
                    return;
                }
                if (score > dealerScore) {
                    this.updateChipsPlayerWon(id);
                    this.setPlayerWin(id);
                    this.broadcastService.emitPlayers(this.players);
                    return;
                }
            }

            if (dealerScore > 21) {
                if (this.dealer) {
                    this.dealer.status = 'busted';
                    this.broadcastService.emitDealer(this.dealer);
                }
                this.setDealerBusted();
                this.setPlayerWin(id);
                this.updateChipsPlayerWon(id);
                this.broadcastService.emitPlayers(this.players);
                return;
            }
            if (dealerScore === score) {
                this.updateChipsStandoff(id);
                this.setPlayerStandoff(id);
                this.broadcastService.emitPlayers(this.players);
                return;
            }
        });
        this.resetGame();
    }

    private resetGame(): void {
        let nextGameTimer = 6;
        const countdownTimer = setInterval(() => {
            nextGameTimer -= 1;
            this.broadcastService.emitCountdownTimer(nextGameTimer);
            if (nextGameTimer! <= 0) {
                this.resetPlayers();
                this.resetDealer();
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
        this.players = this.players.map(player => {
            player.hand = [];
            player.bet = [];
            player.score = 0;
            player.status = player.status === 'bankrupt' ? 'bankrupt' : '';
            return player;
        });
    }

    private resetDealer(): void {
        if (this.dealer) {
            this.dealer.hand = [];
            this.dealer.score = 0;
            this.dealer.status = '';
        }
    }

    private updateChipsPlayerWon(playerId: string): void {
        const player = this.getPlayerById(playerId);
        player.bet.forEach(value => {
            player.chips[value] += 2;
        });
    }

    private updateChipsStandoff(playerId: string): void {
        const player = this.getPlayerById(playerId);
        player.bet.forEach(value => {
            player.chips[value] += 1;
        });
    }

    private dealerHit(): void {
        this.dealer.hand.push(this.getCardFromTop());
        this.updateDealerScore();
    }

    private checkIfAllBusted(): boolean {
        return this.players.every(({ status }) => status === 'busted');
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
                            if (this.players[j].status !== 'bankrupt') {
                                players[j].hand.push(this.getCardFromTop());
                                players[j].score = countScoreInHand(players[j].hand);
                                this.broadcastService.emitPlayers(this.players);
                            }
                        }
                    }, j * 500);
                }
            }, i * 500 * (this.playersIds.length + 1));
        }
        this.setActivePlayer(this.playersIds[0]);
        this.broadcastService.emitActivePlayerId(this.activePlayerId);
    }

    public getCardFromTop(): Card {
        if (this.deck.length <= 10) {
            this.createDeck();
        }
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

    private checkIfBankrupt(playerId: string): void {
        const player = this.getPlayerById(playerId);
        const chipsPlayerHas = Object.values(player.chips).filter(value => value);
        if (chipsPlayerHas.length === 0) {
            player.status = 'bankrupt';
            this.playersIds.splice(this.playersIds.indexOf(playerId), 1);
            this.broadcastService.emitPlayersIds(this.playersIds);
        }
    }

    private getActivePlayer(): Player {
        return this.getPlayerById(this.activePlayerId);
    }

    private getPlayerById(playerId: string): Player {
        return this.players.find(({ id }) => id === playerId);
    }

    private createDeck(): void {
        this.deck = shuffleArray(createDeck());
    }

    private setBusted(playerId: string): void {
        this.getPlayerById(playerId).status = 'busted';
    }

    private removePlayerBet(playerId: string): void {
        this.getPlayerById(playerId).bet = [];
    }

    private setPlayerWin(playerId: string): void {
        this.getPlayerById(playerId).status = 'win';
    }

    private setPlayerLose(playerId: string): void {
        this.getPlayerById(playerId).status = 'lose';
    }

    private setPlayerStandoff(playerId: string): void {
        this.getPlayerById(playerId).status = 'standoff';
    }

    private setDealerBusted(): void {
        this.dealer.status = 'busted';
    }
}
