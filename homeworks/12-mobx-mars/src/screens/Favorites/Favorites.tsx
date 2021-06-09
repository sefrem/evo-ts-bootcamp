import React from "react";
import Photos from "../../components/Photos/Photos";
import { observer } from "mobx-react-lite";
import { useStore } from "../../stores";

const Favorites: React.VFC = observer(() => {
  const mainStore = useStore("MainStore");

  if (!mainStore.favoritePhotos.length) {
    return <p>No favorite photos, add some!</p>;
  }

  return <Photos photos={mainStore.favoritePhotos} />;
});

export default Favorites;
