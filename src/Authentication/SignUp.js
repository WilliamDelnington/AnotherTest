import React from 'react'
import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../Contexts/useContext'

export default function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [retypePassword, setRetypePassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const {user, signup, checkEmailRegistered } = useAuth()

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        setError("")
        setLoading(true)
        if (password !== retypePassword) {
            setError("Passwords do not match.")
            setLoading(false)
            return
        }
        try {
            await checkEmailExists(email)
            await handleSignup(email, password)
        } catch (err) {
            setError(err.message)
            return
        } finally {
            setLoading(false)
        }
    }

    async function handleSignup(email, password) {
        setError("")
        setLoading(true)
        try {
            const userCredential = await signup(email, password)
            navigate("/welcome")
        }
        catch (e) {
            setError(`An error signing up: ${e.message}`)
        }
        finally {
            setLoading(false)
        }
    }

    async function checkEmailExists(email) {
        setError("")
        setLoading(true)
        try {
            const methods = await checkEmailRegistered(email)
            if (methods.length > 0) {
                throw new Error("Email is already used.")
            }
        } catch (e) {
            throw new Error(`An error occured: ${e.message}`)
        } finally {
            setLoading(false)
        }
    }

  return (
    user ? <Navigate to={`/user/${user.uid}`} /> :
    <>
        <h3>Sign Up</h3>
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
            <Form.Group>
                <Form.Label>Retype Password: </Form.Label>
                <Form.Control 
                value={retypePassword}
                type='password'
                onChange={e => setRetypePassword(e.target.value)}/>
            </Form.Group>
            <p>{error}</p>
            {loading && <p>Signing Up...</p>}
            <Button type="submit">Sign Up</Button>
            <p>Already have an account? <Link to={"/signIn"}>Sign In</Link></p>
        </Form>
    </>
  )
}