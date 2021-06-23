import { makeAutoObservable, runInAction } from 'mobx';

import { createDeck } from '../utils/createDeck';
import { shuffleArray } from '../utils/shuffleArray';
import { ICard } from '../types/types';

export default class GameStore {
    deck: ICard[] = [];
    dealer: ICard[] = [];
    player: ICard[] = [];

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
