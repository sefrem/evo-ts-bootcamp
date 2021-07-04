import React from 'react';
import { observer } from 'mobx-react-lite';

import { Chips, ChipsValues, Players } from '../../../types/types';
import { useStore } from '../../../stores';
import { getChipIconPath } from '../../../utils/getChipIconPath';

import styles from './PlayerChips.module.css';

interface Props {
    chips: Chips | undefined;
    isActivePlayer: boolean;
}

const PlayerChips: React.VFC<Props> = observer(({ chips, isActivePlayer }) => {
    const gameStore = useStore('GameStore');
    let total = 0;

    const setBet = (value: ChipsValues) => {
        isActivePlayer && gameStore.setBet(value);
    };

    return (
        <div>
            <ul className={styles.chips}>
                {chips &&
                    (Object.entries(chips) as Array<[ChipsValues, number]>).map(([value, quantity]) => {
                        total += Number(value) * quantity;
                        if (quantity === 0) return;
                        return (
                            <li className={styles.chip} key={value} onClick={() => setBet(value)}>
                                <img className={styles.chipIcon} src={getChipIconPath(value)} alt="" />
                                <div>{quantity}</div>
                            </li>
                        );
                    })}
            </ul>
            <div>Total: {total}</div>
        </div>
    );
});

export default PlayerChips;
