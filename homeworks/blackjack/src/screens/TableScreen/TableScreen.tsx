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
            <div>The winner of the game is: {gameStore.winner}</div>
            {/*<div>*/}
            {/*    <button onClick={gameStore.deal}>Deal</button>*/}
            {/*    <button onClick={gameStore.resetGame}>Reset</button>*/}
            {/*</div>*/}

            <div className={styles.dealer}>
                <span>Dealer:</span>
                <span>{gameStore.players['0'].score}</span>
                <Hand data={gameStore.players['0'].hand} hideLast={gameStore.activePlayer !== '0'} />
            </div>

            <div className={styles.players}>
                {gameStore.playersIds.map(playerId => {
                    if (playerId === '0') return;
                    return <Player key={playerId} playerId={playerId} />;
                })}
            </div>
        </div>
    );
});

export default TableScreen;
