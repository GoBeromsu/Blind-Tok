import React, {useEffect, useState, useRef} from "react";
import "../../style/AudioPlayer.css";
import ReactPlayer from "react-player";
import {Modal, Backdrop, Fade} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

interface Props {
  src: any;
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
    width: "50%", // 모달 너비
    height: "70%", // 모달 높이
    overflowY: "auto", // 필요시 스크롤 생성
    borderRadius: "10px", // 모달 모서리 둥글게
    [theme.breakpoints.down("xs")]: {
      // 모바일 화면 대응
      width: "80%",
      height: "80%",
    },
  },
}));

const AudioPlayer: React.FC<Props> = ({src, autoPlay}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const classes = useStyles(); // 스타일 사용

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
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      modalRef.current?.focus?.();
    }
  }, [isModalOpen]);

  return (
    <div className="audio-panel" style={{width: `${windowWidth - 332}px`}}>
      <div className="audio-player" onClick={handlePlayerClick}>
        <ReactPlayer
          url={src}
          playing={autoPlay}
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
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        className={classes.modal} // 모달 스타일 적용
        BackdropProps={{
          timeout: 500,
        }}>
        <Fade in={isModalOpen}>
          <div className={classes.paper} ref={modalRef} tabIndex={-1}>
            {/* 여기에 원하는 모달 내용을 추가하세요 */}
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default AudioPlayer;
