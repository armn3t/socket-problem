import socketUserMap from '../socket/socket-map'

import { decodeToken } from '../utils/token-utils'

const socketisAuthenticated = async (socket, next) => {
  const token = socket.handshake.auth.token
  
  if (!token) return next(new Error('Unauthorized'))

  const decoded = await decodeToken(token)
  if (!decoded || !decoded.username || !decoded.userId) throw new Error('Unauthorized')

  socket.data.user = decoded

  socketUserMap.setUser(socket.id, {
    username: decoded.username,
    userId: decoded.userId
  })
  next()
}

export {
  socketisAuthenticated
}
