import { createContext } from "../utils/storeUtils";
import MainStore from "./main/MainStore";
import RoutesStore from "./routes/RoutesStore";

export const { StoreProvider, useStore } = createContext({
  MainStore: new MainStore(),
  RoutesStore: new RoutesStore(),
});
