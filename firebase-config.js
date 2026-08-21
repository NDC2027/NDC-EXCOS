// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxLbTdWNF51K828uldtVmvKedg2oMygK0",
  authDomain: "ndc-ward-exco-membership.firebaseapp.com",
  projectId: "ndc-ward-exco-membership",
  storageBucket: "ndc-ward-exco-membership.firebasestorage.app",
  messagingSenderId: "803548153096",
  appId: "1:803548153096:web:732af43e39d217ea8158bd",
  measurementId: "G-FS38YNTWL6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);