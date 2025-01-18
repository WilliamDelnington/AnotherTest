import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateEmail, updatePassword, updateProfile } from "firebase/auth"
import React, { useContext, useEffect, useState } from "react"
import { auth } from "../firebase"

const context = React.createContext()
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, curUser => {
            setUser(curUser)
            setLoading(false)
        })

        return () => unsubscribe()
    })

    function signin(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function logout() {
        return signOut(auth)
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }

    function updateUserEmail(email) {
        return updateEmail(user, email)
    }

    function updateUserPassword(password) {
        return updatePassword(user, password)
    }

    function updateUsername(username) {
        return updateProfile(user, {
            displayName: username
        })
    }

    function updateProfileImage(imageUrl) {
        return updateProfile(user, {
            photoURL: imageUrl
        })
    }

    function checkEmailRegistered(email) {
        return fetchSignInMethodsForEmail(auth, email)
    }

    const value = {
        user, 
        signin, 
        signup, 
        logout, 
        resetPassword, 
        updateUserEmail, 
        updateUserPassword, 
        updateUsername, 
        updateProfileImage,
        checkEmailRegistered
    }

    return (
        <context.Provider value={value}>
            {!loading && children}
        </context.Provider>
    )
}

export function useAuth() {
    return useContext(context)
}