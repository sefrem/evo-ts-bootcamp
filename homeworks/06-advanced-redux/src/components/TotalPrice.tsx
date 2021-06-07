import React from 'react';
import { PizzaPrice } from './PizzaPrice';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';

interface TotalPriceProps {
    price: number;
}

function TotalPrice({ price }: TotalPriceProps) {
    return (
        <div className="flex">
            <span>Total price:</span>
            <PizzaPrice price={price} />
        </div>
    );
}

function mapStateToProps(state: RootState) {
    return {
        price: state.basket.totalPrice,
    };
}

export default connect(mapStateToProps)(TotalPrice);
