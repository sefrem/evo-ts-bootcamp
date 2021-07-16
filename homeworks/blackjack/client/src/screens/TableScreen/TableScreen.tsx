import React from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../stores';
import GameDealer from '../../components/Table/GameDealer/GameDealer';
import GamePlayer from '../../components/Table/GamePlayer/GamePlayer';

import styles from './TableScreen.module.css';

const TableScreen: React.VFC = observer(() => {
    const gameStore = useStore('GameStore');

    return (
        <div className={styles.field}>
            {!!gameStore.nextGameTimer && (
                <div className={styles.nextGameTimer}>
                    Next game in <div className={styles.timerCount}>{gameStore.nextGameTimer}</div>
                </div>
            )}

            <div className={styles.dealer}>
                <GameDealer />
            </div>

            <div className={styles.players}>
                {gameStore.players.map((player, index) => (
                    <GamePlayer key={player.id} player={player} index={index} />
                ))}
            </div>
        </div>
    );
});

export default TableScreen;
