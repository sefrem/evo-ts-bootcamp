import { Pizza } from '../../types';
import { IActionsItems, ItemsActions } from './items.types';

export const items = (state: Pizza[] = [], { type, payload }: IActionsItems) => {
    switch (type) {
        case ItemsActions.GetPizza: {
            return payload;
        }
    }

    return state;
};
