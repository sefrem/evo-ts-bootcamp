import React from 'react';
import { observer } from 'mobx-react-lite';

import bustedBadge from '../../../assets/icons/badges/badge_busted.svg';
import Hand from '../../UI/Hand/Hand';
import PlayerData from '../../UI/PlayerData/PlayerData';
import { useStore } from '../../../stores';

import styles from './GameDealer.module.css';

const GameDealer = observer(() => {
    const gameStore = useStore('GameStore');
    const isBusted = gameStore.dealer?.status === 'busted';

    return (
        <div className={styles.dealer}>
            <div className={styles.dealerHand}>
                {isBusted && <img src={bustedBadge} className={styles.dealerBadge} alt="" />}
                <Hand hand={gameStore.dealer?.hand} hideLast={!!gameStore.activePlayerId} />
            </div>
            <PlayerData id="" name="Dealer" score={gameStore.dealer?.score} />
        </div>
    );
});

export default GameDealer;
