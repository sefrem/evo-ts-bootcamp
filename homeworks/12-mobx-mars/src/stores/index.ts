import { createContext } from "../utils/storeUtils";
import MainStore from "./main/MainStore";
import RouterStore from "./router/RouterStore";

export const { StoreProvider, useStore } = createContext({
  MainStore: new MainStore(),
  RouterStore: new RouterStore(),
});
