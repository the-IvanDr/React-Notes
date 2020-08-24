import React from 'react';
import './SaveButton.css';

export default function SaveButton(props){
    return (
        <button className='SaveButton' onClick={props.onClick}>
            <i className="fa fa-file" aria-hidden="true" />
        </button>
    );
}