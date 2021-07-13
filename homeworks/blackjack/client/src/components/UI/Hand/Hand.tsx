import React from 'react';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

import { Card } from '../../../types/types';
import GameCard from '../GameCard/GameCard';

import styles from './Hand.module.css';

interface Props {
    data: Card[] | undefined;
    hideLast?: boolean;
}

const Hand: React.VFC<Props> = observer(({ data, hideLast = false }) => {
    return (
        <div className={styles.hand}>
            {data?.map(({ rank, suit }, index) => {
                const faceDown = hideLast && index !== 0 && index === data.length - 1;
                return (
                    <div className={clsx(styles.cardInHand, styles[`cardInHand-${index + 1}`])} key={rank + suit}>
                        <GameCard rank={rank} suit={suit} faceDown={faceDown} />
                    </div>
                );
            })}
        </div>
    );
});

export default Hand;
