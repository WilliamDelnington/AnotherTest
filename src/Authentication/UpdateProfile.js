import React, { useState } from 'react'
import { auth, storage } from '../firebase'
import { Navigate, useNavigate } from 'react-router'
import { Button, Form } from 'react-bootstrap'
import { updateEmail, updatePassword, updateProfile } from 'firebase/auth'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

export default function UpdateProfile() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [retypePassword, setRetypePassword] = useState("")
    const [profileImage, setProfileImage] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const user = auth.currentUser
    const navigate = useNavigate()

    function handleFileChange(e) {
        setProfileImage(e.target.files[0])
    }

    async function updateUserProfile(e) {
        e.preventDefault()
        setError("")
        setLoading(true)
        if (password !== retypePassword) {
            setError("Passwords do not match.")
            return
        }

        try {
            if (profileImage) {
                const storageRef = ref(storage, "profileImages/")
                const uploadTask = uploadBytesResumable(storageRef, profileImage)

                uploadTask.on("state_changed", (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

                }, (error) => {
                    setError("An error uploading image: " + error.message)
                }, () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        updateProfile(user, { photoURL: downloadURL }).then(() => {})
                        .catch(err => {
                            setError("An error uploading image: " + err.message)
                        })
                    })
                })
            }

            if (email && password) {
                await updateEmail(user, email)
                await updatePassword(user, password)
            }

            if (email && email !== user.email) {
                await updateEmail(user, email)
            }

            if (password) {
                await updatePassword(user, password)
            }
        }
        catch (e) {
            setError("An error occurred while updating profile: " + e.message)
        }
        finally {
            setLoading(false)
            navigate("/profile")
        }
    }

  return (
    user ? <Navigate to="/login" /> :
    (<>
      <Form onSubmit={updateProfile}>
        <Form.Group>
            <Form.Label>Update Avatar:</Form.Label>
            <Form.Control 
            type="file"
            onChange={handleFileChange}
            />
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
      {loading && <p>Updating Profile...</p>}
    </>)
  )
}
