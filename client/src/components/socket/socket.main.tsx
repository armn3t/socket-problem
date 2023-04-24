import React, { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

import { fetchStatistics } from '../../api/channel'

import {
  Channel,
  ChannelJoinedPayload,
  ChannelData,
  ChannelStatistics,
  ChatUsers,
  MessageReceivedPayload,
  UserJoinedChannelPayload,
  SocketUserPayload,
} from '../../types'

import Chat from '../channels/chat.component'
import SocketUsers from './socket.users.component'
import ChannelStatisticsComponent from '../channels/channel-statistics.component'

type Props = {
  channels: Channel[],
  user: any,
  socket: Socket,
  onChannelDelete: (channel: Channel) => void
}

const joinedChannelsMap = new Map<string, ChannelData>()

const SocketMain = ({ channels, user, socket, onChannelDelete }: Props) => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [selectedChannelData, setSelectedChannelData] = useState<ChannelData | null>(null)
  const [socketUsers, setSocketUsers] = useState<Map<string, Partial<SocketUserPayload>>>(new Map())
  const [isConnected, setIsConnected] = useState(false)
  const [channelStatistics, setChannelStatistics] = useState<ChannelStatistics | null>(null)

  const handleChannelChange = async (channel: Channel) => {
    setSelectedChannel(channel)

    if (joinedChannelsMap.has(channel.alias)) 
      setSelectedChannelData(joinedChannelsMap.get(channel.alias) || null)
    else socket.emit('one:channel:join', channel)

    const { messages, messageCount } = await fetchStatistics(channel)
    setChannelStatistics({ messages, messageCount })
  }

  const handleChannelLeaving = (channel: Channel) => {
    if (selectedChannel?.alias === channel.alias) {
      setSelectedChannel(null)
      setSelectedChannelData(null)
    }
    joinedChannelsMap.delete(channel.alias)
    socket.emit('one:channel:leave', channel)
  }

  const handleChannelDelete = (channel: Channel) => {
    console.log(channel, 'CHANNEL DELETE')
    socket.emit('one:channel:delete', channel)
  }

  const handleNewMessage = (message: string) => {
    if (!selectedChannel) return // should not happen
    console.log('HANDLE NEW MESSAGE', selectedChannel, message, user, user.id)

    socket.emit('one:channel:message:sent', {
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
      const newMap = new Map(socketUsers)
      newMap.set(user.socketId, { userId: user.userId, username: user.username })
      setSocketUsers(newMap)
      // console.log(socketUsers)
    }
    function onUserLeft(socketId: string) {
      console.log('USER LEFT')
      const newMap = new Map(socketUsers)
      newMap.delete(socketId)
      setSocketUsers(newMap)
      // console.log(socketUsers)
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
      console.log(alias, socketId, 'EXTERNAL LEFT', joinedChannelsMap.get(alias))
      // TODO: implement functionality to be able to leave channel
      const channelData = joinedChannelsMap.get(alias)
      if (!channelData) return console.log('Something is wrong')
      channelData.channelUsers.delete(socketId)
      joinedChannelsMap.set(alias, channelData)
      console.log('LEFT CHANNEL DATA')
      if (selectedChannel?.alias === alias) setSelectedChannelData({
        ...channelData,
        channelUsers: new Set(channelData.channelUsers)
      })
    }

    function onChannelDeleted(channel: Channel) {
      if (selectedChannel?.alias === channel.alias) {
        setSelectedChannel(null)
        setSelectedChannelData(null)
      }
      joinedChannelsMap.delete(channel.alias)
      onChannelDelete(channel)
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
    socket.on('all:user:joined', onUserJoined)
    socket.on('all:user:left', onUserLeft)
    socket.on('one:user:list', onUserListReceived)
    socket.on('one:channel:joined', onChannelJoined)
    socket.on('all:channel:joined', onChannelUserJoined)
    socket.on('all:channel:left', onChannelUserLeft)
    socket.on('all:channel:deleted', onChannelDeleted)
    socket.on('all:channel:message:received', onChannelMessageReceived)


    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('all:user:joined', onUserJoined)
      socket.off('all:user:left', onUserLeft)
      socket.off('one:user:list', onUserListReceived)
      socket.off('one:channel:joined', onChannelJoined)
      socket.off('all:channel:joined', onChannelUserJoined)
      socket.off('all:channel:left', onChannelUserLeft)
      socket.off('all:channel:deleted', onChannelDeleted)
      socket.off('all:channel:message:received', onChannelMessageReceived)
    }
  }, [socket, selectedChannel, socketUsers, setSocketUsers, onChannelDelete])

  return (
    <div>
      {/* Socket is {isConnected ? 'connected' : 'disconnected'} */}
      <div>
      <ChannelStatisticsComponent channel={selectedChannel} statistics={channelStatistics}/>
      </div>
      <div>
        {/* <div>{selectedChannel && `${selectedChannel.alias} - ${selectedChannel._id}`} </div> */}
        <Chat channels={channels}
          selectedChannel={selectedChannel}
          selectedChannelData={selectedChannelData}
          onNewMessage={handleNewMessage}
          onChannelChange={handleChannelChange}
          onChannelDelete={handleChannelDelete}
          onChannelLeaving={handleChannelLeaving}
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
