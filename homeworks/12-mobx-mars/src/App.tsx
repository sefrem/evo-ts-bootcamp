import React, { Suspense } from "react";
import { observer } from "mobx-react-lite";

import RoutesSelector from "./components/RoutesSelector/RoutesSelector";
import { useStore } from "./stores";
import { routes } from "./routes/routes";

import "./App.css";

const App: React.VFC = observer(() => {
  const routerStore = useStore("RouterStore");
  return (
    <div className="App">
      <RoutesSelector />
      <Suspense fallback={<div>Loading...</div>}>
        {routes(routerStore)}
      </Suspense>
    </div>
  );
});

export default App;
