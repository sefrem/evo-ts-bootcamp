import React from "react";
import SolsSelector from "../../components/SolsSelector";
import Photos from "../../components/Photos/Photos";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentSolPhotos } from "../../features/mars/marsSlice";

const Gallery: React.VFC = () => {
  const photos = useAppSelector(selectCurrentSolPhotos);
  return (
    <>
      <SolsSelector />
      <Photos photos={photos} />
    </>
  );
};

export default Gallery;
