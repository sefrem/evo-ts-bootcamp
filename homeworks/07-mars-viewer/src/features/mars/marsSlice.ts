import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import api from "../../api";
import { MarsState, Sol } from "./types";

const initialState: MarsState = {
  photos: null,
  sols: {},
  status: "idle",
  selectedSol: 1,
};

export const getPhotos = createAsyncThunk<Sol[], void, { state: RootState }>(
  "sols/getSols",
  async (_, { getState }) => {
    const response = await api.getPhotos(getState().mars.selectedSol);
    // The value we return becomes the `fulfilled` action payload
    return response.photos;
  }
);

export const marsSlice = createSlice({
  name: "sols",
  initialState,
  reducers: {
    setSelectedSol: (state, action: PayloadAction<number>) => {
      state.selectedSol = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPhotos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPhotos.fulfilled, (state, action) => {
        state.status = "idle";
        if (!state.photos) {
          state.photos = [];
        }
        state.photos?.push(...action.payload);
        state.sols[state.selectedSol] = action.payload.map(({ id }) => id);
      });
  },
});

export const { setSelectedSol } = marsSlice.actions;

const selectCurrentSolPhotoIds = (state: RootState): number[] =>
  state.mars.sols[state.mars.selectedSol];

export const selectAllPhotos = (state: RootState): Sol[] | null =>
  state.mars.photos;

export const selectCurrentSol = (state: RootState): number =>
  state.mars.selectedSol;

export const selectLoadedSols = (state: RootState): string[] =>
  Object.keys(state.mars.sols);

export const selectCurrentSolPhotos = createSelector(
  selectAllPhotos,
  selectCurrentSolPhotoIds,
  (photos, currentSolIds) => {
    if (!photos) return null;
    return photos.filter(({ id }) => currentSolIds?.includes(id));
  }
);
export const selectStatus = (state: RootState) => state.mars.status;

export default marsSlice.reducer;
