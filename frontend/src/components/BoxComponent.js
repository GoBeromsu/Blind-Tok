import React from 'react';
import './BoxComponent.css';


const BoxComponent = ({ onClick, label }) => {
    return (
        <div className="ll">
            <div className="box">
                <label for="thirty">{label}</label>
            </div>
            <div className="box">
                <label for="thirty">{label}</label>
            </div>
            <div className="box">
                <label for="thirty">{label}</label>
            </div>
            <div className="box">
                <label for="thirty">{label}</label>
            </div>
            <div className="box">
                <label for="thirty">{label}</label>
            </div>
        </div>
    );
}


export default BoxComponent;