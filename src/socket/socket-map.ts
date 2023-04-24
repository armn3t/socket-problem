
type UserRecord = {
  userId: string,
  username: string
}

class SocketUserMap {
  socketUsers = new Map<string, UserRecord>
  usernames = new Set<string>

  setUser(socketId: string, user: { username: string, userId: string }) {
    // if (this.usernames.has(user.username)) return
    this.socketUsers.set(socketId, { userId: user.userId, username: user.username })
    // this.usernames.add(user.username)
  }

  remove(socketId: string, username: string) {
    // this.usernames.delete(username)
    this.socketUsers.delete(socketId)
  }

  getUsers() {
    return [...this.socketUsers]
  }
}

export default new SocketUserMap
