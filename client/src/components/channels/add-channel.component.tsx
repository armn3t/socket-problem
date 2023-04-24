import React, { useState } from 'react'

import { createChannel } from '../../api/channel'

import { Channel } from '../../types'

type Props = {
  onNewChannel: (newChannel: Channel) => void
}

const AddChannel = ({ onNewChannel }: Props) => {
  const [ newChannelAlias, setNewChannel ] = useState('')
  const [ password, setPassword ] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    try {
      const { message, newChannel } = await createChannel(newChannelAlias, password)
      setNewChannel('')
      setPassword('')
      onNewChannel(newChannel)
    } catch (error) {
      console.log('Saving new alias failed')
      setNewChannel('')
    }
  }

  return (
    <div className='row mt-5'>
      <div className='col-4 offset-4'>
        <form onSubmit={handleSubmit}>
          <div className='input-group mb-3'>
            
            <input className='form-control'
              type="text"
              placeholder="Channel alias"
              value={newChannelAlias}
              onChange={(event) => setNewChannel(event.target.value)}
            />
            <input className='form-control'
              type="text"
              placeholder="Optional password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button className='btn btn-primary' type="submit">Save</button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddChannel
