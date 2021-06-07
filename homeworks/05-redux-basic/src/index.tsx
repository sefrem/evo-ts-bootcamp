import {createStore, compose} from "redux";

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

enum ActionType {
    UpdateBalance = 'UPDATE_BALANCE',
    Debit = 'DEBIT',
    Credit = 'CREDIT',
    SetBalanceWithTax = 'SET_BALANCE_WITH_TAX',
}

type Action = {
    type: ActionType;
    payload: number;
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, undefined, composeEnhancers());

store.subscribe(() => store.getState());

function rootReducer(state = {value: 0}, action: Action) {
    switch (action.type) {
        case ActionType.Credit:
            return {value: state.value - action.payload};
        case ActionType.Debit:
            return {value: state.value + action.payload};
        case ActionType.UpdateBalance:
            return {value: action.payload};
        case ActionType.SetBalanceWithTax:
            return {value: state.value * (1 - action.payload / 100)};
        default:
            return state;
    }
}

const actions = [
    {type: ActionType.UpdateBalance, payload: 1000.0},
    {type: ActionType.Credit, payload: 200.0},
    {type: ActionType.Credit, payload: 100.0},
    {type: ActionType.UpdateBalance, payload: 1000.0},
    {type: ActionType.Credit, payload: 100.0},
    {type: ActionType.Credit, payload: 100.0},
    {type: ActionType.SetBalanceWithTax, payload: 14.0},
    {type: ActionType.Debit, payload: 250.0},
    {type: ActionType.UpdateBalance, payload: 1000.0},
];

actions.forEach(action => store.dispatch(action));
