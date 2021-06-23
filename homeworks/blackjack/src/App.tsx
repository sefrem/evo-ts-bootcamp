import React from 'react';
import { observer } from 'mobx-react-lite';

import TableScreen from './screens/TableScreen/TableScreen';

import styles from './App.module.css';

const App: React.VFC = observer(() => {
    return (
        <div className={styles.App}>
            <TableScreen />
        </div>
    );
});

export default App;
