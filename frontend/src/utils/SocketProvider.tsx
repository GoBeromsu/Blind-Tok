import {useEffect} from "react";
import {useRecoilState} from "recoil";
import {socketState} from "@data/chat/state";
import {io, Socket} from "socket.io-client";
import {SOCKET_URL} from "../consonants";

const SocketProvider = () => {
  const [socket, setSocket] = useRecoilState(socketState);

  useEffect(() => {
    const createSocket = async () => {
      if (!socket) {
        try {
          // 소켓이 없는 경우에만 소켓을 생성하고 설정합니다.
          const newSocket: Socket = io(SOCKET_URL);
          setSocket(newSocket);
        } catch (error) {
          console.error("Error creating socket:", error);
          setSocket(null);
        }
      }
    };

    createSocket();
  }, [socket, setSocket]);

  return null;
};

export default SocketProvider;
