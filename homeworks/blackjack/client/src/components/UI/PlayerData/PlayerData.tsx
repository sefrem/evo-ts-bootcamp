import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../../stores';

import styles from './PlayerData.module.css';

interface Props {
    id: string;
    score: number | undefined;
    name: string;
    index?: number;
}

const PlayerData: React.VFC<Props> = observer(({ id, score, name, index }) => {
    const gameStore = useStore('GameStore');

    const isActivePlayer = gameStore.activePlayerId === id;
    const isFirstPlayer = index === 0;

    return (
        <div className={clsx(styles.playerData, isFirstPlayer && styles.playerFirst)}>
            <div className={clsx(styles.playerScore, !isActivePlayer && styles.inactiveBadge)}>{score}</div>
            <span className={clsx(styles.playerName, isFirstPlayer && styles.playerFirstName)}>{name}</span>
        </div>
    );
});

export default PlayerData;
