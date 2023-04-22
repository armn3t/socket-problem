
type UserRecord = {
  userId: string,
  username: string
}

class SocketUserMap {
  socketUsers = new Map<string, UserRecord>

  setUser(socketId: string, user: { username: string, userId: string }) {
    this.socketUsers.set(socketId, { userId: user.userId, username: user.username })
  }

  remove(socketId: string) {
    this.socketUsers.delete(socketId)
  }

  getUsers() {
    return [...this.socketUsers]
  }
}

export default new SocketUserMap
