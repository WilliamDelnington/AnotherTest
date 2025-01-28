import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Contexts/useContext'
import { Button, Form } from 'react-bootstrap'

export default function SendMessageForm({ chatboxId }) {
    const [message, setMessage] = useState("")
    const [sendable, setSendable] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
      if (message.trim() === "") {
        setSendable(true)
      }
    }, [message])

    function sendMessage(e) {
      e.preventDefault()

      
    }

  return (
    <div>
      <Form onSubmit={sendMessage}>
        <Form.Control 
        type='text'
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder='Enter message...'/>
        <Button disabled={sendable}>Send</Button>
      </Form>
    </div>
  )
}
