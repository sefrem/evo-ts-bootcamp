import React from 'react';
import { observer } from 'mobx-react-lite';

import { GameStatus, Player } from '../../types/types';
import PlayerBet from '../UI/PlayerBet/PlayerBet';
import Hand from '../UI/Hand/Hand';
import PlayerChips from '../UI/PlayerChips/PlayerChips';
import { useStore } from '../../stores';

import styles from './Player.module.css';

type Props = {
    player: Player;
};

const GamePlayer: React.VFC<Props> = observer(({ player }) => {
    const gameStore = useStore('GameStore');
    const isActivePlayer = gameStore.activePlayerId === gameStore.playerId && gameStore.activePlayerId === player.id;
    const showEndBettingBtn = gameStore.status === GameStatus.idle && isActivePlayer;
    const isActivePlayerAndGameGoing = isActivePlayer && gameStore.status === GameStatus.playing;

    return (
        <div className={styles.player}>
            {player?.isBusted ? <div style={{ height: 138 }}>BUSTED</div> : <PlayerBet chips={player.bet} />}

            <span>{player?.name}: </span>
            <span>{player?.score}</span>

            <Hand data={player?.hand} />

            <PlayerChips chips={player?.chips} isActivePlayer={isActivePlayer} />

            {showEndBettingBtn && <button onClick={gameStore.endBetting}>End Betting</button>}

            {isActivePlayerAndGameGoing && (
                <div>
                    <button disabled={player?.isBusted} onClick={gameStore.hit}>
                        Hit
                    </button>
                    <button onClick={gameStore.stand}>Stand</button>
                </div>
            )}
        </div>
    );
});

export default GamePlayer;
