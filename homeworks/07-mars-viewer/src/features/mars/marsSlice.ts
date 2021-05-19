import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import api from "../../api";
import { MarsState, Rover, Sol } from "./types";

const initialState: MarsState = {
  rover: {
    perseverance: {
      photos: [],
      sols: {},
      status: "idle",
      selectedSol: 1,
    },
  },
  selectedRover: "perseverance",
};

export const getPhotos = createAsyncThunk<Sol[], void, { state: RootState }>(
  "sols/getSols",
  async (_, { getState }) => {
    const {
      mars: { rover, selectedRover },
    } = getState();
    const response = await api.getPhotos(
      selectedRover,
      rover[selectedRover].selectedSol
    );
    return response.photos;
  }
);

export const marsSlice = createSlice({
  name: "sols",
  initialState,
  reducers: {
    setSol: (state, action: PayloadAction<number>) => {
      state.rover[state.selectedRover].selectedSol = action.payload;
    },
    setRover: (state, action: PayloadAction<Rover>) => {
      state.selectedRover = action.payload;
      if (!state.rover[action.payload]) {
        state.rover[action.payload] = {
          photos: [],
          sols: {},
          status: "idle",
          selectedSol: 1,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPhotos.pending, (state) => {
        state.rover[state.selectedRover].status = "loading";
      })
      .addCase(getPhotos.fulfilled, (state, action) => {
        state.rover[state.selectedRover].status = "idle";
        if (!state.rover[state.selectedRover].photos) {
          state.rover[state.selectedRover].photos = [];
        }
        state.rover[state.selectedRover].photos?.push(...action.payload);
        state.rover[state.selectedRover].sols[
          state.rover[state.selectedRover].selectedSol
        ] = action.payload.map(({ id }) => id);
      });
  },
});

export const { setSol, setRover } = marsSlice.actions;

const selectCurrentSolPhotoIds = (state: RootState): number[] =>
  state.mars.rover[state.mars.selectedRover].sols[
    state.mars.rover[state.mars.selectedRover].selectedSol
  ];

export const selectRoverPhotos = (state: RootState): Sol[] =>
  state.mars.rover[state.mars.selectedRover].photos;

export const selectAllRoversPhotos = (state: RootState): Sol[] => [
  ...Object.values(state.mars.rover).flatMap(({ photos }) => photos),
];

export const selectCurrentSol = (state: RootState): number =>
  state.mars.rover[state.mars.selectedRover].selectedSol;

export const selectLoadedSols = (state: RootState): string[] =>
  Object.keys(state.mars.rover[state.mars.selectedRover].sols);

export const selectCurrentSolPhotos = createSelector(
  selectRoverPhotos,
  selectCurrentSolPhotoIds,
  (photos, currentSolIds) => {
    return photos.filter(({ id }) => currentSolIds?.includes(id));
  }
);

export const selectStatus = (state: RootState) =>
  state.mars.rover[state.mars.selectedRover].status;

export const selectRover = (state: RootState) => state.mars.selectedRover;

export default marsSlice.reducer;
