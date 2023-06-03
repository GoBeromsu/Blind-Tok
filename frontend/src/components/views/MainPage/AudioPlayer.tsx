import React, {useEffect, useState} from "react";
import "../../style/AudioPlayer.css";

interface Props {
  src: any;
  type: any;
}

const AudioPlayer: React.FC<Props> = ({src, type}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

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
