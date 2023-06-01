import React from 'react'
import './Utils.css'

//component to wrap flex row
export function Row(props) {

    // if props.className is set, append flex-row to it
    // otherwise, set className to flex-row
    const className = props.className ? props.className + ' flex-row' : 'flex-row'

    return <div
        {...props}
        className={className}>
        {props.children}
    </div>
}

//component to wrap flex column
export function Column(props) {
    return <div
        {...props}
        className="flex-column">
        {props.children}
    </div>
}