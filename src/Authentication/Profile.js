import React, { useEffect, useState } from 'react'
import { storage } from '../firebase'
import { Button, Image } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router'
import { getDownloadURL, ref } from 'firebase/storage'
import Folder from '../components/Folder'
import FolderUploadButton from '../components/FolderUploadButton'
import FileUploadButton from '../components/FileUploadButton'
import File from '../components/File'
import { useFolder } from '../components/useFolder'
import { useAuth } from '../Contexts/useContext'

export default function Profile() {
    const [error, setError] = useState("")
    const [imageUrl, setImageUrl] = useState("")

    const { user, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
      if (user) {
        if (!user.photoURL) {
          const defaultImageRef = ref(storage, "profileImages/default.jpg")
          getDownloadURL(defaultImageRef).then(downloadURL => {
            setImageUrl(downloadURL)
          })
        } else {
          setImageUrl(user.photoURL)
        }
      }
    }, [user])

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
      <h3>Welcome back, {user.displayname ? user.displayname : user.uid}</h3>
      <p>{error}</p>

      <Button as={Link} to={`/user/${user.uid}`}>My Drive</Button>

      <Button onClick={() => navigate("/updateProfile")}>Update Profile</Button>
      <Button onClick={handleLogout}>Log Out</Button>
    </>)
  )
}
