import React from "react";
import { useAppSelector } from "../../app/hooks";
import {
  selectCurrentSolPhotos,
  selectLoadedSolsForCurrentDay,
  selectStatus,
} from "../../features/mars/marsSlice";
import Photos from "../Photos/Photos";

const PhotosContainer: React.VFC = () => {
  const photos = useAppSelector(selectCurrentSolPhotos);
  const loadedSolsForCurrentDay = useAppSelector(selectLoadedSolsForCurrentDay);
  const status = useAppSelector(selectStatus);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!loadedSolsForCurrentDay) {
    return <p>Photos are not loaded</p>;
  }

  if (!photos?.length) {
    return <p>No photos for this sol</p>;
  }

  return (
    <>
      <p>Click on photo to enlarge</p>
      <Photos photos={photos} />;
    </>
  );
};

export default PhotosContainer;
