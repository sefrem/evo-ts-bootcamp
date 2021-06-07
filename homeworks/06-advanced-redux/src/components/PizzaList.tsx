import React from 'react';
import { connect } from 'react-redux';
import { PizzaItem } from './PizzaItem';
import { addPizzaToBasket } from '../redux/basket/basket.actions';
import { RootState } from '../redux/store';
import { pizzaViewed } from '../redux/items/items.actions';
import { Loading } from './Loading';

interface PizzaListProps {
    pizza: {
        _id: string;
        name: string;
        price: number;
    }[];
    onAdd: (_id: string) => void;
    pizzaViewed: () => void;
    loader: boolean;
}

function PizzaList({ pizza, onAdd, pizzaViewed, loader }: PizzaListProps) {
    React.useEffect(() => {
        pizzaViewed();
    }, [pizzaViewed]);

    if (loader) {
        return <Loading />;
    }

    return (
        <>
            {pizza.map(p => (
                <PizzaItem key={p._id} _id={p._id} name={p.name} price={p.price} onAdd={onAdd} />
            ))}
        </>
    );
}

function mapStateToProps(state: RootState) {
    return {
        pizza: state.items,
        loader: state.loader.itemsLoader,
    };
}

export default connect(mapStateToProps, { onAdd: addPizzaToBasket, pizzaViewed })(PizzaList);
