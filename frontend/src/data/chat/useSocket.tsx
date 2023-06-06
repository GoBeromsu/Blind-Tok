import React, {useEffect, useRef} from "react";
import {io, Socket} from "socket.io-client";
import {useRecoilValue} from "recoil";
import {userState} from "@data/user/state";
import {SOCKET_URL} from "../../consonants";
import {socket} from "@data/chat/index";

export const useSocket = () => {
  const socketRef = useRef<Socket>(socket);
  useEffect(() => {
    // Only create a new socket if one doesn't already exist
    if (!socketRef.current) {
      socketRef.current = socket; // Replace with your server URL
    }
    console.log("socketRef", socketRef.current.id);
    // console.log("socketRef", socketRef.current);
    // Clean up function to disconnect socket when component unmounts
    // return () => {
    //   socketRef.current?.disconnect();
    // };
  }, []); // Empty dependency array ensures this only runs once when the component mounts

  return socketRef.current;
};
