import React from "react";
import { observer } from "mobx-react-lite";

import RoutesSelector from "./components/RoutesSelector/RoutesSelector";
import Gallery from "./screens/Gallery/Gallery";
import Favorites from "./screens/Favorites/Favorites";
import { useStore } from "./stores";

import "./App.css";

const App: React.VFC = observer(() => {
  const routesStore = useStore("RoutesStore");
  return (
    <div className="App">
      <RoutesSelector />
      {routesStore.route === "gallery" && <Gallery />}
      {routesStore.route === "favorites" && <Favorites />}
    </div>
  );
});

export default App;
