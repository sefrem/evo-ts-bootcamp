import React from "react";

import Photos from "../Photos/Photos";
import { useStore } from "../../stores";
import { observer } from "mobx-react-lite";

const PhotosContainer: React.VFC = observer(() => {
  const mainStore = useStore("MainStore");

  if (mainStore.currentRover.loader) {
    return <p>Loading...</p>;
  }

  if (!mainStore.currentRover.selectedSolContent) {
    return <p>Photos are not loaded</p>;
  }

  if (!mainStore.currentRover.selectedSolPhotos.length) {
    return <p>No photos for this sol</p>;
  }

  return (
    <>
      <p>Click on photo to enlarge</p>
      <Photos photos={mainStore.currentRover.selectedSolPhotos} />
    </>
  );
});

export default PhotosContainer;
