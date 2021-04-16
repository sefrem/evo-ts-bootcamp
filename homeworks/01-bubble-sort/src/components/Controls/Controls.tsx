import React from "react";

import './style.css'

type Props = {
    reset: () => void,
    onClickStart: () => void,
    checkIfSolved: () => boolean,
    checkIfSort: () => boolean,
    sortByStep: boolean,
    stepSort: () => void,
}

export default function Controls({
 reset,
 onClickStart,
 checkIfSolved,
 checkIfSort,
 sortByStep,
 stepSort
  }: Props): JSX.Element {
    return (
        <div className='controls'>
            <button type='button' onClick={reset}>New set</button>
            <button type='button'
                    onClick={onClickStart}
                    disabled={checkIfSolved()}>
                {checkIfSort() && !sortByStep ? 'Pause' : 'Start'}
            </button>
            <button type='button'
                    disabled={checkIfSolved()}
                    onClick={stepSort}>
                Step
            </button>
        </div>
    )
}
