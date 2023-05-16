import React from "react";
import "../../style/CircularImage.css";

interface CircularImageProps {
  src: string;
  alt: string;
  size: number;
}

const CircularImage: React.FC<CircularImageProps> = ({src, alt, size}) => {
  return <img className="circular-image" src={src} alt={alt} width={size} height={size} />;
};

export default CircularImage;
