import React from 'react';
import ReactDOM from 'react-dom';
import { configure } from 'mobx';

import App from './App';
import { StoreProvider } from './stores';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

import './index.css';

configure({
    enforceActions: 'always',
    computedRequiresReaction: true,
    reactionRequiresObservable: true,
    observableRequiresReaction: true,
});

ReactDOM.render(
    <React.StrictMode>
        <ErrorBoundary>
            <StoreProvider>
                <App />
            </StoreProvider>
        </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById('root'),
);
