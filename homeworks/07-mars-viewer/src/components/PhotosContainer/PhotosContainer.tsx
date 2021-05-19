import React from "react";
import { useAppSelector } from "../../app/hooks";
import {
  selectCurrentSol,
  selectCurrentSolPhotos,
  selectLoadedSols,
  selectStatus,
} from "../../features/mars/marsSlice";
import Photos from "../Photos/Photos";

const PhotosContainer: React.VFC = () => {
  const photos = useAppSelector(selectCurrentSolPhotos);
  const loadedSols = useAppSelector(selectLoadedSols);
  const status = useAppSelector(selectStatus);
  const currentSol = useAppSelector(selectCurrentSol);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!loadedSols.includes(currentSol.toString())) {
    return <p>Photos are not loaded</p>;
  }

  if (!photos?.length) {
    return <p>No photos for this sol</p>;
  }

  return <Photos photos={photos} />;
};

export default React.memo(PhotosContainer);
