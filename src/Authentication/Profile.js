import { onAuthStateChanged, signOut } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth, storage } from '../firebase'
import { Button } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router'
import { getDownloadURL, ref } from 'firebase/storage'

export default function Profile() {
    const [error, setError] = useState("")
    const [email, setEmail] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [user, setUser] = useState(null)

    const currentUser = auth.currentUser

    const navigate = useNavigate()

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, user => {
        setUser(user)
        setEmail(user.email)
      })

      return () => unsubscribe()
    }, [])

    useEffect(() => {
      if (!currentUser.photoURL) {
        const defaultImageRef = ref(storage, "profileImages/default.jpg")
        getDownloadURL(defaultImageRef).then(downloadURL => {
          setImageUrl(downloadURL)
        })
      } else {
        setImageUrl(currentUser.photoURL)
      }
      
    }, [])

    async function handleLogout(e) {
        e.preventDefault()
        try {
            await signOut(auth)
            navigate("/signIn")
        }
        catch (err) {
            setError("An error logging out: " + err.message)
        }
    }

  return (
    !currentUser ? <Navigate to="/signIn" /> :
    (<>
      {imageUrl && <img src={imageUrl} style={{
        maxWidth: "150px",
        maxHeight: "150px"
      }}/>}
      <h3>Welcome back, {email}</h3>
      <p>{error}</p>
      <Button onClick={() => navigate("/updateProfile")}>Update Profile</Button>
      <Button onClick={handleLogout}>Log Out</Button>
    </>)
  )
}
