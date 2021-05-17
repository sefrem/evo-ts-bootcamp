import React from "react";

import { Sol } from "../../features/mars/types";
import Photo from "../Photo/Photo";

import styles from "./Photos.module.css";

type Props = {
  photos: Sol[];
};

const Photos: React.VFC<Props> = ({ photos }) => {
  return (
    <div className={styles.photos}>
      {photos?.map(
        ({ img_src, camera: { full_name }, id, rover: { name } }) => (
          <Photo
            key={id}
            id={id}
            photoSrc={img_src}
            cameraName={full_name}
            roverName={name}
          />
        )
      )}
    </div>
  );
};

export default Photos;
