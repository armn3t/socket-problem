import Channel, { ChannelDocument } from '../models/channel.model'
import Message from '../models/message.model'

import socketUserMap from '../socket/socket-map'

export const channelHandler = (io, socket) => {
  
  socket.on('channel:join', async (channel: ChannelDocument) => {
    const { alias } = channel
    console.log('Join channel', alias)

    // const channelDoc = await Channel.findById(channel._id)
    const messages = await Message.find({ channel: channel._id }).exec()

    socket.join(channel.alias)

    const channelUsers = (await io.in(channel.alias).fetchSockets()).map(socket => socket.id)
    console.log(channelUsers, 'CHANNEL USERS')

    socket.emit('channel:joined', { messages, channel, channelUsers })
    io.to(channel.alias).emit('channel:user:joined', {
      alias,
      socketId: socket.id
    })
  })

  socket.on('channel:left', (channel: ChannelDocument) => {
    console.log('LEAVE channel', channel)
    socket.leave(channel.alias)
    io.to(channel.alias).emit('channel:user:left', {
      alias: channel.alias,
      socketId: socket.id
    })
  })

  socket.on('channel:message:sent', async ({ alias, channelId, userId, message }) => {
    const newMessage = new Message({
      content: message,
      user: userId,
      channel: channelId
    })

    await newMessage.save()
    console.log('EMIT CHANNEL MESSAGE')
    io.to(alias).emit('channel:message:received', { message: newMessage, alias })
  })

}