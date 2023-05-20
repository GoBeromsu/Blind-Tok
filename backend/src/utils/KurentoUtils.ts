import UserSession from "./UserSession";
import UserRegistry from "./UserRegistry";
import {Socket} from "socket.io";

const userRegistry = new UserRegistry();

//TODO: 샘플 코드 보면서 만들다 보니 일단 따라하는데, 유저 세션 정보는 분리해야함
function register(socket: Socket, name: string, callback: Function): void {
  const userSession = new UserSession(socket.id, socket);
  userSession.name = name;
  userRegistry.register(userSession);
  userSession.sendMessage({
    id: "registered",
    data: "Server : Successfully registered " + socket.id,
  });
}
