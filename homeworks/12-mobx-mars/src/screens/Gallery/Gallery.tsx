import React from "react";

import SolsSelector from "../../components/SolsSelector/SolsSelector";
import PhotosContainer from "../../components/PhotosContainer/PhotosContainer";
import RoverSelector from "../../components/RoverSelector/RoverSelector";

import styles from "./Gallery.module.css";

const Gallery: React.VFC = () => {
  return (
    <>
      <div className={styles.gallerySelectors}>
        <RoverSelector />
        <SolsSelector />
      </div>
      <PhotosContainer />
    </>
  );
};

export default Gallery;
