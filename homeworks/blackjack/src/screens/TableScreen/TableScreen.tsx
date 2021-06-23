import React from 'react';
import { observer } from 'mobx-react-lite';

import Dealer from '../../components/Dealer/Dealer';
import Player from '../../components/Player/Player';

import styles from './TableScreen.module.css';
import { useStore } from '../../stores';

const TableScreen: React.VFC = observer(() => {
    const gameStore = useStore('GameStore');

    React.useEffect(() => {
        gameStore.startGame();
    }, [gameStore]);

    return (
        <div className={styles.field}>
            <button onClick={gameStore.deal}>Deal</button>
            <Dealer />

            <Player />
        </div>
    );
});

export default TableScreen;
