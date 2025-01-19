import React from 'react'
import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../Contexts/useContext'

export default function SignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const { signin, checkEmailRegistered } = useAuth()

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await checkEmailExists(email)
            await handleSignin(email, password);
            navigate("/"); // Navigate only after successful sign-in
        } catch (err) {
            setError(err.message);
            return // Ensure `handleSignin` throws meaningful errors
        } finally {
            setLoading(false);
        }
    }
    
    async function handleSignin(email, password) {
        const userCredential = await signin(email, password);
        return userCredential.user; // Return user for further processing if needed
    }

    async function checkEmailExists(email) {
        setError("")
        setLoading(true)
        try {
            const methods = await checkEmailRegistered(email)
            if (methods.length == 0) {
                throw new Error("Email is not registered.")
            }
        } catch (e) {
            throw new Error(`An error occured: ${e.message}`)
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
            <p>Don't have an account? <Link to={"/signUp"}>Sign Up</Link></p>
        </Form> 
    </>
  )
}