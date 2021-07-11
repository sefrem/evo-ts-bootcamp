import React from 'react';
import { observer } from 'mobx-react-lite';

import TableScreen from './screens/TableScreen/TableScreen';
import MenuScreen from './screens/MenuScreen/MenuScreen';
import { useStore } from './stores';

import styles from './App.module.css';

const App: React.VFC = observer(() => {
    const gameStore = useStore('GameStore');

    React.useEffect(() => {
        const gameCode = window.location.pathname.slice(1);
        if (gameCode) {
            gameStore.joinGame(gameCode);
        }
    }, [gameStore]);

    return <div className={styles.app}>{gameStore.players.length > 0 ? <TableScreen /> : <MenuScreen />}</div>;
});

export default App;
