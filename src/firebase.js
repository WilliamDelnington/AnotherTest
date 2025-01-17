// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
console.log(process.env.FIREBASE_API_KEY)
const firebaseConfig = {
  apiKey: "AIzaSyANJlypBX5X5Mm6b-BwX8pc2BUv0Fjaej0",
  authDomain: "authenciation-fb35a.firebaseapp.com",
  projectId: "authenciation-fb35a",
  storageBucket: "authenciation-fb35a.appspot.com",
  messagingSenderId: "932422415447",
  appId: "1:932422415447:web:78ccdfe8c978653de1df12",
  measurementId: "G-86MXMQ80R9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, firestore, storage, provider, analytics };