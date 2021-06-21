import { makeAutoObservable, runInAction } from 'mobx';

import { createDeck } from '../utils/createDeck';
import { shuffleArray } from '../utils/shuffleArray';
import { Card } from '../types/types';

export default class MainStore {
    deck: Card[] = [];
    dealer: Card[] = [];
    player: Card[] = [];

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
        runInAction(() => {
            this.dealer = this.deck.splice(0, 2);
            this.player = this.deck.splice(0, 2);
        });
    }
}
