import React from 'react';

import styles from './Modal.module.css';

interface Props {
    isOpen: boolean;
    close: (e: React.MouseEvent<HTMLElement>) => void;
    children: React.ReactNode;
}

const Modal: React.FC<Props> = ({ isOpen, close, children }) => {
    return (
        <>
            {isOpen && (
                <div className={styles.modal} onClick={close}>
                    <div className={styles.modalContent}>{children}</div>
                </div>
            )}
        </>
    );
};

export default Modal;
