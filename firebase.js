// firebase.js
// Paste your Firebase config values into firebaseConfig below

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDoQdVen150UxdmEkB-N2LmZPOTySOGctc",
  authDomain: "catering-reservation-sys-831b5.firebaseapp.com",
  projectId: "catering-reservation-sys-831b5",
  storageBucket: "catering-reservation-sys-831b5.firebasestorage.app",
  messagingSenderId: "706350788913",
  appId: "1:706350788913:web:5f682fe25351d3669c0010"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
