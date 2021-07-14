import React from 'react';
import { observer } from 'mobx-react-lite';

import { GameStatus, Player } from '../../types/types';
import PlayerBet from '../UI/PlayerBet/PlayerBet';
import Hand from '../UI/Hand/Hand';
import PlayerChips from '../UI/PlayerChips/PlayerChips';
import { useStore } from '../../stores';
import Button from '../UI/Button/Button';

import styles from './Player.module.css';

type Props = {
    player: Player;
};

const GamePlayer: React.VFC<Props> = observer(({ player }) => {
    const gameStore = useStore('GameStore');
    const isActivePlayer = gameStore.activePlayerId === gameStore.playerId && gameStore.activePlayerId === player.id;
    const showEndBetBtn = gameStore.status === GameStatus.idle && isActivePlayer;
    const isActivePlayerAndGameGoing = isActivePlayer && gameStore.status === GameStatus.playing;

    return (
        <div className={styles.player}>
            <div className={styles.playerHand}>
                {isActivePlayerAndGameGoing && (
                    <div className={styles.playerActionButtons}>
                        <Button className={styles.buttonHit} disabled={player.isBusted} onClick={gameStore.hit}>
                            Hit
                        </Button>
                        <Button className={styles.buttonStand} onClick={gameStore.stand}>
                            Stand
                        </Button>
                    </div>
                )}
                <Hand data={player.hand} />
            </div>

            <div className={styles.playerData}>
                <div className={styles.playerScore}>{player.score}</div>
                <span className={styles.playerName}>{player.name}</span>
            </div>

            <PlayerBet chips={player.bet} showEndBetBtn={showEndBetBtn} />

            <PlayerChips chips={player.chips} />
        </div>
    );
});

export default GamePlayer;
