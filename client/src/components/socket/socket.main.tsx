import React, { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

import {
  Channel,
  ChannelJoinedPayload,
  ChannelData,
  ChatUsers,
  MessageReceivedPayload,
  UserJoinedChannelPayload,
  SocketUserPayload,
} from '../../types'

import Chat from '../channels/chat.component'
import SocketUsers from './socket.users.component'

type Props = {
  channels: Channel[],
  user: any,
  socket: Socket
}

const joinedChannelsMap = new Map<string, ChannelData>()

const SocketMain = ({ channels, user, socket }: Props) => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [selectedChannelData, setSelectedChannelData] = useState<ChannelData | null>(null)
  const [socketUsers, setSocketUsers] = useState<Map<string, Partial<SocketUserPayload>>>(new Map())
  const [isConnected, setIsConnected] = useState(false)

  const handleChannelChange = (channel: Channel) => {
    setSelectedChannel(channel)

    if (joinedChannelsMap.has(channel.alias)) 
      setSelectedChannelData(joinedChannelsMap.get(channel.alias) || null)
    else socket.emit('channel:join', channel)
  }

  const handleNewMessage = (message: string) => {
    if (!selectedChannel) return // should not happen
    console.log('HANDLE NEW MESSAGE', selectedChannel, message, user, user.id)

    socket.emit('channel:message:sent', {
      alias: selectedChannel.alias,
      channelId: selectedChannel._id, 
      userId: user.id,
      message
    })
  }

  useEffect(() => {

    function onConnect() { setIsConnected(true) }
    function onDisconnect() { setIsConnected(false) }
    function onUserJoined(user: SocketUserPayload) {
      console.log('USER JOINED', user)
      setSocketUsers(new Map(
        socketUsers.set(user.socketId, { userId: user.userId, username: user.username }))
      )
      console.log(socketUsers)
    }
    function onUserLeft(socketId: string) {
      console.log('USER LEFT')
      socketUsers.delete(socketId)
      setSocketUsers(new Map(socketUsers))
      console.log(socketUsers)
    }
    function onUserListReceived(payload: any) {
      console.log('RECEIVED USER LIST', payload)
      setSocketUsers(new Map(payload.users))
    }

    function onChannelJoined(payload: ChannelJoinedPayload) {
      const { channel, messages, channelUsers } = payload
      joinedChannelsMap.set(channel.alias, { messages, channelUsers: new Set(channelUsers) })
      setSelectedChannelData(joinedChannelsMap.get(channel.alias) || null)
    }

    function onChannelUserJoined({ alias, socketId }: UserJoinedChannelPayload) {
      const channelData = joinedChannelsMap.get(alias)
      if (!channelData) return console.log('Something is wrong')
      console.log(alias, socketId, 'EXTERNAL JOINED', joinedChannelsMap.get(alias))
      joinedChannelsMap.set(alias, {
        ...channelData,
        channelUsers: new Set([ ...channelData.channelUsers, socketId ])
      })
      if (selectedChannel?.alias === alias) setSelectedChannelData(joinedChannelsMap.get(alias) || null)
    }

    function onChannelUserLeft({ alias, socketId }: UserJoinedChannelPayload) {
      // TODO: implement functionality to be able to leave channel
      const channelData = joinedChannelsMap.get(alias)
      if (!channelData) return console.log('Something is wrong')
      console.log(alias, socketId, 'EXTERNAL LEFT', joinedChannelsMap.get(alias))
      channelData.channelUsers.delete(socketId)
      joinedChannelsMap.set(alias, channelData)
      if (selectedChannel?.alias === alias) setSelectedChannelData(joinedChannelsMap.get(alias) || null)
    }

    function onChannelMessageReceived({ message, alias }: MessageReceivedPayload) {
      const channelData = joinedChannelsMap.get(alias)

      if (!channelData) {
        return
      }

      const newChannelData = { ...channelData, messages: [ ...channelData.messages, message ] }
      joinedChannelsMap.set(alias, newChannelData)

      if (selectedChannel?.alias === alias) setSelectedChannelData(newChannelData)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('user:joined', onUserJoined)
    socket.on('user:left', onUserLeft)
    socket.on('user:list', onUserListReceived)
    socket.on('channel:joined', onChannelJoined)
    socket.on('channel:user:joined', onChannelUserJoined)
    socket.on('channel:user:left', onChannelUserLeft)
    socket.on('channel:message:received', onChannelMessageReceived)


    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('user:joined', onUserJoined)
      socket.off('user:left', onUserLeft)
      socket.off('user:list', onUserListReceived)
      socket.off('channel:joined', onChannelJoined)
      socket.off('channel:user:left', onChannelUserLeft)
      socket.off('channel:user:joined', onChannelUserJoined)
      socket.off('channel:message:received', onChannelMessageReceived)
    }
  }, [selectedChannel, socketUsers, setSocketUsers])

  return (
    <div>
      Socket is {isConnected ? 'connected' : 'disconnected'}
      <div>
        <div>{selectedChannel && `${selectedChannel.alias} - ${selectedChannel._id}`} </div>
        <Chat channels={channels}
          selectedChannel={selectedChannel}
          selectedChannelData={selectedChannelData}
          onNewMessage={handleNewMessage}
          onChannelChange={handleChannelChange}
          users={socketUsers}
          />
      </div>
      <div>
        {socketUsers && <SocketUsers users={socketUsers}/>}
      </div>
    </div>
  )
}

export default SocketMain
