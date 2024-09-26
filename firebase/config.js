// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeSgOVAZomXdkgHPkYAz2PbvW9NMoS-1A",
  authDomain: "chat-y-9acfe.firebaseapp.com",
  projectId: "chat-y-9acfe",
  storageBucket: "chat-y-9acfe.appspot.com",
  messagingSenderId: "396079774912",
  appId: "1:396079774912:web:df9b4731462cf708038125",
  measurementId: "G-0418FS8HDR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { app, auth, analytics, firestore };