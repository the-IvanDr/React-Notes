import React from 'react';
import './DeleteButton.css';

export default function DeleteButton(props){
    return (
        <button className='DeleteButton' onClick={props.onClick}>
            <i className="fa fa-times" aria-hidden="true" />
        </button>
    )
}