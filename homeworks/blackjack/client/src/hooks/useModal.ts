import React from 'react';

export const useModal = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const closeModal = (e: React.MouseEvent<HTMLElement>) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false);
        }
    };

    const openModal = () => {
        setIsOpen(true);
    };

    return { isOpen, openModal, closeModal };
};
