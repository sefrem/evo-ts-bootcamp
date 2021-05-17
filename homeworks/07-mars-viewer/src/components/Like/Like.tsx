import React from "react";
import clsx from "clsx";

import favorite from "../../assets/icons/favorite.svg";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  addToFavorites,
  removeFromFavorites,
  selectFavorites,
} from "../../features/favorites/favoritesSlice";

import styles from "./Like.module.css";

type Props = {
  id: number;
};

const Like: React.VFC<Props> = ({ id }) => {
  const dispatch = useAppDispatch();
  const checkIfFavorite = (id: number): boolean => favoritePhotos.includes(id);

  const favoritePhotos = useAppSelector(selectFavorites);
  const isFavorite = checkIfFavorite(id);
  const toggleFavorite = () =>
    isFavorite
      ? dispatch(removeFromFavorites(id))
      : dispatch(addToFavorites(id));

  return (
    <img
      className={clsx(styles.icon, isFavorite && styles.activeIcon)}
      onClick={toggleFavorite}
      src={favorite}
      alt="favorite"
    />
  );
};

export default Like;
