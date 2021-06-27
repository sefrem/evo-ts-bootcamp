import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { StoreProvider } from "./stores";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <StoreProvider>
        <App />
      </StoreProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
