import UserSession from "./UserSession";

export default class {
  private usersById: {[key: string]: UserSession} = {};
  // private userByName: {[key: string]: UserSession} = {};

  register(user: UserSession) {
    this.usersById[user.userid] = user;
    // this.userByName[user.name] = user;
  }

  unregister(userId: string) {
    const user = this.usersById[userId];
    if (user) {
      delete this.usersById[userId];
      // delete this.userByName[user.name];
    }
  }

  // getByName(name: string) {
  //   return this.userByName[name];
  // }

  getById(userId: string) {
    return this.usersById[userId];
  }

  removeById(userId: string) {
    const userSession = this.usersById[userId];
    if (!userSession) return;
    delete this.usersById[userId];
    // delete this.userByName[userSession.name];
  }

  getUsersByRoom(roomId: string): UserSession[] {
    const allUsers = Object.values(this.usersById);
    const usersInRoom = allUsers.filter(user => user.roomlist.includes(roomId));
    return usersInRoom;
  }
}
