import React, {useEffect, useState} from "react";
import "../../style/AudioPlayer.css";

const AudioPlayer = ({src, type}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="audio-panel" style={{width: `${windowWidth - 332}px`}}>
      <div className="audio-player">
        <audio controls>
          <source src={src} type={type} />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

export default AudioPlayer;
