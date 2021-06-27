import React from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../stores';
import Hand from '../../components/UI/Hand/Hand';

import styles from './TableScreen.module.css';

const TableScreen: React.VFC = observer(() => {
    const gameStore = useStore('GameStore');

    React.useEffect(() => {
        gameStore.startGame();
    }, [gameStore]);

    return (
        <div className={styles.field}>
            <div>
                <button onClick={gameStore.deal}>Deal</button>
                <button onClick={gameStore.resetGame}>Reset</button>
            </div>

            <div className={styles.dealer}>
                <span>Dealer:</span>
                <span>{gameStore.players['0'].score}</span>
                <Hand data={gameStore.players['0'].hand} hideLast={gameStore.activePlayer !== '0'} />
            </div>
            <div className={styles.player}>
                <span>{gameStore.players['1'].name}: </span>
                <span>{gameStore.players['1'].score}</span>
                <Hand data={gameStore.players['1'].hand} />
                {gameStore.activePlayer === '1' && (
                    <div>
                        <button onClick={gameStore.hit}>Hit</button>
                        <button onClick={gameStore.stand}>Stand</button>
                    </div>
                )}
            </div>
        </div>
    );
});

export default TableScreen;
