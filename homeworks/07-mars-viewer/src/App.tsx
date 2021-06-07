import React from "react";

import RoutesSelector from "./components/RoutesSelector/RoutesSelector";
import Gallery from "./screens/Gallery/Gallery";
import Favorites from "./screens/Favorites/Favorites";

import { useAppSelector } from "./app/hooks";
import { selectCurrentRoute } from "./features/routes/routesSlice";

import "./App.css";

const App: React.VFC = () => {
  const currentRoot = useAppSelector(selectCurrentRoute);
  return (
    <div className="App">
      <RoutesSelector />
      {currentRoot === "gallery" && <Gallery />}
      {currentRoot === "favorites" && <Favorites />}
    </div>
  );
};

export default App;
