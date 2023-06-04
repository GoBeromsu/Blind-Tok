import UserSession from "./UserSession";

export default class {
  private usersById: {[key: string]: UserSession} = {};
  // private userByName: {[key: string]: UserSession} = {};
  private usersBySocket: {[key: string]: string} = {};

  register(user: UserSession) {
    this.usersById[user.userid] = user;
    this.usersBySocket[user.socket.id] = user?.socket.id;
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

  getById(userId: string) {
    return this.usersById[userId];
  }
  getBySocket(socketId: string) {
    const userId = this.usersBySocket[socketId];
    return userId ? this.getById(userId) : undefined;
  }

  removeById(userId: string) {
    const userSession = this.usersById[userId];
    if (!userSession) return;
    delete this.usersById[userId];
    delete this.usersBySocket[userSession.socket.id];
  }

  getUsersByRoom(roomId: string): UserSession[] {
    const allUsers = Object.values(this.usersById);
    return allUsers.filter(user => user.roomlist.includes(roomId));
  }
}