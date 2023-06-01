import React from "react";
import "../../style/CircularImage.css";

interface CircularImageProps {
  src: string;
  alt: string;
  size: string;
}

const CircularImage: React.FC<CircularImageProps> = ({src, alt, size}) => {
  return <img className="circular-image" src={src} alt={alt} width={size} height={size} style={{ marginLeft: "40px" }}/>;
};

export default CircularImage;
