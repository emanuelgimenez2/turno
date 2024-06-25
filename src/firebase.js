// // /src/firebase.js

// import { getApps, initializeApp } from "firebase/app";
// import { getFirestore } from 'firebase/firestore';
// //import firestore from 'firebase/app';
// //import 'firebase/firestore'; // Importa solo Firestore si es necesario
// const apiKey = process.env.REACT_APP_YOUR_API_KEY;
// const authDomain = process.env.REACT_APP_AUTH0_DOMAIN;
// const projectId = process.env.REACT_APP_YOUR_PROYECTID;
// const storageBucket = process.env.REACT_APP_YOUR_STORAGE_BUCKET;
// const messagingSenderId = process.env.REACT_APP_OUR_MESSAGING_SENDER_ID;
// const appId = process.env.REACT_APP_YOUR_APP_IDN;
// console.log(apiKey)
// const firebaseConfig = {
//   apiKey: {apiKey},
//   authDomain: {authDomain},
//   projectId: {projectId},
//   storageBucket: {storageBucket},
//   messagingSenderId: {messagingSenderId},
//   appId: {appId},
// };

// // Inicializa Firebase
// //firebase.initializeApp(firebaseConfig);
// export let app =
//   getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// const firestore = getFirestore(app);


// export default firestore;


// /src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCuYRJQhH2pREP01Yhx4h8aYM7PJa995jo",
  authDomain: "fir-b293a.firebaseapp.com",
  projectId: "fir-b293a",
  storageBucket: "fir-b293a.appspot.com",
  messagingSenderId: "731200984846",
  appId: "1:731200984846:web:e1b19e286a8702fc08695f",
  measurementId: "G-47ZG608MBX"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

export { db };
