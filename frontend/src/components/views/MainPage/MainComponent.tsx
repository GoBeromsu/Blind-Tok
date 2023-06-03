import React, {useState, useEffect, useRef} from "react";
import AudioPlayer from "./AudioPlayer";
import "../../style/MainComponent.css";
import {getUserListQuery /*{UserListQueryData}*/} from "@data/user/query";
import {getFileMetaList, getFileData} from "@data/upload/axios";
import {userState} from "@data/user/state";
import {useRecoilState} from "recoil";
import ReactPlayer from "react-player";

interface AudioFile {
  fileid: string;
  userid: string;
  filename: string;
  filepath: string;
  filetype: string;
}

const MainComponent: React.FC = () => {
  const [components, setComponents] = useState<JSX.Element[]>([]);
  const [allLoaded, setAllLoaded] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const {isLoading, isError, data, error} = getUserListQuery();
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [audioList, setAudioList] = useState<AudioFile[]>([]);
  const [loginUser, setLoginUser]: any = useRecoilState(userState);
  const [audioURL, setAudioURL] = useState<any>();

  const previousLoginUser = useRef(loginUser);
  useEffect(() => {
    if (loginUser !== previousLoginUser.current) {
      fetchAudioList();
      previousLoginUser.current = loginUser;
    }
  }, [loginUser]);

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };
  useEffect(() => {
    fetchAudioList();
  }, [loginUser]);

  const fetchAudioList = async () => {
    if (loginUser) {
      try {
        const audioFiles = await getFileMetaList(loginUser.userid);
        const audioMetaData = audioFiles.data;
        if (Array.isArray(audioMetaData) && audioMetaData.length > 0) {
          setAudioList(audioMetaData);
          const getData = await getFileData(audioMetaData[0].fileid);
          const dataURL = URL.createObjectURL(getData.data);
          setAudioURL(dataURL);
        }
      } catch (error) {
        console.error("오디오 파일을 가져오는 데 실패했습니다:", error);
      }
    }
  };

  // useEffect(() => {
  //   console.log("audioURL:", audioURL);
  // }, [audioURL]);

  useEffect(() => {
    const handleScroll = debounce(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const threshold = 800;

      if (isLoading || allLoaded) return;

      if (scrollTop >= threshold) {
        setComponents(prevComponents => [
          ...prevComponents,
          <AudioPlayer src={audioURL} type="audio/mpeg" key={prevComponents.length} />,
          <AudioPlayer src="" type="" key={prevComponents.length + 1} />,
          <AudioPlayer src="" type="" key={prevComponents.length + 2} />,
        ]);
      }
    }, 50);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, allLoaded]);

  return (
    <div className="maincomponent" style={{width: `${windowWidth - 200}px`, paddingLeft: "320px"}}>
      <ReactPlayer
        url={audioURL}
        type="audio/mpeg"
        playing
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
      <br />
      <br />
      <br />
      <AudioPlayer src="" type="" />
      <br />
      <br />
      <br />
      <AudioPlayer src="" type="" />
      <br />
      <br />
      <br />
      <AudioPlayer src="" type="" />
      {components}
    </div>
  );
};

export default MainComponent;
