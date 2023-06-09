import React, {useState, useEffect, useRef} from "react";
import AudioPlayer from "./AudioPlayer";
import "../../style/MainComponent.css";
import {getUserListQuery /*{UserListQueryData}*/} from "@data/user/query";
import {getFileMetaList, getFileData} from "@data/upload/axios";
import {userState, sideState, SearchState} from "@data/user/state";
import {useRecoilState, useRecoilValue} from "recoil";

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
  const [audioURL, setAudioURL] = useState<any[]>([]);
  const [audioOwn, setAudioOwn] = useState<any[]>([]);
  const [audioTitles, setAudioTitles] = useState<any[]>([]);
  const sidebarOpen: any = useRecoilValue(sideState);
  const [search, setSearch]: any = useRecoilState(SearchState);
  const [fileNameList, setFileNameList]: any = useState<any[]>([]);
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

  useEffect(() => {
    console.log("searchAudio changed:", search);
  }, [search]);

  const fetchAudioList = async () => {
    if (loginUser) {
      try {
        const audioFiles = await getFileMetaList(loginUser.userid);
        const audioMetaData = audioFiles.data;
        console.log(audioMetaData[0].userid);
        if (Array.isArray(audioMetaData) && audioMetaData.length > 0) {
          setAudioList(audioMetaData);
          const audioURLs: any[] = [];
          const audioOwns: any[] = [];
          const audioNames: any[] = [];
          for (let i = 0; i < audioMetaData.length; i++) {
            const getData = await getFileData(audioMetaData[i].fileid);
            const getFileName = audioMetaData[i].filename;
            // console.log(search);
            // if (!getFileName.find(search)) continue;
            const fileName = getFileName.split(".mp3")[0];
            const dataURL = URL.createObjectURL(getData.data);
            const userId = audioMetaData[i].userid;
            audioNames.push(fileName);
            audioURLs.push(dataURL);
            audioOwns.push(userId);
          }
          setAudioTitles(audioNames);
          setAudioURL(audioURLs);
          setAudioOwn(audioOwns);
        }
      } catch (error) {
        console.error("오디오 파일을 가져오는 데 실패했습니다:", error);
      }
    }
  };

  useEffect(() => {
    if (audioURL.length > 0) {
      const initialComponents: JSX.Element[] = [];
      const componentCount = Math.min(audioURL.length, 4);
      // 처음 페이지에 접속했을 때는 첫 음악을 재생시킴
      for (let i = 0; i < componentCount; i++) {
        initialComponents.push(<AudioPlayer src={audioURL[i]} key={i} autoPlay={i === 0} own={audioOwn[i]} title={audioTitles[i]} />);
      }
      setComponents(initialComponents);
    }
  }, [audioURL]);

  useEffect(() => {
    const handleScroll = debounce(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const threshold = 800;

      if (isLoading || allLoaded) return;

      // 스크롤링 될때마다 컴포넌트 추가하는 식 (중복제외)
      if (scrollTop >= threshold) {
        const newComponents: JSX.Element[] = [];
        const remainingComponents = Math.min(audioURL.length - components.length, 4);
        for (let i = 0; i < remainingComponents; i++) {
          const nextIndex = (components.length + i) % audioURL.length;
          const isDuplicate = components.some(component => component.key === nextIndex);
          if (!isDuplicate) {
            newComponents.push(
              <AudioPlayer src={audioURL[nextIndex]} key={nextIndex} autoPlay={false} own={audioOwn[nextIndex]} title={audioTitles[nextIndex]} />,
            );
          }
        }
        setComponents(prevComponents => [...prevComponents, ...newComponents]);
      }
    }, 50);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, allLoaded, audioURL, components]);

  return (
    <div className="maincomponent" style={sidebarOpen ? {width: `${windowWidth - 200}px`, paddingLeft: "300px"} : {width: `${windowWidth - 200}px`}}>
      {components}
    </div>
  );
};

export default MainComponent;
