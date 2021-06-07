import { ThunkAction } from 'redux-thunk';
import { getPizza } from '../../services/api';
import { IActionsItems, ItemsActions } from './items.types';
import { RootState } from '../store';
import { ILoader, LoaderActions } from '../loader/loader.types';

export const getPizzas = (): ThunkAction<void, RootState, {}, IActionsItems | ILoader> => async dispatch => {
    dispatch({ type: LoaderActions.ToggleItemsLoader });
    const pizza = await getPizza();
    dispatch({ type: ItemsActions.GetPizza, payload: pizza.items });
    dispatch({ type: LoaderActions.ToggleItemsLoader });
};

export const pizzaViewed = () => ({ type: ItemsActions.PizzaViewed });
