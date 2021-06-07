import { combineReducers } from 'redux';
import { items } from './items/items.reducer';
import { basket } from './basket/basket.reducer';
import { loader } from './loader/loader.reducer';

export const rootReducer = combineReducers({
    items,
    basket,
    loader,
});
