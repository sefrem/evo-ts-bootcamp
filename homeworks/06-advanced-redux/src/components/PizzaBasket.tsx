import React from 'react';
import { connect } from 'react-redux';
import { Pizza } from '../types';
import { PizzaBasketItem } from './PizzaBasketItem';
import { removePizzaFromBasket } from '../redux/basket/basket.actions';
import { RootState } from '../redux/store';

interface PizzaBucketProps {
    pizza: Array<Pizza & { count: number }>;
    onMinus: (_id: string) => void;
}

function PizzaBasket(props: PizzaBucketProps) {
    const { pizza, onMinus } = props;
    return (
        <>
            {pizza.map(p => (
                <PizzaBasketItem
                    _id={p._id}
                    onMinus={onMinus}
                    key={p._id}
                    price={p.price}
                    name={p.name}
                    count={p.count}
                />
            ))}
        </>
    );
}

function mapStateToProps(state: RootState) {
    return {
        pizza: state.basket.pizza,
    };
}

export default connect(mapStateToProps, { onMinus: removePizzaFromBasket })(PizzaBasket);
