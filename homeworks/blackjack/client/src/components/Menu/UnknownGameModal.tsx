import React from 'react';
import { observer } from 'mobx-react-lite';

import Modal from '../UI/Modal/Modal';
import { useStore } from '../../stores';

import styles from './UnknownGameModal.module.css';

const UnknownGameModal: React.VFC = observer(() => {
    const gameStore = useStore('GameStore');

    return (
        <Modal isOpen={gameStore.showUnknownGameModal} close={gameStore.closeUnknownGameModal}>
            <div className={styles.modalMessage}>
                {' '}
                The game does not exist. Please make sure you entered the correct url
            </div>
        </Modal>
    );
});

export default UnknownGameModal;
