import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';

const MenuScreen: React.VFC = observer(() => {
    const gameStore = useStore('GameStore');

    return (
        <div>
            <div>BlackJack</div>
            <button onClick={gameStore.startNewGame}>New game</button>
            <div>{gameStore.gameCode}</div>
        </div>
    );
});

export default MenuScreen;
