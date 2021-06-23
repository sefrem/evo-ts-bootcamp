import React from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../stores';
import Card from '../UI/Card';

const Dealer: React.VFC = observer(() => {
    const gameStore = useStore('GameStore');
    return (
        <div>
            <span>Dealer's hand:</span>
            {gameStore.dealer.map(({ rank, suit }) => (
                <Card rank={rank} suit={suit} key={rank + suit} />
            ))}
        </div>
    );
});

export default Dealer;
