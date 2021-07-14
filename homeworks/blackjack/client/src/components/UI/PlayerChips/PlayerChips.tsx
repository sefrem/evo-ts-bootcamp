import React from 'react';
import { observer } from 'mobx-react-lite';

import { Chips, ChipsValues } from '../../../types/types';
import { useStore } from '../../../stores';
import { getChipIconPath } from '../../../utils';

import styles from './PlayerChips.module.css';
import clsx from 'clsx';

interface Props {
    chips: Chips;
}

const PlayerChips: React.VFC<Props> = observer(({ chips }) => {
    const gameStore = useStore('GameStore');
    let total = 0;

    const setBet = React.useCallback((value: ChipsValues) => () => gameStore.setBet(value), [gameStore]);

    return (
        <div className={clsx(styles.playerChips, gameStore.isLastPlayer() && styles.lastPlayerChips)}>
            <div className={styles.balance}>
                Balance: <span className={styles.balanceTotal}>{total}</span>
            </div>
            <ul className={styles.chips}>
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
        </div>
    );
});

export default PlayerChips;
