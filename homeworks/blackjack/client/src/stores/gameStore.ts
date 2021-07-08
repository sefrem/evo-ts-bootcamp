import { makeAutoObservable, runInAction } from 'mobx';

import { createDeck } from '../utils/createDeck';
import { shuffleArray } from '../utils/shuffleArray';
import { Card, ChipsValues, Dealer, GameStatus, Player } from '../types/types';
import { countScoreInHand } from '../utils/countScoreInHand';

const initialDealerState = {
    id: 0,
    name: 'Dealer',
    hand: [],
    score: 0,
    isBusted: false,
};

const initialState = [
    {
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
    {
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
];

export default class GameStore {
    private deck: Card[] = [];
    playersIds: number[] = [1, 2];
    status: GameStatus = GameStatus.idle;
    activePlayer: number | null = 1;
    dealer: Dealer = initialDealerState;
    players: Player[] = initialState;
    bets: Record<number, ChipsValues[]> | null = null;
    nextGameTimer: number | null = null;

    constructor() {
        makeAutoObservable(
            this,
            {},
            {
                autoBind: true,
            },
        );
    }

    getDealerScore() {
        return this.dealer.score;
    }

    getPlayerBet(playerId: number) {
        if (this.bets) {
            return this.bets[playerId];
        }
    }

    getPlayerById(playerId: number) {
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
                                this.dealer.hand.push(this.getCardFromTop());
                            } else {
                                players[j].hand.push(this.getCardFromTop());
                                players[j].score = countScoreInHand(players[j].hand);
                            }
                        });
                    }, j * 500);
                }
            }, i * 500 * (this.playersIds.length + 1));
        }
        this.setActivePlayer(1);
    }

    dealerHit() {
        runInAction(() => {
            this.dealer.hand.push(this.getCardFromTop());
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
                this.setActivePlayer(null);
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
                this.dealer.isBusted = true;
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

    updateChipsPlayerWon(playerId: number) {
        if (this.bets) {
            this.bets[playerId].forEach(value => {
                this.getPlayerById(playerId)!.chips[value] += 2;
            });
        }
    }

    updateChipsStandoff(playerId: number) {
        if (this.bets) {
            this.bets[playerId].forEach(value => {
                this.getPlayerById(playerId)!.chips[value] += 1;
            });
        }
    }

    removePlayerBet(playerId: number) {
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
        this.dealer.hand = [];
        this.dealer.score = 0;
        this.dealer.isBusted = false;
    }

    checkIfAllBusted(): boolean {
        return this.players.every(({ isBusted }) => isBusted);
    }

    updateDealerScore() {
        this.dealer.score = countScoreInHand(this.dealer.hand);
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
        this.setActivePlayer(null);
        this.updateDealerScore();

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
                this.setActivePlayer(1);
                this.status = GameStatus.idle;
                this.bets = null;
                clearInterval(countdownTimer);
            }
        }, 1000);
    }

    setActivePlayer(playerId: number | null) {
        this.activePlayer = playerId;
    }

    setBusted(playerId: number) {
        const player = this.getPlayerById(playerId);
        if (player) {
            player.isBusted = true;
        }
    }
}
