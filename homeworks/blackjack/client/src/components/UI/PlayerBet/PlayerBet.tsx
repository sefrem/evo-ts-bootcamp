import React from 'react';
import { observer } from 'mobx-react-lite';

import { ChipsValues } from '../../../types/types';
import { getChipIconPath } from '../../../utils/getChipIconPath';

import styles from './PlayerBet.module.css';

interface Props {
    chips: ChipsValues[] | undefined;
}

const PlayerBet: React.VFC<Props> = observer(({ chips }) => {
    let total = 0;
    return (
        <div>
            Active Bet:
            <ul className={styles.chips}>
                {chips?.length &&
                    chips.map((value, index) => {
                        total += Number(value);
                        return (
                            <li className={styles.chip} key={value + index} style={{ left: 5 * index }}>
                                <img className={styles.chipIcon} src={getChipIconPath(value)} alt="" />
                            </li>
                        );
                    })}
            </ul>
            <div>Total: {total}</div>
        </div>
    );
});

export default PlayerBet;
