import React from "react";
import RouterStore from "../stores/router/RouterStore";
import Gallery from "../screens/Gallery/Gallery";
const Favorites = React.lazy(() => import("../screens/Favorites/Favorites"));

export const manageRoutes = (store: RouterStore) => {
  switch (store.route) {
    case "gallery":
      return <Gallery />;
    case "favorites":
      return <Favorites />;
    default:
      return null;
  }
};
