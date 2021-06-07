import React from "react";
import clsx from "clsx";

import {
  selectCurrentRoute,
  setRoute,
} from "../../features/routes/routesSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import styles from "./RoutesSelector.module.css";

const RoutesSelector: React.VFC = () => {
  const currentRoute = useAppSelector(selectCurrentRoute);
  const dispatch = useAppDispatch();
  const setPhotosRoute = () => dispatch(setRoute("gallery"));
  const setFavoritesRoute = () => dispatch(setRoute("favorites"));
  return (
    <p>
      <span
        onClick={setPhotosRoute}
        className={clsx(
          styles.regular,
          currentRoute === "gallery" && styles.active
        )}
      >
        Photos
      </span>
      <span>{" | "}</span>
      <span
        onClick={setFavoritesRoute}
        className={clsx(
          styles.regular,
          currentRoute === "favorites" && styles.active
        )}
      >
        Favorites
      </span>
    </p>
  );
};

export default RoutesSelector;
