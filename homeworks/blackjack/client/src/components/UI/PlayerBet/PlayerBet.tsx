import React from 'react';
import { observer } from 'mobx-react-lite';
import { computed } from 'mobx';

import Button from '../Button/Button';
import { ChipsValues } from '../../../types/types';
import { getChipIconPath } from '../../../utils';
import { useStore } from '../../../stores';

import styles from './PlayerBet.module.css';

interface Props {
    chips: ChipsValues[];
    playerId: string;
}

const PlayerBet: React.VFC<Props> = observer(({ chips, playerId }) => {
    const gameStore = useStore('GameStore');
    const showEndBetBtn = computed(() => gameStore.showEndBetBtn(playerId)).get();
    let total = 0;

    return (
        <div className={styles.playerBet}>
            {showEndBetBtn && (
                <Button className={styles.buttonEndBet} onClick={gameStore.endBetting}>
                    End Betting
                </Button>
            )}
            <div className={styles.placeBet}>
                <span> Place your bet</span>
                <ul className={styles.chips}>
                    {chips.map((value, index) => {
                        total += Number(value);
                        return (
                            <li
                                className={styles.chip}
                                key={value + index}
                                style={{ left: 2 * index, bottom: 3.5 * index }}
                            >
                                <img className={styles.chipIcon} src={getChipIconPath(value)} alt="" />
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className={styles.totalBet}>
                Bet: <span className={styles.totalBetQuantity}>{total}</span>
            </div>
        </div>
    );
});

export default PlayerBet;
