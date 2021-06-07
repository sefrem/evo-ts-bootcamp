import { BasketActions } from '../redux/basket/basket.types';
import { ItemsActions } from '../redux/items/items.types';
import { Action, Middleware } from 'redux';

type LoggedActions = BasketActions.AddToBasket | BasketActions.RemoveFromBasket | ItemsActions.PizzaViewed;

type event = {
    eventName: LoggedActions;
    pizzaName?: string;
    pizzaPrice?: number;
};
export interface Dispatch {
    <A extends Action>(action: A): A;
}

export const logger: Middleware = () => next => action => {
    switch (action.type) {
        case BasketActions.AddToBasket:
        case BasketActions.RemoveFromBasket:
        case ItemsActions.PizzaViewed: {
            const event: event = {
                eventName: action.type,
                pizzaName: action.payload?.name,
                pizzaPrice: action.payload?.price,
            };
            console.table(event);
            log(event);
        }
    }

    return next(action);
};

const log = (event: event) => {
    fetch('http://localhost:3001/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
    })
        .then(json => {
            console.log(json);
        })
        .catch(ex => {
            console.log(ex);
        });
};
