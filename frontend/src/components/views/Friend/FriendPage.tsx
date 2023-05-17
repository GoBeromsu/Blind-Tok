﻿import React, {useState, useEffect} from "react";
import {useParams, useLocation, useSearchParams, Link} from "react-router-dom";
import "../../style/FriendList.css";
import {getFriends, getFriend} from "@data/user/axios";

const FriendPage = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [W, setW] = useState(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
    setW(window.innerWidth < 850 ? window.innerWidth - 350 : 500);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const params = useParams();
  const movie = getFriend(parseInt(params.friendId));
  const movies = getFriends();

  const location = useLocation();
  //console.log(location);

  const [searchParams, setSearchParams] = useSearchParams();
  const detail = searchParams.get("detail");

  const handleClick = () => {
    setSearchParams({detail: detail === "true" ? false : true});
    console.log(detail);
  };

  return (
    <div>
      <h2>{movie.title}</h2>
      <p>감독 : {movie.director}</p>
      <p>카테고리 : {movie.category}</p>
      <button onClick={handleClick} type="button">
        자세히
      </button>
      {detail === "true" ? <p>{movie.detail}</p> : " "}
    </div>
  );
};

export default FriendPage;
