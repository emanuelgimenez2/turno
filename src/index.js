import React from "react";
import { createRoot } from "react-dom/client";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { FirebaseAuthProvider } from "./components/FirebaseAuthProvider"; // Necesitarás crear este componente
import App from "./App";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUID
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Asegúrate de que las variables de entorno estén definidas
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
  throw new Error("Missing Firebase configuration");
}

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <FirebaseAuthProvider auth={auth}>
      <App />
    </FirebaseAuthProvider>
  </React.StrictMode>
);