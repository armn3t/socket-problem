import React, { useEffect, useState, useCallback } from 'react'
import { useAuthUser, useAuthHeader } from 'react-auth-kit'
import { Socket, io } from 'socket.io-client'

import { SERVER_URL } from '../../api/api'

import { fetchChannels } from '../../api/channel'

import AddChannel from '../../components/channels/add-channel.component'
import SocketMain from '../../components/socket/socket.main'

import { Channel } from '../../types'

const Home = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [channels, setChannels] = useState<Channel[]>([])
  const auth = useAuthUser()

  const authHeader = useAuthHeader()
  const token = authHeader().split(' ')[1]

  const user = auth()


  const fetchData = useCallback(async () => {
    const { channels } = await fetchChannels()

    setChannels(channels)
  }, [setChannels])

  const handleNewChannel = (newChannel: Channel) => {
    setChannels([ ...channels, newChannel ])
  }

  const handleChannelDelete = (channel: Channel) => {
    setChannels(channels.filter((oneChannel) => oneChannel.alias !== channel.alias))
  }

  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      auth: {
        token
      },
      secure: true
    })
    setSocket(newSocket)

    return () => {
      newSocket?.close()
    }
  }, [token, setSocket])

  useEffect(() => {
    fetchData().catch(console.error)

    return () => {

    }
  }, [fetchData])

  return (
    <div>
      <div>Channels: {channels.length}</div>
      <div>
        {user && (
          <div>
            <AddChannel onNewChannel={handleNewChannel}/>
            {socket && (
              <SocketMain socket={socket} user={user} channels={channels}
                onChannelDelete={handleChannelDelete}/>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
