import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup, signOut, onAuthStateChanged,
} from "firebase/auth";
import {
  doc, getDoc, setDoc, updateDoc, increment, serverTimestamp,
} from "firebase/firestore";
import { auth, googleProvider, db } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]             = useState(null);
  const [userData, setUserData]     = useState(null);
  const [loading, setLoading]       = useState(true);

  async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
    setUserData(null);
  }

  async function fetchUserData(uid) {
    const ref  = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) setUserData(snap.data());
    return snap.data();
  }

  async function decrementFreeCount(uid) {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, { freePredictions: increment(-1) });
    setUserData(prev => ({ ...prev, freePredictions: (prev?.freePredictions || 1) - 1 }));
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) await fetchUserData(u.uid);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, loginWithGoogle, logout, fetchUserData, decrementFreeCount }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
