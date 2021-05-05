import { Action } from 'redux';
import { Pizza } from '../../types';

export enum BasketActions {
    AddToBasket = 'PIZZA_ADDED_INTO_BASKET',
    RemoveFromBasket = 'PIZZA_REMOVED_FROM_BASKET',
}

export interface IBasketActions extends Action<BasketActions> {
    payload: Pizza;
}
