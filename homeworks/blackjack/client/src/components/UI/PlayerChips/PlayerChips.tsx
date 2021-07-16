import React from 'react';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

import { Chips, ChipsValues } from '../../../types/types';
import { useStore } from '../../../stores';
import { getChipIconPath } from '../../../utils';

import styles from './PlayerChips.module.css';

interface Props {
    chips: Chips;
    index: number;
}

const PlayerChips: React.VFC<Props> = observer(({ chips, index }) => {
    const gameStore = useStore('GameStore');
    const setBet = React.useCallback((value: ChipsValues) => () => gameStore.setBet(value), [gameStore]);
    const isLastPlayer = index !== 0;
    let total = 0;

    return (
        <div className={clsx(styles.playerChips, isLastPlayer && styles.lastPlayerChips)}>
            <ul className={clsx(styles.chips, isLastPlayer && styles.lastChips)}>
                {(Object.entries(chips) as Array<[ChipsValues, number]>).map(([value, quantity]) => {
                    total += Number(value) * quantity;

                    if (quantity === 0) return null;

                    return (
                        <li className={styles.chip} key={value} onClick={setBet(value)}>
                            <img className={styles.chipIcon} src={getChipIconPath(value)} alt="" />
                            <div className={styles.chipsQuantity}>{quantity}</div>
                        </li>
                    );
                })}
            </ul>
            <div className={clsx(styles.balance, isLastPlayer && styles.lastPlayerBalance)}>
                Balance: <span className={styles.balanceTotal}>{total}</span>
            </div>
        </div>
    );
});

export default PlayerChips;
