import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import marsReducer from "../features/mars/marsSlice";
import routesReducer from "../features/routes/routesSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";

export const store = configureStore({
  reducer: {
    mars: marsReducer,
    routes: routesReducer,
    favorites: favoritesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
