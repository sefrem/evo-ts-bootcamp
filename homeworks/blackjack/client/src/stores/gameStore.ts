import { makeAutoObservable, runInAction } from 'mobx';
import socketIOClient, { Socket } from 'socket.io-client';

import { createDeck, shuffleArray, countScoreInHand, manageClientId } from '../utils';
import { Card, ChipsValues, Dealer, GameStatus, InitialState, Player } from '../types/types';

const ENDPOINT = 'http://127.0.0.1:4001';

export default class GameStore {
    private deck: Card[] = [];
    private socket: Socket;
    private playerId: string = '';
    playersIds: string[] = ['1', '2'];
    status: GameStatus = GameStatus.idle;
    activePlayer: string = '';
    dealer: Dealer | null = null;
    // playerId: number | null = null;
    players: Player[] = [];
    bets: Record<string, ChipsValues[]> | null = null;
    nextGameTimer: number | null = null;
    gameCode: string = '';

    constructor() {
        this.playerId = manageClientId();
        this.socket = socketIOClient(ENDPOINT);

        this.socket.on('gameCode', (gameCode: string) => {
            window.history.pushState({}, '', gameCode);
        });

        // this.socket.on('initState', ({ dealer, players }: InitialState) => {
        //     runInAction(() => {
        //         this.dealer = dealer;
        //         this.players = players;
        //     });
        // });

        this.socket.on('addPlayer', playerId => {
            runInAction(() => {
                this.playerId = playerId;
            });
        });

        this.socket.on('gameState', ({ state, activePlayerId, status }: InitialState) => {
            runInAction(() => {
                this.dealer = state.dealer;
                this.players = state.players;
                this.activePlayer = activePlayerId;
                this.status = status;
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
        this.socket.emit('joinGame', { roomName: gameCode, clientId: this.playerId });
    }

    getDealerScore() {
        return this.dealer?.score;
    }

    getPlayerBet(playerId: string) {
        if (this.bets) {
            return this.bets[playerId];
        }
    }

    getPlayerById(playerId: string) {
        return this.players.find(({ id }) => id === playerId);
    }

    getActivePlayer() {
        if (this.activePlayer) {
            return this.getPlayerById(this.activePlayer);
        }
    }

    setBet(chipValue: ChipsValues) {
        if (this.status !== GameStatus.idle) return;
        if (this.getActivePlayer()?.chips[chipValue] === 0) return;
        if (!this.activePlayer) return;
        if (!this.bets || !this.bets[this.activePlayer]) {
            //@ts-ignore
            this.bets = {
                ...this.bets,
                [this.activePlayer]: new Array(chipValue),
            };
        } else {
            this.bets[this.activePlayer].push(chipValue);
        }
        this.removePlayerChip(chipValue);
    }

    removePlayerChip(chipValue: ChipsValues) {
        const player = this.getActivePlayer();
        if (player) {
            player.chips[chipValue]--;
        }
    }

    startGame() {
        runInAction(() => {
            this.deck = shuffleArray(createDeck());
        });
    }

    deal() {
        const players = this.players.reverse();

        for (let i = 0; i < 2; i++) {
            setTimeout(() => {
                for (let j = 0; j <= players.length; j++) {
                    setTimeout(() => {
                        runInAction(() => {
                            if (j === players.length) {
                                this.dealer?.hand.push(this.getCardFromTop());
                            } else {
                                players[j].hand.push(this.getCardFromTop());
                                players[j].score = countScoreInHand(players[j].hand);
                            }
                        });
                    }, j * 500);
                }
            }, i * 500 * (this.playersIds.length + 1));
        }
        this.setActivePlayer('1');
    }

    dealerHit() {
        runInAction(() => {
            this.dealer?.hand.push(this.getCardFromTop());
        });
        this.updateDealerScore();
    }

    hit() {
        runInAction(() => {
            this.activePlayer && this.getActivePlayer()!.hand.push(this.getCardFromTop());
        });
        this.updateActivePlayerScore();
        if (this.activePlayer && this.getActivePlayer()!.score > 21) {
            this.handlePlayerBusted();
        }
    }

    handlePlayerBusted() {
        this.activePlayer && this.setBusted(this.activePlayer);
        setTimeout(() => {
            this.activePlayer && this.removePlayerBet(this.activePlayer);
        }, 500);
        setTimeout(() => {
            if (!this.setNextPlayer()) {
                this.setActivePlayer('');
                this.dealerPlay();
            }
        }, 1000);
    }

    // set next player and return false if it was the last one
    setNextPlayer(): boolean {
        if (!this.activePlayer) return false;
        const activePlayerIndex = this.playersIds.indexOf(this.activePlayer);
        if (activePlayerIndex === this.playersIds.length - 1) {
            return false;
        } else {
            this.activePlayer = this.playersIds[activePlayerIndex + 1];
            return true;
        }
    }

    stand() {
        if (!this.setNextPlayer()) {
            this.dealerPlay();
        }
        this.updateActivePlayerScore();
    }

    endBetting() {
        if (!this.setNextPlayer()) {
            this.status = GameStatus.playing;
            this.deal();
        }
    }

    //TODO checkNaturals

    checkGameEnd() {
        const dealerScore = this.getDealerScore();

        if (!dealerScore) return;

        this.players.forEach(({ id, score, isBusted }) => {
            if (isBusted) {
                return;
            }

            if (dealerScore <= 21 && score <= 21) {
                if (dealerScore > score) {
                    console.log(id, 'here in second if removePlayerBet');
                    this.removePlayerBet(id);
                    return;
                }
                if (score > dealerScore) {
                    console.log(id, 'here in second if updateChipsPlayerWon', score, dealerScore);
                    this.updateChipsPlayerWon(id);
                    return;
                }
            }

            if (dealerScore > 21) {
                console.log(id, 'here in updateChipsPlayerWon');
                if (this.dealer) {
                    this.dealer.isBusted = true;
                }
                this.updateChipsPlayerWon(id);
                return;
            }
            if (dealerScore === score) {
                console.log(id, 'here in updateChipsStandoff');
                this.updateChipsStandoff(id);
                return;
            }
        });
        this.resetGame();
    }

    updateChipsPlayerWon(playerId: string) {
        if (this.bets) {
            this.bets[playerId].forEach(value => {
                this.getPlayerById(playerId)!.chips[value] += 2;
            });
        }
    }

    updateChipsStandoff(playerId: string) {
        if (this.bets) {
            this.bets[playerId].forEach(value => {
                this.getPlayerById(playerId)!.chips[value] += 1;
            });
        }
    }

    removePlayerBet(playerId: string) {
        if (this.bets) {
            this.bets[playerId] = [];
        }
    }

    resetPlayers() {
        this.players = this.players.map(player => ({
            ...player,
            hand: [],
            score: 0,
            isBusted: false,
        }));
    }

    resetDealer() {
        if (this.dealer) {
            this.dealer.hand = [];
            this.dealer.score = 0;
            this.dealer.isBusted = false;
        }
    }

    checkIfAllBusted(): boolean {
        return this.players.every(({ isBusted }) => isBusted);
    }

    updateDealerScore() {
        if (this.dealer) {
            this.dealer.score = countScoreInHand(this.dealer.hand);
        }
    }

    updateScore() {
        this.playersIds.forEach(playerId => {
            const player = this.getPlayerById(playerId);
            if (player) {
                player.score = countScoreInHand(player.hand);
            }
        });
    }

    updateActivePlayerScore() {
        const activePlayer = this.getActivePlayer();
        if (activePlayer) {
            activePlayer.score = countScoreInHand(activePlayer.hand);
        }
    }

    dealerPlay() {
        this.setActivePlayer('');
        this.updateDealerScore();

        if (this.checkIfAllBusted()) {
            this.resetGame();
            return;
        }

        const dealerInterval = setInterval(() => {
            if (this.dealer && this.dealer.score >= 17) {
                clearInterval(dealerInterval);
                this.checkGameEnd();
                return;
            }
            this.dealerHit();
        }, 500);
    }

    getCardFromTop(): Card {
        return this.deck.splice(0, 1)[0];
    }

    countCountdown() {}

    resetGame() {
        this.nextGameTimer = 5;
        const countdownTimer = setInterval(() => {
            runInAction(() => {
                this.nextGameTimer! -= 1;
            });
            if (this.nextGameTimer! <= 0) {
                this.resetPlayers();
                this.resetDealer();
                this.deck = shuffleArray(createDeck());
                this.setActivePlayer('1');
                this.status = GameStatus.idle;
                this.bets = null;
                clearInterval(countdownTimer);
            }
        }, 1000);
    }

    setActivePlayer(playerId: string) {
        this.activePlayer = playerId;
    }

    setBusted(playerId: string) {
        const player = this.getPlayerById(playerId);
        if (player) {
            player.isBusted = true;
        }
    }
}
