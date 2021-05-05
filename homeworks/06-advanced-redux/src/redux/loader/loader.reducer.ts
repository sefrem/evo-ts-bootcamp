import { LoaderActions } from './loader.types';
import { Action } from 'redux';

const initialState = {
    itemsLoader: false,
};

export const loader = (state = initialState, { type }: Action<LoaderActions>) => {
    switch (type) {
        case LoaderActions.ToggleItemsLoader: {
            return { ...state, itemsLoader: !state.itemsLoader };
        }
    }
    return state;
};
