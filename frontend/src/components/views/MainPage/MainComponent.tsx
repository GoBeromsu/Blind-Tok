import React, {useState, useEffect} from "react";
import AudioPlayer from "./AudioPlayer";
import "../../style/MainComponent.css";
import {getUserListQuery /*{UserListQueryData}*/} from "@data/user/query";

const MainComponent: React.FC = () => {
  const [components, setComponents] = useState<JSX.Element[]>([]);
  const [allLoaded, setAllLoaded] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const {isLoading, isError, data, error} = getUserListQuery();


  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  useEffect(() => {
    const handleScroll = debounce(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const threshold = 800;

      if (isLoading || allLoaded) return;

      if (scrollTop >= threshold) {
        setComponents(prevComponents => [
          ...prevComponents,
          <AudioPlayer src="" type="" key={prevComponents.length} />,
          <AudioPlayer src="" type="" key={prevComponents.length + 1} />,
          <AudioPlayer src="" type="" key={prevComponents.length + 2} />,
          <AudioPlayer src="" type="" key={prevComponents.length + 3} />,
          <AudioPlayer src="" type="" key={prevComponents.length + 4} />,
        ]);
      }
    }, 50);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, allLoaded]);

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
