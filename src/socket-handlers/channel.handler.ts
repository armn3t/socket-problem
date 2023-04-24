import { Socket, RemoteSocket, Server } from 'socket.io'
import Channel, { ChannelDocument } from '../models/channel.model'
import { UserDocument } from '../models/user.model'
import Message from '../models/message.model'
import { isAdmin } from '../utils/user-utils'

import socketUserMap from '../socket/socket-map'

export const channelHandler = (io: Server, socket: Socket) => {

  socket.on('one:channel:delete', async (channel: ChannelDocument) => {
    const user: UserDocument = socket.data.user

    if (!isAdmin(user)) {
      socket.emit('unauthorized', { message: 'User doesnt have proper permissions to delete a channel' })
      return
    }

    const { alias } = channel
    await Message.find({ channel: channel._id }).deleteMany()
    await Channel.deleteOne({ _id: channel._id })
    console.log('CHANNEL DELETE', alias, user)

    io.in(channel.alias).socketsLeave(channel.alias)

    io.emit('all:channel:deleted', channel)
  })

  socket.on('one:channel:join', async (channel: ChannelDocument) => {
    const { alias } = channel
    console.log('Join channel', alias)

    const messages = await Message.find({ channel: channel._id })
      .sort({ createdAt: -1 })
      .populate('user').exec()

    socket.join(channel.alias)

    const channelUsers = (await io.in(channel.alias).fetchSockets()).map(socket => socket.id)
    console.log(channelUsers, 'CHANNEL USERS')

    socket.emit('one:channel:joined', { messages: messages.reverse(), channel, channelUsers })
    io.to(channel.alias).emit('all:channel:user:joined', {
      alias,
      socketId: socket.id
    })
  })

  socket.on('one:channel:leave', (channel: ChannelDocument) => {
    socket.leave(channel.alias)
    io.to(channel.alias).emit('all:channel:user:left', {
      alias: channel.alias,
      socketId: socket.id
    })
  })

  socket.on('one:channel:user:remove', async ({ socketId, alias }) => {
    const user: UserDocument = socket.data.user
    if (!isAdmin(user)) {
      socket.emit('unauthorized', { message: 'User doesnt have proper permissions to remove user from channel' })
      return
    }

    const userSockets = await io.in(alias).fetchSockets()
    const userSocket = userSockets.find((socket) => socket.id.toString() === socketId)

    if (!userSocket) {
      throw new Error('Invalid socket id received')
    }

    userSocket.leave(alias)
    userSocket.emit('one:channel:removed', { alias })
    io.to(alias).emit('all:channel:user:left', { alias, socketId })
  })

  socket.on('one:channel:message:delete', async ({ alias, message }) => {
    const { _id } = message
    await Message.deleteOne({ _id })
    io.to(alias).emit('all:channel:message:deleted', { alias, message })
  })

  socket.on('one:channel:message:sent', async ({ alias, channelId, userId, message }) => {
    const newMessage = new Message({
      content: message,
      user: userId,
      channel: channelId
    })

    await newMessage.save()
    await newMessage.populate('user')
    console.log('EMIT CHANNEL MESSAGE')
    io.to(alias).emit('all:channel:message:received', { message: newMessage, alias })
  })

}