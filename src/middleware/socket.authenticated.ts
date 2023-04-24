import { Socket } from 'socket.io'

import { decodeToken } from '../utils/token-utils'

const socketisAuthenticated = async (socket: Socket, next: Function) => {
  const token = socket.handshake.auth.token
  if (!token) return next(new Error('Unauthorized'))

  const decoded = await decodeToken(token)
  if (!decoded || !decoded.username || !decoded.userId) throw new Error('Unauthorized')

  socket.data.user = decoded
  next()
}

export {
  socketisAuthenticated
}
