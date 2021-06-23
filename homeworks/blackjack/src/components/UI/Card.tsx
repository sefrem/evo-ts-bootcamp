import React from 'react';
import clsx from 'clsx';

import { ICard } from '../../types/types';

import styles from './Card.module.css';

const Card: React.VFC<ICard> = ({ rank, suit }) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardValues}>
                <div className={clsx((suit === 'hearts' || suit === 'diamonds') && styles.red)}>{rank}</div>
                <div className={clsx(styles.suits, styles[suit])} />
            </div>
        </div>
    );
};

export default Card;
