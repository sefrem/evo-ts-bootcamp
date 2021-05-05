import { ThunkAction } from 'redux-thunk';
import { BasketActions, IBasketActions } from './basket.types';
import { RootState } from '../store';

export const addPizzaToBasket = (payload: string): ThunkAction<void, RootState, {}, IBasketActions> => (
    dispatch,
    getState,
) => {
    const { items }: RootState = getState();
    const addedItem = items.filter(x => x._id === payload)[0];
    dispatch({
        type: BasketActions.AddToBasket,
        payload: addedItem,
    });
};

export const removePizzaFromBasket = (payload: string): ThunkAction<void, RootState, {}, IBasketActions> => (
    dispatch,
    getState,
) => {
    const { items }: RootState = getState();
    const removedItem = items.filter(x => x._id === payload)[0];
    dispatch({
        type: BasketActions.RemoveFromBasket,
        payload: removedItem,
    });
};
