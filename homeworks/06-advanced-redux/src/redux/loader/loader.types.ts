import { Action } from 'redux';

export interface ILoader extends Action<LoaderActions> {}

export enum LoaderActions {
    ToggleItemsLoader = 'TOGGLE_ITEMS_LOADER',
}
