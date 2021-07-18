import React from 'react';

import bustedBadge from '../../../assets/icons/badges/badge_busted.svg';
import winBadge from '../../../assets/icons/badges/badge_player_wins.svg';
import loseBadge from '../../../assets/icons/badges/badge_player_loses.svg';
import standoffBadge from '../../../assets/icons/badges/badge_standoff.svg';
import bankruptBadge from '../../../assets/icons/badges/badge_bankrupt.svg';
import { PlayerStatus } from '../../../types/types';

interface Props {
    status: PlayerStatus;
}

const PlayerBadge: React.VFC<Props> = ({ status }) => {
    const isBusted = status === 'busted';
    const isWinner = status === 'win';
    const isLoser = status === 'lose';
    const isStandoff = status === 'standoff';
    const isBankrupt = status === 'bankrupt';

    return (
        <div>
            {isBusted && <img src={bustedBadge} alt="" />}
            {isWinner && <img src={winBadge} alt="" />}
            {isLoser && <img src={loseBadge} alt="" />}
            {isStandoff && <img src={standoffBadge} alt="" />}
            {isBankrupt && <img src={bankruptBadge} alt="" />}
        </div>
    );
};

export default PlayerBadge;
