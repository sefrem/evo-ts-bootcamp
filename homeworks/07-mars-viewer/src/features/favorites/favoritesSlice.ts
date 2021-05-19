import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { selectAllRoversPhotos } from "../mars/marsSlice";
import { RootState } from "../../app/store";

const initialState: number[] = [];

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<number>) => {
      state.push(action.payload);
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      return state.filter((id) => id !== action.payload);
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
