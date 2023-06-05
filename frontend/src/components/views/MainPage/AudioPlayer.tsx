import React, {useEffect, useState, useRef} from "react";
import "../../style/AudioPlayer.css";
import ReactPlayer from "react-player";
import {Modal, Backdrop, Fade} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import UserModal from "./UserModal";

interface Props {
  src: string;
  own: any;
  autoPlay: boolean;
}

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "50%",
    height: "70%",
    overflowY: "auto",
    borderRadius: "10px",
    [theme.breakpoints.down("xs")]: {
      width: "80%",
      height: "80%",
    },
  },
}));

const AudioPlayer: React.FC<Props> = ({src, own, autoPlay}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const classes = useStyles();
  const [playerUrl, setPlayerUrl] = useState<string | null>(null);

  useEffect(() => {
    setPlayerUrl(src);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [src]);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };

  const handlePlayerClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      modalRef.current?.focus();
    }
  }, [isModalOpen]);

  return (
    <div className="audio-panel" style={{width: `${windowWidth - 332}px`}}>
      <div className="audio-player" onClick={handlePlayerClick}>
        {playerUrl && ( // 수정: playerUrl이 존재할 때에만 ReactPlayer 렌더링
          <ReactPlayer
            url={playerUrl}
            playing={autoPlay}
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
        )}
      </div>
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        className={classes.modal}
        BackdropProps={{
          timeout: 500,
        }}>
        <Fade in={isModalOpen}>
          <div className={classes.paper} ref={modalRef} tabIndex={-1}>
            <UserModal own={own} />
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default AudioPlayer;
