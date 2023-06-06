import UserSession from "./UserSession";
import {ChatRoomData} from "./Consonants";

export default class {
  private usersById: {[key: string]: UserSession} = {};
  // private userByName: {[key: string]: UserSession} = {};
  private usersBySocket: {[key: string]: UserSession} = {};

  getAll() {
    return Object.values(this.usersById);
  }

  register(user: UserSession) {
    this.usersById[user.userid] = user;
    this.usersBySocket[user?.socket.id] = user;
    // this.userByName[user.name] = user;
  }

  unregister(userId: string) {
    const user = this.usersById[userId];
    if (user) {
      delete this.usersById[userId];
      delete this.usersBySocket[user.socket.id];
      // delete this.userByName[user.name];
    }
  }

  // getByName(name: string) {
  //   return this.userByName[name];
  // }
  updateSocket(userId: any, socket: any) {
    let userSession = this.usersById[userId];
    delete this.usersBySocket[userSession?.socket?.id];
    this.usersBySocket[socket.id] = userSession;
    userSession.socket = socket;
  }
  getById(userId: string) {
    return this.usersById[userId];
  }
  getBySocket(socketId: string) {
    const userSession = this.usersBySocket[socketId];
    // console.log("userSession : " + userSession);
    return userSession;
  }

  removeById(userId: string) {
    const userSession = this.usersById[userId];
    if (!userSession) return;
    delete this.usersById[userId];
    delete this.usersBySocket[userSession.socket.id];
  }
  getRoomList(userId: string) {
    const userSession = this.getById(userId);
    if (!userSession) return;
    return userSession?.roomlist;
  }
  setRoomList(userId: string, roomList: ChatRoomData[]) {
    const userSession = this.getById(userId);
    if (!userSession) return;
    userSession.roomlist = roomList;
  }
  getSocketById(userId: string) {
    const userSession = this.getById(userId);
    if (!userSession) return;
    return userSession.socket;
  }

  // getUsersByRoom(roomId: number): UserSession[] {
  //   const allUsers = Object.values(this.usersById);
  //   return allUsers.filter(user => user.roomlist.includes(roomId));
  // }
}
