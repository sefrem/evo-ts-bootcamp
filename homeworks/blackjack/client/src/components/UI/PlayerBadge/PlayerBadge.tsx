import React from 'react';

import bustedBadge from '../../../assets/icons/badge_busted.svg';
import winBadge from '../../../assets/icons/badge_player_wins.svg';
import loseBadge from '../../../assets/icons/badge_player_loses.svg';
import standoffBadge from '../../../assets/icons/badge_standoff.svg';
import { PlayerRoundStatus } from '../../../types/types';

interface Props {
    status: PlayerRoundStatus;
}

const PlayerBadge: React.VFC<Props> = ({ status }) => {
    const isBusted = status === 'busted';
    const isWinner = status === 'win';
    const isLoser = status === 'lose';
    const isStandoff = status === 'standoff';

    return (
        <div>
            {isBusted && <img src={bustedBadge} alt="" />}
            {isWinner && <img src={winBadge} alt="" />}
            {isLoser && <img src={loseBadge} alt="" />}
            {isStandoff && <img src={standoffBadge} alt="" />}
        </div>
    );
};

export default PlayerBadge;
