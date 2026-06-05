import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB6reH0OlQAaRPyzC2OZz6X8-_u9XN9jao",
  authDomain: "pazarmuhasebe.firebaseapp.com",
  projectId: "pazarmuhasebe",
  storageBucket: "pazarmuhasebe.firebasestorage.app",
  messagingSenderId: "768128220980",
  appId: "1:768128220980:web:f77d63739274535d91af61",
  measurementId: "G-VB2PHMLQ9M",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
