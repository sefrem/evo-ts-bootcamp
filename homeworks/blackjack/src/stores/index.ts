import GameStore from './gameStore';
import { createContext } from '../utils/storeUtils';

export const { StoreProvider, useStore } = createContext({
    GameStore: new GameStore(),
});
