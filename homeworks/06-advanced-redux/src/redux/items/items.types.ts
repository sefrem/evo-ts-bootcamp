import { Action } from 'redux';
import { Pizza } from '../../types';
import { LoaderActions } from '../loader/loader.types';

export interface IActionsItems extends Action<ItemsActions | LoaderActions> {
    payload: Pizza[];
}

export enum ItemsActions {
    GetPizza = 'GET_PIZZA',
    PizzaViewed = 'PIZZA_VIEWED',
}
