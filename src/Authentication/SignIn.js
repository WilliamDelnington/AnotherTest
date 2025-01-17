import { fetchSignInMethodsForEmail, signInWithEmailAndPassword } from 'firebase/auth'
import React from 'react'
import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { auth } from '../firebase'
import { useNavigate } from 'react-router'

export default function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault()
        try {
            checkEmailExists(email)
            handleSignin(email, password)
        } catch (err) {
            setError(err)
            return
        }
    }

    async function handleSignin(email, password) {
        setError("")
        setLoading(true)
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            navigate("/profile")
        }
        catch (e) {
            setError(`An error signing in: ${e}`)
        }
        finally {
            setLoading(false)
        }
    }

    async function checkEmailExists(email) {
        setError("")
        setLoading(true)
        try {
            const methods = await fetchSignInMethodsForEmail(auth, email)
            if (methods.length == 0) {
                throw new Error("Email is not registered.")
            }
        } catch (e) {
            throw new Error(`An error occured: ${e}`)
        } finally {
            setLoading(false)
        }
    }

  return (
    <>
        <h3>Sign In</h3>
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Email: </Form.Label>
                <Form.Control 
                value={email}
                type='text'
                onChange={e => setEmail(e.target.value)}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Password: </Form.Label>
                <Form.Control 
                value={password}
                type='password'
                onChange={e => setPassword(e.target.value)}/>
            </Form.Group>
            <p>{error}</p>
            {loading && <p>Signing In...</p>}
            <Button type="submit">Sign In</Button>
        </Form>
    </>
  )
}