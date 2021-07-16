import React from 'react';
import { observer } from 'mobx-react-lite';

import { GameStatus, Player } from '../../../types/types';
import PlayerBet from '../../UI/PlayerBet/PlayerBet';
import Hand from '../../UI/Hand/Hand';
import PlayerChips from '../../UI/PlayerChips/PlayerChips';
import { useStore } from '../../../stores';
import Button from '../../UI/Button/Button';
import PlayerData from '../../UI/PlayerData/PlayerData';
import PlayerBadge from '../../UI/PlayerBadge/PlayerBadge';

import styles from './GamePlayer.module.css';

type Props = {
    player: Player;
    index: number;
};

const GamePlayer: React.VFC<Props> = observer(({ player, index }) => {
    const gameStore = useStore('GameStore');
    const isActivePlayerAndClient = gameStore.isActivePlayerAndClient(player.id);
    const showEndBetBtn = gameStore.status === GameStatus.idle && isActivePlayerAndClient && gameStore.playerHasBet();
    const isActivePlayerAndGameGoing = isActivePlayerAndClient && gameStore.status === GameStatus.playing;
    const isBusted = player.roundStatus === 'busted';

    return (
        <div className={styles.player}>
            <div className={styles.playerHand}>
                {isActivePlayerAndGameGoing && (
                    <div className={styles.playerActionButtons}>
                        <Button className={styles.buttonHit} disabled={isBusted} onClick={gameStore.hit}>
                            Hit
                        </Button>
                        <Button className={styles.buttonStand} onClick={gameStore.stand}>
                            Stand
                        </Button>
                    </div>
                )}

                <div className={styles.statusBadge}>
                    <PlayerBadge status={player.roundStatus} />
                </div>

                <Hand hand={player.hand} />
            </div>

            <div className={styles.playerDataWrapper}>
                <PlayerData id={player.id} name={player.name} score={player.score} index={index} />
            </div>

            <PlayerBet chips={player.bet} showEndBetBtn={showEndBetBtn} />

            <PlayerChips chips={player.chips} index={index} />
        </div>
    );
});

export default GamePlayer;
