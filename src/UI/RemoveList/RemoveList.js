import React from 'react';
import './RemoveList.css';

export default function RemoveList(props) {
    return (
        <button className='RemoveList' onClick={props.onClick}>
            <i className="fa fa-trash" aria-hidden="true" />
        </button>
    )
}