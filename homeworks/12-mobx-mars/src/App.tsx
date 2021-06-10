import React, { Suspense } from "react";
import { observer } from "mobx-react-lite";

import RoutesSelector from "./components/RoutesSelector/RoutesSelector";
import { useStore } from "./stores";

import "./App.css";
import { manageRoutes } from "./utils/manageRoutes";

const App: React.VFC = observer(() => {
  const routesStore = useStore("RoutesStore");
  return (
    <div className="App">
      <RoutesSelector />
      <Suspense fallback={<div>Loading...</div>}>
        {manageRoutes(routesStore)}
      </Suspense>
    </div>
  );
});

export default App;
