import React from "react";
import clsx from "clsx";
import { observer } from "mobx-react-lite";

import { useStore } from "../../stores";
import styles from "./RoutesSelector.module.css";

const RoutesSelector: React.VFC = observer(() => {
  const routerStore = useStore("RouterStore");

  const setPhotosRoute = () => routerStore.setRoute("gallery");
  const setFavoritesRoute = () => routerStore.setRoute("favorites");
  return (
    <p>
      <span
        onClick={setPhotosRoute}
        className={clsx(
          styles.regular,
          routerStore.route === "gallery" && styles.active
        )}
      >
        Photos
      </span>
      <span>{" | "}</span>
      <span
        onClick={setFavoritesRoute}
        className={clsx(
          styles.regular,
          routerStore.route === "favorites" && styles.active
        )}
      >
        Favorites
      </span>
    </p>
  );
});

export default RoutesSelector;
