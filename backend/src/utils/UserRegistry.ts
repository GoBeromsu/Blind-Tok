interface User {
  id: string;
  name: string;
  room?: string;
}

class UserRegistry {
  private usersById: {[id: string]: User};
  private usersByName: {[name: string]: User};

  constructor() {
    this.usersById = {};
    this.usersByName = {};
  }

  register(user: User) {
    this.usersById[user.id] = user;
    this.usersByName[user.name] = user;
  }

  unregister(id: string) {
    const user = this.getById(id);
    if (user) {
      delete this.usersById[id];
      if (this.getByName(user.name)) {
        delete this.usersByName[user.name];
      }
    }
  }

  getById(id: string): User | undefined {
    return this.usersById[id];
  }

  getByName(name: string): User | undefined {
    return this.usersByName[name];
  }

  removeById(id: string) {
    const userSession = this.usersById[id];
    if (!userSession) {
      return;
    }
    delete this.usersById[id];
    delete this.usersByName[userSession.name];
  }

  getUsersByRoom(room: string): User[] {
    const usersInRoomList: User[] = [];
    for (const name in this.usersByName) {
      if (this.usersByName.hasOwnProperty(name) && this.usersByName[name].room === room) {
        usersInRoomList.push(this.usersByName[name]);
      }
    }
    return usersInRoomList;
  }
}

export default UserRegistry;
