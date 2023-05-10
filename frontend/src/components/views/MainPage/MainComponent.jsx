import React, {useState, useEffect} from "react";
import AudioPlayer from "./AudioPlayer";
import "../../style/MainComponent.css";
import {getUserListQuery} from "../../../data/User/query";

const MainComponent = () => {
  const [components, setComponents] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const {isLoading, isError, data, error} = getUserListQuery();
  console.log(data);
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  useEffect(() => {
    const handleScroll = debounce(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const threshold = 800; // 원하는 스크롤 위치

      if (isLoading || allLoaded) return;

      if (scrollTop >= threshold) {
        // 스크롤이 원하는 위치에 도달하면 컴포넌트 추가
        setComponents(prevComponents => [
          ...prevComponents,
          <AudioPlayer src="" type="" key={prevComponents.length} />,
          <AudioPlayer src="" type="" key={prevComponents.length + 1} />,
          <AudioPlayer src="" type="" key={prevComponents.length + 2} />,
          <AudioPlayer src="" type="" key={prevComponents.length + 3} />,
          <AudioPlayer src="" type="" key={prevComponents.length + 4} />,
        ]);
        // 로딩 상태를 초기화하고 필요한 경우 모든 컴포넌트 로드 완료 상태를 설정합니다.
        /*setTimeout(() => {
                    setIsLoading(false);
                    if ( 조건) {
                        setAllLoaded(true);
                    }
                }, 300); // 컴포넌트 로드 시간을 적절하게 설정하세요. */
      }
    }, 50);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="maincomponent">
      <AudioPlayer src="" type="" />
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
