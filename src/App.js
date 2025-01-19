import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import { useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from './firebase';
import ReactLogo from "./media/React-icon.png"
import SideBar from './components/sidebar';
import { BrowserRouter, Route, Routes, useParams } from 'react-router';
import SignIn from './Authentication/SignIn'
import SignUp from './Authentication/SignUp';
import Profile from './Authentication/Profile';
import UpdateProfile from './Authentication/UpdateProfile';
import Welcome from './Authentication/Welcome';
import { AuthProvider } from './Contexts/useContext';
import DashBoard from './components/DashBoard';

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
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/user/:userId" element={<DashBoard />}/>
            <Route path="/user/:userId/folder/:folderId" element={<DashBoard />} />

            <Route path="/signin" element={<SignIn />}/>
            <Route path="/signup" element={<SignUp />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/updateProfile" element={<UpdateProfile />}/>
            <Route path="/welcome" element={<Welcome />}/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
