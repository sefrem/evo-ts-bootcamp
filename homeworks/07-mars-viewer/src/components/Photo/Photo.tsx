import React from "react";
import Like from "../Like/Like";
import Modal from "react-modal";

import { useModal } from "../../hooks/useModal";
import styles from "./Photo.module.css";

type Props = {
  photoSrc: string;
  cameraName: string;
  id: number;
  roverName: string;
  date: string;
};

const Photo: React.VFC<Props> = ({
  photoSrc,
  id,
  cameraName,
  roverName,
  date,
}) => {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <div className={styles.photoContainer}>
        <Like id={id} />
        <img
          className={styles.photo}
          src={photoSrc}
          alt=""
          onClick={openModal}
        />
        <div className={styles.photoDescription}>
          Rover: {roverName}, Camera: {cameraName}
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {},
          content: {
            width: "fit-content",
            left: "25%",
          },
        }}
        ariaHideApp={false}
      >
        <img className={styles.photoZoomed} src={photoSrc} alt="" />
        <div>Date: {date}</div>
      </Modal>
    </>
  );
};

export default Photo;
