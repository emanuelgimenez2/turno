// FirebaseAuthProvider.jsx

import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import "./FirebaseAuthProvider.css";
import Loader from './Loader/Loader';

export const AuthContext = createContext();

export const FirebaseAuthProvider = ({ children, auth }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // eslint-disable-next-line no-unused-vars
        const tokenResult = await getIdTokenResult(user, true);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists()) {
          // Si el usuario no existe en Firestore, lo creamos
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            isAdmin: false
          });
        }

        const userData = userDoc.data();
        setIsAdmin(userData?.isAdmin || false);
        setUser(user);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  const setAdminStatus = async (userId, status) => {
    await setDoc(doc(db, 'users', userId), { isAdmin: status }, { merge: true });
    setIsAdmin(status);
  };

  if (loading) {
    return (
     
      <Loader />
     
    );
  }

  return (
    <AuthContext.Provider value={{ user, auth, isAdmin, setAdminStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
