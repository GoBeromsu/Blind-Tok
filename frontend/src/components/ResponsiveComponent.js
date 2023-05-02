import React, { useEffect, useState } from 'react';
import './ResponsiveImage.css';

const ResponsiveImage = ({ src, alt }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <img className="responsive-image" src={src} alt={alt} style={{ width: `${windowWidth}px` }} />;
};

export default ResponsiveImage;