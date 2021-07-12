import GameStore from './gameStore';
import { createContext } from '../utils';

export const { StoreProvider, useStore } = createContext({
    GameStore: new GameStore(),
});
