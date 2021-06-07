import { AnyAction } from 'redux';
import * as R from 'ramda';
import { Basket, Pizza } from '../../types';
import { BasketActions } from './basket.types';

const initialState: Basket = {
    pizza: [],
    totalPrice: 0,
};

export const basket = (state = initialState, { type, payload }: AnyAction) => {
    switch (type) {
        case BasketActions.AddToBasket: {
            const newBasket = [...state.pizza];
            const idx = R.findLastIndex((x: Pizza) => x._id === payload._id)(state.pizza);
            if (idx !== -1) {
                newBasket[idx] = {
                    ...newBasket[idx],
                    count: newBasket[idx].count + 1,
                    price: +(newBasket[idx].price + payload.price).toFixed(2),
                };
            } else {
                newBasket.push({ ...payload, count: 1 });
            }
            return {
                ...state,
                pizza: newBasket,
                totalPrice: newBasket.reduce((acc, p: Pizza) => acc + p.price, 0),
            };
        }
        case BasketActions.RemoveFromBasket: {
            const newBasket = [...state.pizza];
            const idx = R.findLastIndex((x: Pizza) => x._id === payload._id)(state.pizza);
            if (idx !== -1) {
                if (newBasket[idx].count === 1) {
                    newBasket.splice(idx, 1);
                } else {
                    newBasket[idx] = {
                        ...newBasket[idx],
                        count: newBasket[idx].count - 1,
                        price: +(newBasket[idx].price - payload.price).toFixed(2),
                    };
                }
                return {
                    ...state,
                    pizza: newBasket,
                    totalPrice: newBasket.reduce((acc, p: Pizza) => acc + p.price, 0),
                };
            }
        }
    }

    return state;
};
