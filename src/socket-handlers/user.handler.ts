import { Socket, Server } from 'socket.io'
import socketUserMap from '../socket/socket-map'

export const userHandler = (io: Server, socket: Socket) => {
  const user = socket.data.user
  const userPayload = { socketId: socket.id, ...user }

  io.emit('all:user:joined', userPayload)

  socket.emit('one:user:list', { users: socketUserMap.getUsers() })

  socket.on('disconnecting', () => {
    socket.rooms.forEach((roomId: string) => {
      if (roomId === socket.id) return
      
      socket.leave(roomId)
      io.to(roomId).emit('all:channel:user:left', { alias: roomId, socketId: socket.id })
    })
  })

  socket.on('disconnect', () => {
    socketUserMap.remove(socket.id)
    io.emit('all:user:left', socket.id)
  })
}
