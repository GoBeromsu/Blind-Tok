import React, {useEffect, useState} from "react";
import "../../style/AudioPlayer.css";
import {getFileMetaList} from "@data/upload/axios";
import {useRecoilState} from "recoil";
import {userState} from "@data/user/state";

interface Props {
  src: any;
  type: any;
}

interface AudioFile {
  fileid: string;
  userid: string;
  filename: string;
  filepath: string;
  filetype: string;
}

const AudioPlayer: React.FC<Props> = ({src, type}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [audioList, setAudioList] = useState<AudioFile[]>([]);
  const [loginUser, setLoginUser]: any = useRecoilState(userState);

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

  useEffect(() => {
    fetchAudioList();
  }, [loginUser]);

  useEffect(() => {
    console.log("audioList의 내용:", audioList[0]);
  }, [audioList]);

  const fetchAudioList = async () => {
    if (loginUser) {
      try {
        const audioFiles = await getFileMetaList(loginUser.userid);
        const audioData = audioFiles.data;
        console.log("This is audioData", audioData[0]);
        if (Array.isArray(audioData) && audioData.length > 0) {
          setAudioList(audioData);
        }
      } catch (error) {
        console.error("오디오 파일을 가져오는 데 실패했습니다:", error);
      }
    }
  };

  return (
    <div className="audio-panel" style={{width: `${windowWidth - 332}px`}}>
      <div className="audio-player">
        <audio controls>
          {audioList.length > 0 ? (
            audioList.map(audioFile => (
              <source key={audioFile.fileid} src={`http://localhost:4000/${audioFile.filepath}/861.mp3`} type="audio/mpeg" />
            ))
          ) : (
            <source src={src} type={type} />
          )}
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

export default AudioPlayer;
