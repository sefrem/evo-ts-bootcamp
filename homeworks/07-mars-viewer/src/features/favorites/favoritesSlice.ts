import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { selectAllRoversPhotos } from "../mars/marsSlice";
import { RootState } from "../../app/store";
import {
  addToLocalStorage,
  getFromLocalStorage,
} from "../../urils/localStorage";

const LOCALSTORAGE_KEY = "favoriteMarsPhotos";

const initialState: number[] = getFromLocalStorage(LOCALSTORAGE_KEY) || [];

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<number>) => {
      state.push(action.payload);
      addToLocalStorage(LOCALSTORAGE_KEY, state);
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      const newState = state.filter((id) => id !== action.payload);
      addToLocalStorage(LOCALSTORAGE_KEY, newState);
      return newState;
    },
  },
});

export const { addToFavorites, removeFromFavorites } = favoritesSlice.actions;

export const selectFavorites = (state: RootState): number[] => state.favorites;

export const selectFavoritePhotos = createSelector(
  selectAllRoversPhotos,
  selectFavorites,
  (photos, favoriteIds) => {
    return photos?.filter(({ id }) => favoriteIds?.includes(id));
  }
);

export default favoritesSlice.reducer;
