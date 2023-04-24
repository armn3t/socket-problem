import React, { FormEvent, useState } from 'react'
import { create } from 'react-modal-promise'
import { Modal } from 'react-bootstrap'

type Props = {
  isOpen: boolean
  onResolve: (password: string) => void
  onReject: () => void
}

function ChannelAuthModal({ isOpen, onResolve, onReject }: Props) {
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onResolve(password)
  }

  return (
    <>
      <Modal show={isOpen} fullscreen onHide={() => onReject()}>
        <Modal.Header closeButton>Channel password authentication</Modal.Header>
        <Modal.Body>
          <form onSubmit={(event: FormEvent) => handleSubmit(event)}>
            <div className='input-group'>
              <input className='form-control' placeholder='channel password'
                value={password} onChange={(event) => setPassword(event.target.value)}/>
              <button type='submit' className='btn btn-primary'>Authenticate</button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export const promiseModal =  create(ChannelAuthModal)
