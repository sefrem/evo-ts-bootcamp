import React from "react";
import Like from "../Like/Like";

import styles from "./Photo.module.css";

type Props = {
  photoSrc: string;
  cameraName: string;
  id: number;
  roverName: string;
};

const Photo: React.VFC<Props> = ({ photoSrc, id, cameraName, roverName }) => {
  return (
    <div className={styles.photoContainer}>
      <Like id={id} />
      <img className={styles.photo} src={photoSrc} alt="" />
      <div className={styles.photoDescription}>
        Rover: {roverName}, Camera: {cameraName}
      </div>
    </div>
  );
};

export default Photo;
