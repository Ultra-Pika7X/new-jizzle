import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: USER MUST REPLACE THESE WITH THEIR ACTUAL FIREBASE CONFIG KEYS
const firebaseConfig = {
    apiKey: "AIzaSyCuCDTyqSvsVUI1-6-1GMFp8HvEkOyry0I",
    authDomain: "jizzle-bedb7.firebaseapp.com",
    projectId: "jizzle-bedb7",
    storageBucket: "jizzle-bedb7.firebasestorage.app",
    messagingSenderId: "887639030100",
    appId: "1:887639030100:web:5819cbb07be963cfc4b0c1"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
