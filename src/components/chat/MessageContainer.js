import React from 'react'
import { useAuth } from '../../Contexts/useContext'

export default function MessageContainer({ message }) {
    const { user } = useAuth() 

  return (
    <div
      className={`chat-bubble ${message.userId === user.uid ? "right" : ""}`}>
      <img
        className="chat-bubble__left"
        src={message.avatar}
        alt="user avatar"
      />
      <div className="chat-bubble__right">
        <p className="user-name">{message.name}</p>
        <p className="user-message">{message.text}</p>
      </div>
    </div>
  )
}
