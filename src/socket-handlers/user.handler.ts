import socketUserMap from '../socket/socket-map'

export const userHandler = (io, socket) => {
  const user = socket.data.user
  const userPayload = { socketId: socket.id, ...user }

  io.emit('user:joined', userPayload)

  socket.emit('user:list', { users: socketUserMap.getUsers() })

  socket.on('disconnect', () => {
    socketUserMap.remove(socket.id)
    io.emit('user:left', socket.id)
  })
}
