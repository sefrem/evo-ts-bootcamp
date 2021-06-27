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
    },
    '1': {
        id: 1,
        name: 'SomeTestName',
        hand: [],
        score: 0,
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
                            this.checkScore();
                        });
                    }, j * 1000);
                }
            }, i * 2000);
        }
    }

    hit() {
        runInAction(() => {
            this.players[this.activePlayer].hand.push(this.getCardFromTop());
        });
        this.checkScore();
    }

    stand() {
        runInAction(() => {
            this.activePlayer = '0';
        });
        this.dealerPlay();
    }

    checkScore() {
        let score = 0;
        let acesCounter = 0;
        const activePlayer = this.players[this.activePlayer];
        activePlayer.hand.forEach(({ rank }, index, array) => {
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
        runInAction(() => {
            activePlayer.score = score;
        });
    }

    dealerPlay() {
        this.checkScore();
        for (let i = 1; i < 10; i++) {
            setTimeout(() => {
                if (this.players['0'].score >= 17) {
                    return;
                }
                this.hit();
            }, i * 1000);
        }
    }

    getCardFromTop(): Card {
        return this.deck.splice(0, 1)[0];
    }

    resetGame() {
        runInAction(() => {
            this.players = initialState;
            this.deck = shuffleArray(createDeck());
        });
    }
}
