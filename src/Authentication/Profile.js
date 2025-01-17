import { onAuthStateChanged, signOut } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { Button } from 'react-bootstrap'
import { Navigate, useNavigate } from 'react-router'

export default function Profile() {
    const [user, setUser] = useState(null)
    const [error, setError] = useState("")

    const currentUser = auth.currentUser

    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })

        return () => unsubscribe()
    }, [])

    async function handleLogout(e) {
        e.preventDefault()
        try {
            await signOut(auth)
            navigate("/login")
        }
        catch (err) {
            setError("An error logging out: " + err.message)
        }
    }

  return (
    currentUser ? <Navigate to="/login" /> :
    (<>
      {currentUser.photoUrl && <img src={currentUser.photoUrl}/>}
      <h3>Welcome back, {user.email}</h3>
      <p>{error}</p>
      <Button onClick={handleLogout}>Log Out</Button>
    </>)
  )
}
