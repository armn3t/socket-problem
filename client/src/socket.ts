import { SERVER_URL } from './api/url';
import { io, Socket } from 'socket.io-client'

export const getSocket = (token: string | null): Socket | null => {
  if (!token) return null
  const socket = io(SERVER_URL, {
    auth: {
      token
    }
  })
  return socket
}

// export const socket = io(SERVER_URL, {
//   auth: {
//     token: localStorage.getItem('_auth')
//   }
// })
