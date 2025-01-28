import React, { useState } from 'react'
import { useAuth } from '../../Contexts/useContext'
import { Container } from 'react-bootstrap'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { firestore } from '../../firebase'

export default function Chatbox({ chatboxId }) {
    const [boxMessages, setBoxMessages] = useState([])
    const { user } = useAuth()

    useEffect(() => {
        const q = query(collection(firestore, "messages"),
            where("chatboxId", "==", chatboxId),
            orderBy("createdTime", "desc")
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
    }, [])

  return (
    <div>
      <Container></Container>
    </div>
  )
}
