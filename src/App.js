import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import { useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from './firebase';
import ReactLogo from "./media/React-icon.png"
import SideBar from './components/sidebar';
import { Route, Routes } from 'react-router';
import SignIn from './Authentication/SignIn'
import SignUp from './Authentication/SignUp';
import Profile from './Authentication/Profile';
import UpdateProfile from './Authentication/UpdateProfile';
import Welcome from './Authentication/Welcome';

function App() {
  const [user, setUser] = useState();
  const [error, setError] = useState("");

  function handleGoogleLogin() {
    setError("");

    if (!user) {
      signInWithPopup(auth, provider).then((res) => {
        setUser(res.user);
        console.log(res.user);
      }).catch((err) => {
        setError("Something went wrong, please try again.");
        console.error(err);
      })
    } else if (user) {
      signOut(auth).then(() => {
        setUser(null);
      }).catch((err) => {
        setError("Something went wrong, please try again.");
        console.error(err);
      })
    }
  }

  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignIn />}/>
        <Route path="/signup" element={<SignUp />}/>
        <Route path="/" element={<Profile />}/>
        <Route path="/updateProfile" element={<UpdateProfile />}/>
        <Route path="/welcome" element={<Welcome />}/>
      </Routes>
    </>
  );
}

export default App;
