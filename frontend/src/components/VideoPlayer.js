import React from 'react';

const VideoPlayer = ({ src, type, width, height }) => {
    return (
        <video width={width} height={height} controls>
            <source src={src} type={type} />
      Your browser does not support the video tag.
        </video>
    );
};

export default VideoPlayer;
