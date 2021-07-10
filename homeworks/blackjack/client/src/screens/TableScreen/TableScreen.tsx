import React from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../stores';
import Hand from '../../components/UI/Hand/Hand';
import Player from '../../components/Player/Player';

import styles from './TableScreen.module.css';

const TableScreen: React.VFC = observer(() => {
    const gameStore = useStore('GameStore');

    React.useEffect(() => {
        gameStore.startGame();
    }, [gameStore]);

    return (
        <div className={styles.field}>
            {!!gameStore.nextGameTimer && <div>Next game in {gameStore.nextGameTimer}</div>}

            <div className={styles.dealer}>
                <span>Dealer:</span>
                <span>{gameStore.dealer?.score}</span>
                <Hand data={gameStore.dealer?.hand} hideLast={!!gameStore.activePlayer} />
            </div>

            <div className={styles.players}>
                {gameStore.playersIds.map(playerId => (
                    <Player key={playerId} playerId={playerId} />
                ))}
            </div>
        </div>
    );
});

export default TableScreen;
