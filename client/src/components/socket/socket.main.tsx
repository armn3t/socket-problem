import React, { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

import { fetchStatistics } from '../../api/channel'

import {
  Message,
  Channel,
  ChannelJoinedPayload,
  ChannelData,
  ChannelStatistics,
  MessageReceivedPayload,
  UserJoinedChannelPayload,
  SocketUserPayload,
} from '../../types'

import Chat from '../channels/chat.component'
import SocketUsers from './socket.users.component'
import ChannelStatisticsComponent from '../channels/channel-statistics.component'
import { promiseModal } from '../channel.auth.modal'

type Props = {
  channels: Channel[],
  user: any,
  socket: Socket,
  onChannelDelete: (channel: Channel) => void
}


const SocketMain = ({ channels, user, socket, onChannelDelete }: Props) => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [selectedChannelData, setSelectedChannelData] = useState<ChannelData | null>(null)
  const [socketUsers, setSocketUsers] = useState<Map<string, Partial<SocketUserPayload>>>(new Map())
  const [joinedChannelsMap, setJoinedChannelsMap] = useState(new Map<string, ChannelData>())
  const [isConnected, setIsConnected] = useState(false)
  const [channelStatistics, setChannelStatistics] = useState<ChannelStatistics | null>(null)

  const resetSelectedChannel = () => {
    setSelectedChannel(null)
    setSelectedChannelData(null)
    setChannelStatistics(null)
  }
  
  const handleChannelChange = async (channel: Channel) => {
    if (joinedChannelsMap.has(channel.alias)) {
      setSelectedChannel(channel)
      setSelectedChannelData(joinedChannelsMap.get(channel.alias) || null)
    } 
    else {
      if (channel.protected) {
        const password = await promiseModal()
        socket.emit('one:channel:join', { channel, password })
      } else {
        socket.emit('one:channel:join', { channel })
      }
    }
  }

  const handleStatisticsRefresh = async () => {
    if (!selectedChannel) return console.log('throw')

    const { messages, messageCount } = await fetchStatistics(selectedChannel)
    setChannelStatistics({ messages, messageCount })
  }

  const handleChannelLeaving = (channel: Channel) => {
    if (selectedChannel?.alias === channel.alias) {
      resetSelectedChannel()
    }
    const newChannelsMap = new Map(joinedChannelsMap)
    newChannelsMap.delete(channel.alias)
    setJoinedChannelsMap(newChannelsMap)
    socket.emit('one:channel:leave', channel)
  }

  const handleChannelDelete = (channel: Channel) => {
    socket.emit('one:channel:delete', channel)
  }

  const handleNewMessage = (message: string) => {
    if (!selectedChannel) return // should not happen

    socket.emit('one:channel:message:sent', {
      alias: selectedChannel.alias,
      channelId: selectedChannel._id, 
      userId: user.id,
      message
    })
  }

  const handleMessageDelete = async (message: Message, alias: string) => {
    socket.emit('one:channel:message:delete', { alias, message })
  }

  const handleUserRemove = async (socketId: string, alias: string) => {
    socket.emit('one:channel:user:remove', { socketId, alias })
  }

  useEffect(() => {

    function onConnect() { setIsConnected(true) }
    function onDisconnect() { setIsConnected(false) }
    function onUserJoined(user: SocketUserPayload) {
      const newMap = new Map(socketUsers)
      newMap.set(user.socketId, { userId: user.userId, username: user.username })
      setSocketUsers(newMap)
    }
    function onUserLeft(socketId: string) {
      const newMap = new Map(socketUsers)
      newMap.delete(socketId)
      setSocketUsers(newMap)
    }
    function onUserListReceived(payload: any) {
      setSocketUsers(new Map(payload.users))
    }

    async function onChannelJoined(payload: ChannelJoinedPayload) {
      const { channel, messages, channelUsers } = payload

      const channelData = { messages, channelUsers: new Set(channelUsers) }

      const newChannelsMap = new Map(joinedChannelsMap)
      newChannelsMap.set(channel.alias, channelData)
      setJoinedChannelsMap(newChannelsMap)
      setSelectedChannel(channel)
      setSelectedChannelData(channelData)

      const { messages: statisticsMessages, messageCount } = await fetchStatistics(channel)
      setChannelStatistics({ messages: statisticsMessages, messageCount })
    }

    function onChannelRemoved({ alias }: { alias: string }) {
      if (selectedChannel?.alias === alias) {
        setSelectedChannel(null)
        setSelectedChannelData(null)
        setChannelStatistics(null)
      }

      const newChannelsMap = new Map(joinedChannelsMap)
      newChannelsMap.delete(alias)
    }

    function onChannelUserJoined({ alias, socketId }: UserJoinedChannelPayload) {
      const channelData = joinedChannelsMap.get(alias)
      console.log(channelData, 'CHANNELDATA', joinedChannelsMap)
      if (!channelData) return console.error('Something is wrong when user is attempting to join channel, throw')
      
      const newChannelData = { ...channelData }
      newChannelData.channelUsers.add(socketId)

      const newChannelsMap = new Map(joinedChannelsMap)
      newChannelsMap.set(alias, newChannelData)
      setJoinedChannelsMap(newChannelsMap)

      if (selectedChannel?.alias === alias) setSelectedChannelData(newChannelData)
    }

    function onChannelUserLeft({ alias, socketId }: UserJoinedChannelPayload) {
      const channelData = joinedChannelsMap.get(alias)
      if (!channelData) return console.error('Something is wrong when user is attempting to leave channel, throw')
      
      const newChannelData = { ...channelData }

      newChannelData.channelUsers.delete(socketId)

      const newChannelsMap = new Map(joinedChannelsMap)
      newChannelsMap.set(alias, newChannelData)
      setJoinedChannelsMap(newChannelsMap)
      
      if (selectedChannel?.alias === alias) setSelectedChannelData(newChannelData)
    }

    function onChannelDeleted(channel: Channel) {
      if (selectedChannel?.alias === channel.alias) {
        setSelectedChannel(null)
        setSelectedChannelData(null)
      }

      const newChannelsMap = new Map(joinedChannelsMap)
      newChannelsMap.delete(channel.alias)
      setJoinedChannelsMap(newChannelsMap)
      
      onChannelDelete(channel)
    }

    function onChannelMessageDeleted({ message, alias }: MessageReceivedPayload) {
      const channelData = joinedChannelsMap.get(alias)
      if (!channelData) return

      const newChannelData = {
        ...channelData,
        messages: channelData.messages.filter((oneMessage: Message) => oneMessage._id !== message._id)
      }

      const newChannelsMap = new Map(joinedChannelsMap)
      newChannelsMap.set(alias, newChannelData)
      setJoinedChannelsMap(newChannelsMap)
      

      if (selectedChannel?.alias === alias) setSelectedChannelData(newChannelData)
    }

    function onChannelMessageReceived({ message, alias }: MessageReceivedPayload) {
      const channelData = joinedChannelsMap.get(alias)
      if (!channelData) return

      const newChannelData = { ...channelData, messages: [ ...channelData.messages, message ] }
      
      const newChannelsMap = new Map(joinedChannelsMap)
      newChannelsMap.set(alias, newChannelData)
      setJoinedChannelsMap(newChannelsMap)

      if (selectedChannel?.alias === alias) setSelectedChannelData(newChannelData)
    }

    function onUnauthorized({ message }: { message: string }) {
      alert(message)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('all:user:joined', onUserJoined)
    socket.on('all:user:left', onUserLeft)
    socket.on('one:user:list', onUserListReceived)
    socket.on('one:channel:joined', onChannelJoined)
    socket.on('one:channel:removed', onChannelRemoved)
    socket.on('all:channel:user:joined', onChannelUserJoined)
    socket.on('all:channel:user:left', onChannelUserLeft)
    socket.on('all:channel:deleted', onChannelDeleted)
    socket.on('all:channel:message:received', onChannelMessageReceived)
    socket.on('all:channel:message:deleted', onChannelMessageDeleted)
    socket.on('unauthorized', onUnauthorized)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('all:user:joined', onUserJoined)
      socket.off('all:user:left', onUserLeft)
      socket.off('one:user:list', onUserListReceived)
      socket.off('one:channel:joined', onChannelJoined)
      socket.off('one:channel:removed', onChannelRemoved)
      socket.off('all:channel:user:joined', onChannelUserJoined)
      socket.off('all:channel:user:left', onChannelUserLeft)
      socket.off('all:channel:deleted', onChannelDeleted)
      socket.off('all:channel:message:received', onChannelMessageReceived)
      socket.off('all:channel:message:deleted', onChannelMessageDeleted)
      socket.off('unauthorized', onUnauthorized)
    }
  }, [socket, selectedChannel, socketUsers, setSocketUsers, onChannelDelete, joinedChannelsMap])

  if (!isConnected) return (
    <div> NOT CONNECTED TO SERVER </div>
  )

  return (
    <div>
      <div>
      <ChannelStatisticsComponent channel={selectedChannel} statistics={channelStatistics}
        onStatisticsRefresh={handleStatisticsRefresh}/>
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
          onMessageDelete={handleMessageDelete}
          onUserRemove={handleUserRemove}
          users={socketUsers}
          joinedChannelsMap={joinedChannelsMap}
          />
      </div>
      <div>
        {socketUsers && <SocketUsers users={socketUsers}/>}
      </div>
    </div>
  )
}

export default SocketMain
