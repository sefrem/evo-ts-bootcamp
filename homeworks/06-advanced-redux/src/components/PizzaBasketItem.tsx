import React from 'react';
import { Circle } from './Circle';
import { PizzaCount } from './PizzaCount';
import { PizzaName } from './PizzaName';
import { PizzaDescription } from './PizzaDescription';
import { PizzaPrice } from './PizzaPrice';

interface PizzaProps {
    onMinus: (_id: string) => void;
    price: number;
    name: string;
    count: number;
    _id: string;
}

export function PizzaBasketItem({ onMinus, _id, price, name, count }: PizzaProps) {
    const onClick = React.useCallback(() => {
        onMinus(_id);
    }, [onMinus, _id]);

    return (
        <div className="w-full bg-white rounded mb-2">
            <div className="flex">
                <div className="flex-shrink-0 p-1">
                    <img
                        className="h-24 w-full object-cover md:w-24"
                        src="data:image/jpeg;base64,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"
                        alt="pizzapic"
                    />
                </div>
                <div className="w-full p-4">
                    <PizzaName name={name} />
                    <PizzaDescription desc="description" />
                    <PizzaCount count={count} />
                </div>
                <div className="flex flex-col justify-around">
                    <PizzaPrice price={price} />
                    <Circle onClick={onClick} type="minus" />
                </div>
            </div>
        </div>
    );
}
