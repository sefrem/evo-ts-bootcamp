import React from 'react';
import clsx from 'clsx';

import { ICard, Suits } from '../../../types/types';
import hearts from '../../../assets/icons/suits/heart.svg';
import diamonds from '../../../assets/icons/suits/diamonds.svg';
import clubs from '../../../assets/icons/suits/clubs.svg';
import spades from '../../../assets/icons/suits/spades.svg';

import styles from './Card.module.css';

const Card: React.VFC<ICard> = ({ rank, suit }) => {
    const suitUrl = getSuitIconUrl(suit);
    return (
        <div className={styles.card}>
            <div className={styles.cardValues}>
                <div className={clsx((suit === 'hearts' || suit === 'diamonds') && styles.red)}>{rank}</div>
                <img className={styles.suitIconSmall} src={suitUrl} alt={`${rank} of ${suit}`} />
            </div>
            <div className={styles.cardField}>
                <img className={styles.suitIcon} src={suitUrl} alt={`${rank} of ${suit}`} />
            </div>
        </div>
    );
};

export default Card;

function getSuitIconUrl(suit: Suits): string {
    switch (suit) {
        case 'clubs':
            return clubs;
        case 'hearts':
            return hearts;
        case 'diamonds':
            return diamonds;
        case 'spades':
            return spades;
    }
}
