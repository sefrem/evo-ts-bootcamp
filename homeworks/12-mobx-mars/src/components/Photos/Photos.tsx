import React from "react";

import Photo from "../Photo/Photo";

import styles from "./Photos.module.css";
import { IPhotos } from "../../stores/main/MainTypes";

type Props = {
  photos: IPhotos[];
};

const Photos: React.VFC<Props> = ({ photos }) => {
  return (
    <div className={styles.photos}>
      {photos?.map(
        ({ imgSrc, camera: { fullName }, id, rover: { name }, earthDate }) => (
          <Photo
            key={id}
            id={id}
            photoSrc={imgSrc}
            cameraName={fullName}
            roverName={name}
            date={earthDate}
          />
        )
      )}
    </div>
  );
};

export default Photos;
