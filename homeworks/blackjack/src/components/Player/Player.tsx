import React from 'react';
import { observer } from 'mobx-react-lite';

import { GameStatus, Players } from '../../types/types';
import PlayerBet from '../UI/PlayerBet/PlayerBet';
import Hand from '../UI/Hand/Hand';
import PlayerChips from '../UI/PlayerChips/PlayerChips';
import { useStore } from '../../stores';

import styles from './Player.module.css';

type Props = {
    playerId: Players;
};

const Player: React.VFC<Props> = observer(({ playerId }) => {
    const gameStore = useStore('GameStore');
    const isActivePlayer = gameStore.activePlayer === playerId;

    return (
        <div className={styles.player}>
            {gameStore.players[playerId].isBusted ? (
                <div style={{ height: 138 }}>BUSTED</div>
            ) : (
                <PlayerBet chips={gameStore.getPlayerBet(playerId)} />
            )}

            <span>{gameStore.players[playerId].name}: </span>
            <span>{gameStore.players[playerId].score}</span>
            <Hand data={gameStore.players[playerId].hand} />
            <PlayerChips chips={gameStore.players[playerId].chips} isActivePlayer={isActivePlayer} />
            {gameStore.status === GameStatus.idle && isActivePlayer && (
                <button onClick={gameStore.endBetting}>End Betting</button>
            )}
            {isActivePlayer && gameStore.status === GameStatus.playing && (
                <div>
                    <button onClick={gameStore.hit}>Hit</button>
                    <button onClick={gameStore.stand}>Stand</button>
                </div>
            )}
        </div>
    );
});

export default Player;
