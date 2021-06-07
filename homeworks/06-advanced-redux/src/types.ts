export type Pizza = {
    name: string;
    price: number;
    _id: string;
};

export type Basket = {
    pizza: Array<Pizza & { count: number }>;
    totalPrice: number;
};
