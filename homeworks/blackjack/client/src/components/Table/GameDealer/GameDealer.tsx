import React from 'react';
import { observer } from 'mobx-react-lite';

import bustedBadge from '../../../assets/icons/badge_busted.svg';
import Hand from '../../UI/Hand/Hand';
import PlayerData from '../../UI/PlayerData/PlayerData';
import { useStore } from '../../../stores';

import styles from './GameDealer.module.css';

const GameDealer = observer(() => {
    const gameStore = useStore('GameStore');
    const isBusted = gameStore.dealer?.roundStatus === 'busted';

    return (
        <div className={styles.dealer}>
            {isBusted && <img src={bustedBadge} alt="" />}
            <Hand hand={gameStore.dealer?.hand} hideLast={!!gameStore.activePlayerId} />
            <PlayerData id="" name="Dealer" score={gameStore.dealer?.score} />
        </div>
    );
});

export default GameDealer;
