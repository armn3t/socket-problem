import React, { useState } from 'react'

import { Channel, ChannelJoinedPayload, ChannelData, Message, SocketUserPayload } from '../../types'

type Props = {
  channels: any[],
  selectedChannel: Channel | null,
  selectedChannelData: ChannelData | null
  users: Map<string, Partial<SocketUserPayload>>
  onChannelChange: (channel: Channel) => void
  onNewMessage: (message: string) => void
}

const Chat = ({ channels, selectedChannel, selectedChannelData, users, onChannelChange, onNewMessage }: Props) => {
  const [newMessage, setNewMessage] = useState<string>('')

  console.log(selectedChannelData, 'SELECTED DATA')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (!newMessage) return
    console.log('SEND NEW MESSAGE', newMessage)
    onNewMessage(newMessage)
    setNewMessage('')
  }

  const handleChannelChange = (channel: Channel) => {
    onChannelChange(channel)
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-3'>
          <div className='card h-100'>
            <div className='card-body'>
              <ul>
                {channels.map((channel: Channel) => (
                  <li key={channel.alias}>
                    <span onClick={() => handleChannelChange(channel)}>
                      {channel.alias}
                    </span>
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
            <div className='card-body'>
              {selectedChannelData && selectedChannelData.messages && (
                <ul>
                  {selectedChannelData.messages.map((message: Message) => (
                    <li key={message._id}>{message.content}</li>
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
            <div className='card-body'>
              {selectedChannelData && selectedChannelData.channelUsers && (
                <ul>
                  {[...selectedChannelData.channelUsers].map((socketId: string) => (
                    <li key={`channel_${socketId}`}>
                      {users.get(socketId)?.username}
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
