import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

type Routes = "gallery" | "favorites";

type RoutesState = Record<"route", Routes>;

const initialState: RoutesState = {
  route: "gallery",
};

export const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    setRoute: (state, action: PayloadAction<Routes>) => {
      state.route = action.payload;
    },
  },
});

export const selectCurrentRoute = (state: RootState) => state.routes.route;

export const { setRoute } = routesSlice.actions;

export default routesSlice.reducer;
