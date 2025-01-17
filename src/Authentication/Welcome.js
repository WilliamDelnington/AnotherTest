import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { auth, storage } from '../firebase'
import { updateProfile } from 'firebase/auth'

export default function Welcome() {
    const [profileImage, setProfileImage] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [error, setError] = useState("")
    const [username, setUsername] = useState("")
    const [progress, setProgress] = useState(0)

    const user = auth.currentUser

    function handleUpload(e) {
        const file = e.target.files[0]
        if (file) {
            setProfileImage(file)

            const previerUrl = URL.createObjectURL(file)
            setImageUrl(previerUrl)
        }
        
    }

    useEffect(() => {
        const defaultStorageRef = ref(storage, "/profileImages/default.jpg")
        getDownloadURL(defaultStorageRef).then((downloadURL) => {
            setImageUrl(downloadURL)
        }).catch(err => {
            setError("An error getting image: " + err.message)
            return
        })
    }, [])

    function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setProgress(0)

        const storageRef = ref(storage, "/profileImages")
        if (profileImage) {
            const uploadTask = uploadBytesResumable(storageRef, profileImage)

            uploadTask.on("state_changed",
                (snapshot) => {
                    const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setProgress(uploadProgress)
                },
                (error) => {
                    setError("An error uploading image: " + error.message)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        updateProfile(user, {photoURL: downloadURL}).then(() => {})
                        .catch((error) => {
                            setError("An error updating profile: " + error.message)
                            return
                        })
                    })
                }
            )
        }

        updateProfile(user, {displayName: username}).then(() => {})
        .catch((error) => {
            setError("An error updating profile: " + error.message)
            return
        })
    }

  return (
    <>
        <h2>Welcome to app!</h2>
        <img src={imageUrl} />
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Add your profile image: </Form.Label>
                <Form.Control 
                type="file"
                onChange={handleUpload}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>What should we call you?</Form.Label>
                <Form.Control 
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}/>
            </Form.Group>
            <Button type="submit">Upload Image</Button>
        </Form>
        {progress && <p>Uploading progress: {progress}%</p>}
        <p>{error}</p>
    </>
  )
}
