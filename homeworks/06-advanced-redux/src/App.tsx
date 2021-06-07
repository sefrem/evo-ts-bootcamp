import React from 'react';
import './App.css';
import { connect } from 'react-redux';
import { getPizzas } from './redux/items/items.actions';
import PizzaList from './components/PizzaList';
import PizzaBasket from './components/PizzaBasket';
import TotalPrice from './components/TotalPrice';

interface AppProps {
    getPizzas: () => void;
}

function App({ getPizzas }: AppProps) {
    React.useEffect(() => {
        getPizzas();
    }, [getPizzas]);

    return (
        <div className="grid grid-cols-3 gap-4 h-full">
            <div className="col-span-2 p-8">
                <div className="grid grid-cols-4 gap-4">
                    <PizzaList />
                </div>
            </div>
            <div className="col-span-1 bg-white overflow-y-auto h-full">
                <div className="flex flex-col p-8">
                    <TotalPrice />
                    <PizzaBasket />
                    <div className="flex flex-col">
                        <button className="bg-yellow-400 rounded-xl pt-2 pb-2">Make Order</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default connect(null, { getPizzas })(App);
