// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };