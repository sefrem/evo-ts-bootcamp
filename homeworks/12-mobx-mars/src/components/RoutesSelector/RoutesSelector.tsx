import React from "react";
import clsx from "clsx";
import { observer } from "mobx-react-lite";

import { useStore } from "../../stores";
import styles from "./RoutesSelector.module.css";

const RoutesSelector: React.VFC = observer(() => {
  const routesStore = useStore("RoutesStore");

  const setPhotosRoute = () => routesStore.setRoute("gallery");
  const setFavoritesRoute = () => routesStore.setRoute("favorites");
  return (
    <p>
      <span
        onClick={setPhotosRoute}
        className={clsx(
          styles.regular,
          routesStore.route === "gallery" && styles.active
        )}
      >
        Photos
      </span>
      <span>{" | "}</span>
      <span
        onClick={setFavoritesRoute}
        className={clsx(
          styles.regular,
          routesStore.route === "favorites" && styles.active
        )}
      >
        Favorites
      </span>
    </p>
  );
});

export default RoutesSelector;
