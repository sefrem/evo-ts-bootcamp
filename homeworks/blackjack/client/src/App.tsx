import React from 'react';

import TableScreen from './screens/TableScreen/TableScreen';

import styles from './App.module.css';

const App: React.VFC = () => {
    return (
        <div className={styles.App}>
            <TableScreen />
        </div>
    );
};

export default App;
