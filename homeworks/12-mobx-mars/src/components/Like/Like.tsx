import React from "react";
import clsx from "clsx";
import { computed } from "mobx";
import { observer } from "mobx-react-lite";

import favorite from "../../assets/icons/favorite.svg";
import { useStore } from "../../stores";

import styles from "./Like.module.css";

type Props = {
  id: number;
};

const Like: React.VFC<Props> = observer(({ id }) => {
  const mainStore = useStore("MainStore");

  const isFavorite = computed(() => mainStore.checkIfFavorite(id)).get();

  const toggleFavorite = () =>
    isFavorite
      ? mainStore.removeFromFavorites(id)
      : mainStore.addToFavorites(id);

  return (
    <img
      className={clsx(styles.icon, isFavorite && styles.activeIcon)}
      onClick={toggleFavorite}
      src={favorite}
      alt="favorite"
    />
  );
});

export default Like;
