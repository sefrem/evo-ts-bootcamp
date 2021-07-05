import { makeAutoObservable, runInAction } from 'mobx';

import { createDeck } from '../utils/createDeck';
import { shuffleArray } from '../utils/shuffleArray';
import { Card, ChipsValues, GameStatus, Player, Players } from '../types/types';

export const initialState = {
    '0': {
        id: 0,
        name: 'Dealer',
        hand: [],
        score: 0,
        chips: {
            '10': 5,
            '25': 4,
            '50': 3,
            '100': 2,
        },
        isBusted: false,
    },
    '1': {
        id: 1,
        name: 'SomeTestName',
        hand: [],
        score: 0,
        chips: {
            '10': 5,
            '25': 4,
            '50': 3,
            '100': 2,
        },
        isBusted: false,
    },
    '2': {
        id: 2,
        name: 'NewPlayer',
        hand: [],
        score: 0,
        chips: {
            '10': 5,
            '25': 4,
            '50': 3,
            '100': 2,
        },
        isBusted: false,
    },
};

export default class GameStore {
    private deck: Card[] = [];
    playersIds: Players[] = ['0', '1', '2'];
    status: GameStatus = GameStatus.idle;
    activePlayer: Players = '1';
    players: Record<Players, Player> = initialState;
    bets: Record<Players, ChipsValues[]> | null = null;
    winner = '';

    constructor() {
        makeAutoObservable(
            this,
            {},
            {
                autoBind: true,
            },
        );
    }

    getActivePlayerScore() {
        return this.players[this.activePlayer].score;
    }

    getPlayerBet(playerId: Players) {
        if (this.bets) {
            return this.bets[playerId];
        }
    }

    setBet(chipValue: ChipsValues) {
        if (this.status !== GameStatus.idle) return;
        if (this.players[this.activePlayer].chips[chipValue] === 0) return;
        if (!this.bets || !this.bets[this.activePlayer]) {
            //@ts-ignore
            this.bets = {
                ...this.bets,
                [this.activePlayer]: Array(chipValue),
            };
            this.removePlayerChip(chipValue);
        } else {
            this.bets[this.activePlayer].push(chipValue);
            this.removePlayerChip(chipValue);
        }
    }

    removePlayerChip(chipValue: ChipsValues) {
        this.players[this.activePlayer].chips[chipValue]--;
    }

    startGame() {
        runInAction(() => {
            this.deck = shuffleArray(createDeck());
        });
    }

    deal() {
        const players = Object.values(this.players).reverse();

        for (let i = 0; i < 2; i++) {
            setTimeout(() => {
                for (let j = 0; j < players.length; j++) {
                    setTimeout(() => {
                        runInAction(() => {
                            players[j].hand.push(this.getCardFromTop());
                        });
                        this.updateScore();
                    }, j * 500);
                }
            }, i * 500 * this.playersIds.length);
        }
        this.setActivePlayer('1');
    }

    hit() {
        runInAction(() => {
            this.players[this.activePlayer].hand.push(this.getCardFromTop());
        });
        this.updateScore();
        if (this.activePlayer !== '0' && this.getActivePlayerScore() > 21) {
            setTimeout(() => {
                this.setBusted(this.activePlayer);
                this.removePlayerBet(this.activePlayer);
            }, 500);
            setTimeout(() => {
                if (!this.setNextPlayer()) {
                    this.setActivePlayer('0');
                    this.checkGameEnd();
                }
                this.updateScore();
            }, 1000);
        }
    }

    setBusted(playerId: Players) {
        this.players[playerId].isBusted = true;
    }

    // set next player and return false if it was the last one
    setNextPlayer(): boolean {
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
            this.setActivePlayer('0');
            this.dealerPlay();
        }
        this.updateScore();
    }

    endBetting() {
        if (!this.setNextPlayer()) {
            this.status = GameStatus.playing;
            this.deal();
        }
    }

    //TODO checkNaturals

    checkGameEnd() {
        const dealerScore = this.getActivePlayerScore();

        Object.entries(this.players).forEach(([id, player]) => {
            if (id === '0') {
                return;
            }
            console.log('dealerScore', dealerScore, id);

            if (dealerScore <= 21 && player.score <= 21) {
                if (dealerScore > player.score) {
                    console.log(id, 'here in second if removePlayerBet');
                    this.removePlayerBet(id as Players);
                    return;
                }
                if (player.score > dealerScore) {
                    console.log(id, 'here in second if updateChipsPlayerWon');
                    this.setBusted('0');
                    this.updateChipsPlayerWon(id as Players);
                    return;
                }
            }

            if (dealerScore > 21) {
                console.log(id, 'here in updateChipsPlayerWon');
                this.setBusted('0');
                this.updateChipsPlayerWon(id as Players);
                return;
            }
            if (dealerScore === player.score) {
                console.log(id, 'here in updateChipsStandoff');
                this.updateChipsStandoff(id as Players);
                return;
            }
        });
    }

    updateChipsPlayerWon(playerId: Players) {
        console.log(playerId);
        if (this.bets) {
            this.bets[playerId].forEach(value => {
                this.players[playerId].chips[value] += 2;
            });
        }
    }

    updateChipsStandoff(playerId: Players) {
        console.log(playerId);
        if (this.bets) {
            this.bets[playerId].forEach(value => {
                this.players[playerId].chips[value] += 1;
            });
        }
    }

    removePlayerBet(playerId: Players) {
        if (this.bets) {
            this.bets[playerId] = [];
        }
    }

    emptyHands() {
        this.playersIds.forEach(playerId => {
            const player = this.players[playerId];
            player.hand = [];
            player.score = 0;
        });
    }

    updateScore() {
        let score = 0;
        let acesCounter = 0;
        const activePlayer = this.players[this.activePlayer];
        activePlayer.hand.forEach(({ rank }) => {
            if (typeof rank === 'number') {
                score += rank;
            }
            if (typeof rank === 'string') {
                if (rank === 'A') {
                    acesCounter++;
                } else {
                    score += 10;
                }
            }
        });
        while (acesCounter > 0) {
            if (score + 11 > 21) {
                score += 1;
            } else {
                score += 11;
            }
            acesCounter--;
        }
        activePlayer.score = score;
    }

    dealerPlay() {
        this.updateScore();

        const dealerInterval = setInterval(() => {
            if (this.getActivePlayerScore() >= 17) {
                clearInterval(dealerInterval);
                this.checkGameEnd();
                return;
            }
            this.hit();
        }, 500);
    }

    getCardFromTop(): Card {
        return this.deck.splice(0, 1)[0];
    }

    resetGame() {
        setTimeout(() => {
            this.emptyHands();
            this.deck = shuffleArray(createDeck());
            this.setActivePlayer('1');
            this.status = GameStatus.idle;
            this.bets = null;
            this.playersIds.forEach(playerId => {
                this.players[playerId].isBusted = false;
            });
        }, 5000);
    }

    setActivePlayer(playerId: Players) {
        this.activePlayer = playerId;
    }
}
