import React from 'react';
import { observer } from 'mobx-react-lite';

import mainMenu from '../../assets/icons/main_menu.svg';
import waitingBadge from '../../assets/icons/badges/badge_waiting.svg';
import { useStore } from '../../stores';
import Button from '../../components/UI/Button/Button';
import Modal from '../../components/UI/Modal/Modal';
import { useModal } from '../../hooks/useModal';
import Spinner from '../../components/UI/Spinner/Spinner';
import UnknownGameModal from '../../components/Menu/UnknownGameModal';

import styles from './MenuScreen.module.css';

const MenuScreen: React.VFC = observer(() => {
    const gameStore = useStore('GameStore');
    const { isOpen, openModal, closeModal } = useModal();

    const handleNewGame = () => {
        gameStore.startNewGame();
        openModal();
    };

    return (
        <div className={styles.mainMenu}>
            <UnknownGameModal />
            <Modal isOpen={isOpen} close={closeModal}>
                <img className={styles.badge} src={waitingBadge} alt="" />
                <div className={styles.modalMessage}>Copy URL and send it to your friend to start a new game</div>
                <div className={styles.spinner}>
                    <Spinner />
                </div>
            </Modal>

            <img src={mainMenu} className={styles.menuBackground} alt="" />
            <Button onClick={handleNewGame} className={styles.newGameBtn}>
                New game
            </Button>
            <div>{gameStore.gameCode}</div>
        </div>
    );
});

export default MenuScreen;
