import React, { useState } from 'react'

import { useAuthUser } from 'react-auth-kit'

import { Channel, ChannelData, Message, SocketUserPayload, UserRoles } from '../../types'

type Props = {
  channels: any[],
  selectedChannel: Channel | null,
  selectedChannelData: ChannelData | null
  users: Map<string, Partial<SocketUserPayload>>
  joinedChannelsMap: Map<string, ChannelData>
  onChannelChange: (channel: Channel) => void
  onChannelDelete: (channel: Channel) => void
  onChannelLeaving: (channel: Channel) => void
  onNewMessage: (message: string) => void
  onMessageDelete: (message: Message, alias: string) => void
  onUserRemove: (socketId: string, alias: string) => void
}

const Chat = ({
  channels,
  selectedChannel,
  selectedChannelData,
  users,
  joinedChannelsMap,
  onChannelChange,
  onChannelDelete,
  onChannelLeaving,
  onNewMessage,
  onMessageDelete,
  onUserRemove
}: Props) => {
  const [newMessage, setNewMessage] = useState<string>('')
  const user = useAuthUser()()

  const isAdmin = user && user.role === UserRoles.Admin

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!newMessage) return
    onNewMessage(newMessage)
    setNewMessage('')
  }

  const handleChannelChange = (channel: Channel) => {
    console.log(channel, 'HANDLE CHANNEL CHANGE')
    onChannelChange(channel)
  }

  const handleChannelLeaving = (channel: Channel) => {
    onChannelLeaving(channel)
  }

  const handleChannelDelete = (channel: Channel) => {
    onChannelDelete(channel)
  }

  const handleMessageDelete = (message: Message, alias: string) => {
    onMessageDelete(message, alias)
  }

  const handleUserRemove = (socketId: string, alias: string) => {
    onUserRemove(socketId, alias)
  }

  const checkChannelActive = (channel: Channel): boolean => {
    return Boolean(joinedChannelsMap.get(channel.alias))
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-3'>
          <div className='card h-100'>
            <div className='card-body chat-scroll'>
              <ul className='list-group list-group-flush'>
                {channels.map((channel: Channel) => (
                  <li key={channel.alias} className={`list-group-item ${checkChannelActive(channel) && 'list-group-item-primary'}`}>
                    <div className='d-flex w-100 justify-content-between'>

                      <span onClick={() => handleChannelChange(channel)}>
                        {channel.alias}
                      </span>
                      <div>
                        <button className='btn btn-link text-secondary' onClick={() => {handleChannelLeaving(channel)}}>
                          &times;
                        </button>
                        {isAdmin && (
                          <button className='btn btn-link text-danger' onClick={() => handleChannelDelete(channel)}>
                            &times;
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div> 
          </div>
        </div>
        <div className='col-6'>
          <div className='card h-100'>
            <div className='card-header'>
                  {selectedChannel ? selectedChannel.alias : 'No channel selected'}
            </div>
            <div className='card-body chat-scroll chat-body'>
              {selectedChannel && selectedChannelData && selectedChannelData.messages && (
                <ul className='list-group list-group-flush'>
                  {selectedChannelData.messages.map((message: Message) => (
                    <li key={message._id} className='list-group-item'>
                      <div className='d-flex w-100 justify-content-between'>
                        {message.user.email}:&nbsp;
                        {message.content}
                        <small>
                          {message.createdAt.substring(11, 19)}
                          &nbsp;
                          {isAdmin && (
                            <button className='btn btn-link text-danger' onClick={() => handleMessageDelete(message, selectedChannel.alias)}>
                              &times;
                            </button>
                          )}
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className='card-footer'>
              <form onSubmit={handleSubmit}>
                <input className='form-control' type='text'
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  disabled={!selectedChannel}/>
              </form>
            </div>
            
          </div>      
        </div>
        <div className='col-3'>
          <div className='card h-100'>
            <div className='card-body chat-scroll'>
              {selectedChannel && selectedChannelData && selectedChannelData.channelUsers && (
                <ul className='list-group list-group-flush'>
                  {[...selectedChannelData.channelUsers].map((socketId: string) => (
                    <li key={`channel_${socketId}`} className='list-group-item'>
                      <div className='d-flex w-100 justify-content-between'>
                        {users.get(socketId)?.username}
                        {isAdmin && user?.username !== users.get(socketId)?.username  && (
                          <button className='btn btn-link text-danger' onClick={() => handleUserRemove(socketId, selectedChannel.alias)}>
                            &times;
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
