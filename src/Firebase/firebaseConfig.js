
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDCWF5PgwGWvQ1PF4mMDS_6ldPkvMsve0M",
  authDomain: "foodyaari-e9743.firebaseapp.com",
  projectId: "foodyaari-e9743",
  storageBucket: "foodyaari-e9743.firebasestorage.app",
  messagingSenderId: "423154485740",
  appId: "1:423154485740:web:fc1ef7cd9926a60fb058c9",
  measurementId: "G-RGLC2L9WDZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 const auth= getAuth(app);

 const db = getFirestore(app);
 const storage = getStorage(app);
 
 const googleProvider = new GoogleAuthProvider();
 const facebookProvider = new FacebookAuthProvider();
 
 export { 
   app, 
   auth, 
   db, 
   storage,
   googleProvider, 
   facebookProvider,
   collection,
   doc,
   setDoc,
   addDoc,
   updateDoc,
   deleteDoc,
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signInWithPopup,
   getDocs,
   query,
   where,
   ref,
   uploadBytes,
   getDownloadURL
 };