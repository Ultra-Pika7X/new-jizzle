import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: USER MUST REPLACE THESE WITH THEIR ACTUAL FIREBASE CONFIG KEYS
const firebaseConfig = {
    apiKey: "AIzaSyDoMHPWwGuz9Gre6SYEPglbE3eBUF97Ryw",
    authDomain: "new-jizzle.firebaseapp.com",
    projectId: "new-jizzle",
    storageBucket: "new-jizzle.firebasestorage.app",
    messagingSenderId: "874547857794",
    appId: "1:874547857794:web:d8c7f80a15a4134465e79b"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
