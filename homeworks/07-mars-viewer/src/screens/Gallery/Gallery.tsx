import React from "react";
import SolsSelector from "../../components/SolsSelector/SolsSelector";
import PhotosContainer from "../../components/PhotosContainer/PhotosContainer";
import RoverSelector from "../../components/RoverSelector/RoverSelector";

const Gallery: React.VFC = () => {
  return (
    <>
      <SolsSelector />
      <RoverSelector />
      <PhotosContainer />
    </>
  );
};

export default Gallery;
