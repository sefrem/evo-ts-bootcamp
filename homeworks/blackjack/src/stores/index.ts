import MainStore from "./mainStore";
import { createContext } from "../utils/storeUtils";

export const { StoreProvider, useStore } = createContext({
  MainStore: new MainStore(),
});
