import React from 'react';
import './style/CircularImage.css';

const CircularImage = ({ src, alt, size }) => {
    return ( <
        img className = "circular-image"
        src = { src }
        alt = { alt }
        width = { size }
        height = { size }
        />
    );
};

export default CircularImage;