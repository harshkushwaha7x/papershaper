// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrEWBkg3tbh1J25EDkA8XhXHCN-DF9aYI",
  authDomain: "papershapers-72950.firebaseapp.com",
  projectId: "papershapers-72950",
  storageBucket: "papershapers-72950.firebasestorage.app",
  messagingSenderId: "409486195769",
  appId: "1:409486195769:web:2a7abdb827ef1da2b2a1e8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);

export default app;
export { analytics, auth, firestore };
