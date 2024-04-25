import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuI7NVCo-N8GC4LKRsgmVLMXkLJSZR76Q",
  authDomain: "scholarstat-57cc2.firebaseapp.com",
  projectId: "scholarstat-57cc2",
  storageBucket: "scholarstat-57cc2.appspot.com",
  messagingSenderId: "330959278124",
  appId: "1:330959278124:web:19f461c299014006ed0189",
  measurementId: "G-TSMGEW0JND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);