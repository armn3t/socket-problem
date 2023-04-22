import { SocketConnection } from './socket-connection'
import { socketisAuthenticated } from '../middleware/socket.authenticated'

export default function socketWrapper(io) {
  io.use(socketisAuthenticated)

  io.on('connection', (socket) => {
    console.log('Socket COnnected', socket.id, io.of('/').sockets.size)
    
    new SocketConnection(io, socket)
  }) 
}
