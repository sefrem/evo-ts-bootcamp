import React from "react";

import {DEFAULT_ARRAY_SIZE} from "../../constants";
import './style.css'

export default function Element({item}: { item: number }): JSX.Element {
    return (
        <div
            style={{height: (198 / DEFAULT_ARRAY_SIZE) * item}}
            className='element'/>
    )
}

