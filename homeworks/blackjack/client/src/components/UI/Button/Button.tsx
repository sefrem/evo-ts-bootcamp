import React from 'react';
import clsx from 'clsx';

import styles from './Button.module.css';

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...other }) => {
    return (
        <button className={clsx(styles.button, className)} {...other}>
            {children}
        </button>
    );
};

export default Button;
