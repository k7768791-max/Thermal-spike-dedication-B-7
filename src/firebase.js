// src/firebase.js
// Replace the config below with your actual Firebase project credentials
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCaUAtTzA27sztgftaDAlQSm4Z-FwgwcQ4",
  authDomain: "batch--7.firebaseapp.com",
  databaseURL: "https://batch--7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "batch--7",
  storageBucket: "batch--7.firebasestorage.app",
  messagingSenderId: "95931583847",
  appId: "1:95931583847:web:f2b773dad58a64964833c2",
  measurementId: "G-FN83SY5FZS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
