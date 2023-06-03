import React, {useEffect, useState} from "react";
import "../../style/AudioPlayer.css";
import ReactPlayer from "react-player";
interface Props {
  src: any;
}

const AudioPlayer: React.FC<Props> = ({src}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  return (
    <div className="audio-panel" style={{width: `${windowWidth - 332}px`}}>
      <div className="audio-player">
        <ReactPlayer
          url={src}
          type="audio/mpeg"
          loop={true}
          muted={false}
          controls
          style={{
            paddingRight: "100px",
            width: "100%",
            maxWidth: "500px",
            height: "auto",
            margin: "0 auto",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
