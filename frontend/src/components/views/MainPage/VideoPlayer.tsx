import React from "react";

interface Props {
  src: string;
  type: string;
  width: number;
  height: number;
}

const VideoPlayer: React.FC<Props> = ({src, type, width, height}) => {
  return (
    <video width={width} height={height} controls>
      <source src={src} type={type} />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
