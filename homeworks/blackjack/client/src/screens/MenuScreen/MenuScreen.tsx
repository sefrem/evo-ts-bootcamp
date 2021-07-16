import React from 'react';
import { observer } from 'mobx-react-lite';

import mainMenu from '../../assets/icons/main_menu.svg';
import { useStore } from '../../stores';
import Button from '../../components/UI/Button/Button';

import styles from './MenuScreen.module.css';
import Modal from '../../components/UI/Modal/Modal';
import { useModal } from '../../hooks/useModal';

const MenuScreen: React.VFC = observer(() => {
    const gameStore = useStore('GameStore');
    const { isOpen, openModal, closeModal } = useModal();

    const handleNewGame = () => {
        gameStore.startNewGame();
        openModal();
    };

    return (
        <div className={styles.mainMenu}>
            <Modal isOpen={isOpen} close={closeModal}>
                <div className={styles.pendingGame}>Copy the URL and send it to your friend to start a new game</div>
                <svg className={styles.spinner} viewBox="0 0 50 50">
                    <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
                </svg>
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
