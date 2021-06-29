import React from 'react';
import { observer } from 'mobx-react-lite';

import { Chips } from '../../../types/types';

interface Props {
    chips: Chips;
}

const PlayerChips: React.VFC<Props> = observer(({ chips }) => {
    return (
        <div>
            <ul>
                {Object.entries(chips).map(([value, quantity]) => (
                    <li>
                        ${value} - {quantity}pcs
                    </li>
                ))}
            </ul>
        </div>
    );
});

export default PlayerChips;
