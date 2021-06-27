import React from "react";
import RouterStore from "../stores/router/RouterStore";

const Favorites = React.lazy(() => import("../screens/Favorites/Favorites"));
const Gallery = React.lazy(() => import("../screens/Gallery/Gallery"));

export const routes = (store: RouterStore) => {
  switch (store.route) {
    case "gallery":
      return <Gallery />;
    case "favorites":
      return <Favorites />;
    default:
      return null;
  }
};
