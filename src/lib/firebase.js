// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByFTpFpr4gUFSym3QfpfaY3JCj_Rf6gLw",
  authDomain: "dealership-store.firebaseapp.com",
  projectId: "dealership-store",
  storageBucket: "dealership-store.appspot.com",
  messagingSenderId: "719668059289",
  appId: "1:719668059289:web:616b9684122decccdf2c08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)
export { storage }