import React from "react";

import {Images} from "../../shared/types";

import styles from "./styles.module.css";

export default function Gallery({images}: { images: Images[] }): JSX.Element {
    return (
        <div className={styles.images}>
            {images?.map(({primaryImageSmall, objectID, title, artistDisplayName, objectDate, objectURL}) => (
                <a href={objectURL} target={'_blank'} rel="noreferrer" className={styles.image} key={objectID}>
                    <div className={styles.imageInfo}>
                        <div>{title}</div>
                        <div>{objectDate}</div>
                        <div>{artistDisplayName}</div>
                    </div>
                    <img src={primaryImageSmall} alt=''/>
                </a>
            ))}
        </div>
    )
}
