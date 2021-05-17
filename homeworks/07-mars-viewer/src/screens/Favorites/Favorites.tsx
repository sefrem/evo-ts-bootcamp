import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectFavoritePhotos } from "../../features/favorites/favoritesSlice";
import Photos from "../../components/Photos/Photos";

const Favorites: React.VFC = () => {
  const photos = useAppSelector(selectFavoritePhotos);
  return (
    <>
      <Photos photos={photos} />
    </>
  );
};

export default Favorites;
