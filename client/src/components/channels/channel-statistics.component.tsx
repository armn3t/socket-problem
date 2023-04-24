import React, { useState } from 'react'
import { Message, Channel, ChannelStatistics } from '../../types'

type Props = {
  channel: Channel | null,
  statistics: ChannelStatistics | null
  onStatisticsRefresh: () => void
}

const ChannelStatisticsComponent = ({ channel, statistics, onStatisticsRefresh }: Props) => {
  const [showMessages, setShowMessages] = useState(false)

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
              <li className='list-group-item d-flex'>
                <button className={`btn btn-${showMessages ? 'warning' : 'primary'}`}
                  onClick={() => setShowMessages(!showMessages)}
                >
                  {showMessages ? 'Hide' : 'Show'}
                </button>
                <button className='btn btn-info' onClick={() => onStatisticsRefresh()}>
                  Refresh
                </button>
              </li>
            </ul>
          </div>
          {showMessages && (
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
          )}
        </div>
      )}
    </div>
  )
}

export default ChannelStatisticsComponent
