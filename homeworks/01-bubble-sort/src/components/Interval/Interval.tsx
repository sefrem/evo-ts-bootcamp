import React from "react";

import './style.css'

type Props = {
    intervalInput: number,
    onChangeInterval: (e: React.ChangeEvent<HTMLInputElement>) => void,
    setSortInterval: () => void
}

export default function Interval({intervalInput, onChangeInterval, setSortInterval}: Props): JSX.Element {
    return (
        <div className='interval'>
            <label htmlFor='interval'>Sorting interval (ms):</label>
            <input type='number' id='interval' value={intervalInput} onChange={onChangeInterval}/>
            <button type='button' onClick={setSortInterval}>Set</button>
        </div>
    )
}

