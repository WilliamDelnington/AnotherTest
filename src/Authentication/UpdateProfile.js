import React, { useEffect, useState } from 'react'
import { auth, storage } from '../firebase'
import { Navigate, useNavigate } from 'react-router'
import { Button, Form, Image } from 'react-bootstrap'
import { onAuthStateChanged, updateEmail, updatePassword, updateProfile } from 'firebase/auth'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

export default function UpdateProfile() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [retypePassword, setRetypePassword] = useState("")
    const [profileImage, setProfileImage] = useState(null)
    const [imageUrl, setImageUrl] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const [uploadLoading, setUploadLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [user, setUser] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const unsucsribe = onAuthStateChanged(auth, curUser => {
            setUser(curUser)
            setLoading(false)
        })

        return () => unsucsribe()
    }, [])

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
            setUploadLoading(false)
            navigate("/")
        }
    }

    if (loading) {
        return <h3>Loading...</h3>
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
