import { makeAutoObservable, runInAction } from 'mobx';

import { createDeck } from '../utils/createDeck';
import { shuffleArray } from '../utils/shuffleArray';
import { Card, Player, Players } from '../types/types';

const initialState = {
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
    },
};

export default class GameStore {
    private playersCount = 1;
    private deck: Card[] = [];
    activePlayer: Players = '1';
    players: Record<Players, Player> = initialState;

    constructor() {
        makeAutoObservable(
            this,
            {},
            {
                autoBind: true,
            },
        );
    }

    get activePlayerScore() {
        return this.players[this.activePlayer].score;
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
            }, i * 1000);
        }
    }

    hit() {
        runInAction(() => {
            this.players[this.activePlayer].hand.push(this.getCardFromTop());
        });
        this.updateScore();
        if (this.activePlayer !== '0' && this.activePlayerScore > 21) {
            setTimeout(() => {
                this.setActivePlayer('0');
                this.updateScore();
            }, 500);
            setTimeout(() => {
                alert('Dealer has won');
            }, 1000);
        }
    }

    stand() {
        this.setActivePlayer('0');
        this.dealerPlay();
    }

    checkGameEnd() {
        if (this.activePlayerScore > 21 || this.activePlayerScore < this.players['1'].score) {
            alert(`${this.players['1'].name} has won`);
        }
        if (this.activePlayerScore <= 21 && this.activePlayerScore > this.players['1'].score) {
            alert('Dealer has won');
        }
        if (this.activePlayerScore === this.players['1'].score) {
            alert('Its a stand off');
        }
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
            if (this.activePlayerScore >= 17) {
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
        runInAction(() => {
            this.players = initialState;
            this.deck = shuffleArray(createDeck());
        });
        this.setActivePlayer('1');
    }

    setActivePlayer(playerId: Players) {
        this.activePlayer = playerId;
    }
}
