import React, { useEffect, useState } from 'react'
import { storage } from '../firebase'
import { Button, Image } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router'
import { getDownloadURL, ref } from 'firebase/storage'
import { useAuth } from '../Contexts/useContext'
import { useProfile } from '../components/hooks/useProfile'

export default function Profile() {
    const [error, setError] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [friends, setFriends] = useState([])
    const [bookmarkFiles, setBookmarkFiles] = useState([])
    const [bookmarkFolders, setBookmarkFolders] = useState([])

    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const state = useProfile(user)

    async function handleLogout(e) {
        e.preventDefault()
        try {
            await logout()
            navigate("/signIn")
        }
        catch (err) {
            setError("An error logging out: " + err.message)
        }
    }

  return (
    !user ? <Navigate to="/signIn" /> :
    (<>
      {imageUrl && <Image src={imageUrl} style={{
        width: "150px",
        height: "150px"
      }} roundedCircle/>}
      <h3>Welcome back, {user.displayName ? user.displayName : user.uid}</h3>
      <p>{error}</p>

      <Button as={Link} to={`/user/${user.uid}`}>My Drive</Button>

      <Button onClick={() => navigate("/updateProfile")}>Update Profile</Button>
      <Button onClick={handleLogout}>Log Out</Button>
    </>)
  )
}
