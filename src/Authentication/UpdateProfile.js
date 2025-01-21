import React, { useEffect, useState } from 'react'
import { storage } from '../firebase'
import { Navigate, useNavigate } from 'react-router'
import { Button, Form, Image } from 'react-bootstrap'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useAuth } from '../Contexts/useContext'

export default function UpdateProfile() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [retypePassword, setRetypePassword] = useState("")
    const [profileImage, setProfileImage] = useState(null)
    const [imageUrl, setImageUrl] = useState("")
    const [username, setUsername] = useState("")
    const [error, setError] = useState("")
    const [uploadLoading, setUploadLoading] = useState(false)
    const [progress, setProgress] = useState(0)

    const navigate = useNavigate()
    const { 
        user,
        updateUserEmail, 
        updateUserPassword,
        updateUsername, 
        updateProfileImage,
    } = useAuth()


    useEffect(() => {
        if (user) {
            if (!user.photoURL) {
                const defaultImageRef = ref(storage, "/profileImages/default.jpg")
                getDownloadURL(defaultImageRef).then((downloadURL) => {
                    setImageUrl(downloadURL)
                }).catch(err => {
                    setError("An error getting image: " + err.message)
                    return
                })
            } else {
                setImageUrl(user.photoURL)
            }
        }
    }, [user])

    useEffect(() => {
        if (user) {
            setUsername(user.displayName)
        }
    }, [user])

    function handleFileChange(e) {
        const file = e.target.files[0]
        if (file) {
            setProfileImage(e.target.files[0])

            setImageUrl(URL.createObjectURL(file))
        }
    }

    async function updateUserProfile(e) {
        e.preventDefault()
        setError("")
        setUploadLoading(true)
        if (password !== retypePassword) {
            setError("Passwords do not match.")
            return
        }

        try {
            if (profileImage) {
                const storageRef = ref(storage, `profileImages/${user.uid}.jpg`)
                const uploadTask = uploadBytesResumable(storageRef, profileImage)

                uploadTask.on("state_changed", (snapshot) => {
                    const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setProgress(uploadProgress)

                }, (error) => {
                    setError("An error uploading image: " + error.message)
                }, () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        updateProfileImage(downloadURL).then(() => {})
                        .catch(err => {
                            setError("An error uploading image: " + err.message)
                        })
                    })
                })
            }

            if (username) {
                await updateUsername(username)
            }

            if (email && password) {
                await updateUserEmail(email)
                await updateUserPassword(password)
            }

            if (email && email !== user.email) {
                await updateUserEmail(email)
            }

            if (password) {
                await updateUserPassword(password)
            }
        }
        catch (e) {
            setError("An error occurred while updating profile: " + e.message)
        }
        finally {
            setUploadLoading(false)
            navigate("/profile")
        }
    }

  return (
    !user ? <Navigate to="/signIn" /> :
    (<>
        <h3>Update Profile</h3>
        {imageUrl && <Image src={imageUrl} style={{
            width: "150px", height: "150px"
        }} roundedCircle/>}
      <Form onSubmit={updateUserProfile}>
        <Form.Group>
            <Form.Label>Update Avatar:</Form.Label>
            <Form.Control 
            type="file"
            onChange={handleFileChange}
            />
        </Form.Group>
        <Form.Group>
            <Form.Label>Update Username:</Form.Label>
            <Form.Control
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control 
            type='text'
            value={email}
            onChange={e => setEmail(e.target.value)}/>
        </Form.Group>
        <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control 
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}/>
        </Form.Group>
        <Form.Group>
            <Form.Label>Reenter Password</Form.Label>
            <Form.Control 
            type='password'
            value={retypePassword}
            onChange={e => setRetypePassword(e.target.value)}/>
        </Form.Group>
        <Button type='submit'>Update Profile</Button>
      </Form>
      <p>{error}</p>
      {uploadLoading && <p>Updating Profile...</p>}
      {progress !=0 && <p>Uploading progress: {progress}%</p>}
    </>)
  )
}
