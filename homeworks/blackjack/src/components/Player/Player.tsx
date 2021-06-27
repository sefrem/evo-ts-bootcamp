import React from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../stores';
import Hand from '../UI/Hand/Hand';

const Player: React.VFC = observer(() => {
    const gameStore = useStore('GameStore');
    return (
        <div>
            <span>PLayer's hand:</span>
            {/*<Hand data={gameStore.player} />*/}
        </div>
    );
});

export default Player;
