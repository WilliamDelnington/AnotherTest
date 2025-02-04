import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { collection, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { firestore } from '../../firebase'
import MessageContainer from './MessageContainer'
import SendMessageForm from './SendMessageForm'
import { useParams } from 'react-router'

export default function Chatbox() {
    const [boxMessages, setBoxMessages] = useState([])
    const { chatboxId } = useParams()

    useEffect(() => {
       if (chatboxId) {
        const q = query(collection(firestore, "messages"),
            where("chatboxId", "==", chatboxId),
            orderBy("createdTime", "desc"),
            limit(50)
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = []
            snapshot.forEach(doc => {
                fetchedMessages.push({ ...doc.data(), id: doc.id })
            })
            const sortedMessages = fetchedMessages.sort((a, b) => {
                return a.createdTime - b.createdTime
            })
            setBoxMessages(sortedMessages)
        })

        return () => unsubscribe()
       }
        
    }, [chatboxId])

  return (
    <div>
      <Container>
        {boxMessages.map((message) => (
            <MessageContainer message={message} />
        ))}
        <SendMessageForm chatboxId={chatboxId} />
      </Container>
    </div>
  )
}
