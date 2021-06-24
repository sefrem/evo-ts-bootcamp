import React from 'react';
import { observer } from 'mobx-react-lite';

import Card from '../Card/Card';
import { ICard } from '../../../types/types';

import styles from './Hand.module.css';
import clsx from 'clsx';

interface Props {
    data: ICard[];
}

const Hand: React.VFC<Props> = observer(({ data }) => {
    return (
        <div className={styles.hand}>
            {data.map(({ rank, suit }, index) => (
                <div className={clsx(styles.cardInHand, styles[`cardInHand-${index + 1}`])}>
                    <Card rank={rank} suit={suit} key={rank + suit} />
                </div>
            ))}
        </div>
    );
});

export default Hand;
