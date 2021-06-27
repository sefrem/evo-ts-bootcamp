import React from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../stores';
import Hand from '../UI/Hand/Hand';

const Dealer: React.VFC = observer(() => {
    const gameStore = useStore('GameStore');
    return (
        <div>
            <span>Dealer's hand:</span>
            {/*<Hand data={gameStore.dealer} />*/}
        </div>
    );
});

export default Dealer;
