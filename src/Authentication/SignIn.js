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
            await handleSignin(email, password);
            navigate("/profile"); // Navigate only after successful sign-in
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