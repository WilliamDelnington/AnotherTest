import { onAuthStateChanged, signOut } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth, storage } from '../firebase'
import { Button, Image } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router'
import { getDownloadURL, ref } from 'firebase/storage'
import Folder from '../components/Folder'
import FolderUploadButton from '../components/FolderUploadButton'
import FileUploadButton from '../components/FileUploadButton'
import File from '../components/File'
import { useFolder } from '../components/useFolder'

export default function Profile() {
    const [error, setError] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const state = useFolder()
    console.log(state.childFolders)

    const navigate = useNavigate()

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, user => {
        setUser(user)
        setLoading(false)
      })

      return () => unsubscribe()
    }, [])

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
            await signOut(auth)
            navigate("/signIn")
        }
        catch (err) {
            setError("An error logging out: " + err.message)
        }
    }

    if (loading) {
      return <h3>Loading...</h3>
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
      <Button onClick={() => navigate("/updateProfile")}>Update Profile</Button>
      <Button onClick={handleLogout}>Log Out</Button>
      <Folder folderId={null} folderName={"New Folder"}/>
      <FolderUploadButton folder={state.folder} />
    </>)
  )
}
