import React from 'react'
import { Message, Channel, ChannelStatistics } from '../../types'

type Props = {
  channel: Channel | null,
  statistics: ChannelStatistics | null
}

const ChannelStatisticsComponent = ({ channel, statistics }: Props) => {

  console.log('ChannelStatistics', channel, statistics)

  return (
    <div className='container mb-3'>
      Statistics
      {channel && statistics && (

        <div className='card'>
          <div className='card-body'>
            <ul className='list-group list-group-flush'>
              <li className='list-group-item d-flex'>
                <b>{channel.alias}&nbsp;</b>
                total messages: {statistics.messageCount}
              </li>
              <li className='list-group-item d-flex'>
                <b>creation date: </b>
                {channel.createdAt}
              </li>
            </ul>
          </div>
          <div className='card-body chat-body'>
            {statistics.messages.length > 0 && (
              <div>
                <div>Messages in the last 5 minutes:</div>
                <ul className='list-group list-group-flush'>
                  {statistics.messages.map((message: Message) => (
                    <li key={`stat_message_${message._id}`} className='list-group-item'>
                      <div className='d-flex w-100 justify-content-between'>
                          {message.user.email}:&nbsp;
                          {message.content}
                          <small>
                            {message.createdAt.substring(11, 19)}
                          </small>
                        </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!statistics.messages.length && (
              <div>
                No new messages in the last 5 minutes
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ChannelStatisticsComponent
