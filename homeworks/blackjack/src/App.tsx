import React, { useEffect } from 'react';
import './App.css';
import { useStore } from './stores';
import { observer } from 'mobx-react-lite';

const App: React.FC = observer(() => {
    const mainStore = useStore('MainStore');

    useEffect(() => {
        mainStore.startGame();
    }, []);

    return (
        <div className="App">
            <button onClick={mainStore.deal}>Deal</button>
        </div>
    );
});

export default App;
