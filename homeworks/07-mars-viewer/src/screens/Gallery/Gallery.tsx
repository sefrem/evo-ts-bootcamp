import React from "react";
import SolsSelector from "../../components/SolsSelector";
import PhotosContainer from "../../components/PhotosContainer/PhotosContainer";

const Gallery: React.VFC = () => {
  return (
    <>
      <SolsSelector />
      <PhotosContainer />
    </>
  );
};

export default Gallery;
