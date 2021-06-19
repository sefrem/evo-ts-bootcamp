import { createContext } from '../utils/storeUtils';
import LifeStore from './life';

export const { StoreProvider, useStore } = createContext({
    LifeStore: new LifeStore(),
});
