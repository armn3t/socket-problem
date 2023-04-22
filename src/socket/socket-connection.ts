import { Server, Socket } from 'socket.io'

import { channelHandler } from '../socket-handlers/channel.handler'
import { userHandler } from '../socket-handlers/user.handler'

export class SocketConnection {
  constructor(
    private io: Server,
    private socket: Socket
  ) {
    this.attachHandlers()
  }

  attachHandlers() {
    userHandler(this.io, this.socket)
    channelHandler(this.io, this.socket)
  }
}