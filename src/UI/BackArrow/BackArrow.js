import React from 'react';
import './BackArrow.css';

export default function BackArrow(props){
    return (
        <button className='BackArrow' onClick={props.onClick}>
            <i className="fa fa-chevron-left" aria-hidden="true" />
        </button>
    )
}