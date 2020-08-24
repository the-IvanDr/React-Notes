import React from 'react';
import MainC from './components/MainC/MainC';
import './App.css';


export default class App extends React.Component {

    render() {
        return (
            <div>
                <div className='Center'>
                    <MainC />
                </div>
            </div>
        );
    }
}