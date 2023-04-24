import { Socket, Server } from 'socket.io'
import Channel, { ChannelDocument } from '../models/channel.model'
import { UserDocument, UserRoles } from '../models/user.model'
import Message from '../models/message.model'

import socketUserMap from '../socket/socket-map'

export const channelHandler = (io: Server, socket: Socket) => {

  socket.on('one:channel:delete', async (channel: ChannelDocument) => {
    const user: UserDocument = socket.data.user

    // if (user.role !== UserRoles.Admin) {
    //   socket.emit('unauthorized', { message: 'User doesnt have proper permissions to delete a channel' })
    //   return
    // }

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
    io.to(channel.alias).emit('all:channel:joined', {
      alias,
      socketId: socket.id
    })
  })

  socket.on('one:channel:leave', (channel: ChannelDocument) => {
    socket.leave(channel.alias)
    io.to(channel.alias).emit('all:channel:left', {
      alias: channel.alias,
      socketId: socket.id
    })
  })

  // socket.on('all:channel:left', (channel: ChannelDocument) => {
  //   console.log('LEAVE channel', channel)
  //   socket.leave(channel.alias)
  //   io.to(channel.alias).emit('all:channel:left', {
  //     alias: channel.alias,
  //     socketId: socket.id
  //   })
  // })

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