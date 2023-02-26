import React from 'react';
import clsx from 'clsx';

import { Card, Suits } from '../../../types/types';
import hearts from '../../../assets/icons/suits/heart.svg';
import diamonds from '../../../assets/icons/suits/diamonds.svg';
import clubs from '../../../assets/icons/suits/clubs.svg';
import spades from '../../../assets/icons/suits/spades.svg';
import cardBack from '../../../assets/icons/card_back.svg';

import styles from './GameCard.module.css';

interface Props extends Card {
    faceDown?: boolean;
}

const GameCard: React.VFC<Props> = ({ rank, suit, faceDown }) => {
    const suitUrl = getSuitIconUrl(suit);
    return (
        <div className={clsx(styles.card, faceDown && styles.turnedCard)}>
            <div className={styles.cardFront}>
                <div className={styles.cardValues}>
                    {!faceDown && <div className={clsx(styles.cardValue, (suit === 'hearts' || suit === 'diamonds') && styles.red)}>
                        {rank}
                    </div>}
                    <img className={styles.suitIconSmall} src={suitUrl} alt={`${rank} of ${suit}`} />
                </div>
                {!faceDown && <div className={styles.cardField}>
                    <img className={styles.suitIcon} src={suitUrl} alt={`${rank} of ${suit}`} />
                </div>}
            </div>
            {faceDown && <div className={styles.cardBack}>
                <img src={cardBack} className={styles.cardBackPattern} alt="" />
            </div>}
        </div>
    );
};

export default GameCard;

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
