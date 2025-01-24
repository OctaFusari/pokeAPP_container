// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyCyfxITBJFiLpy86OkpuyzXP8p_cUwS5Ko",

  authDomain: "artella-3facf.firebaseapp.com",

  projectId: "artella-3facf",

  storageBucket: "artella-3facf.appspot.com",

  messagingSenderId: "901180588632",

  appId: "1:901180588632:web:f2da9a573d41c97d9c802d"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export default {
  
  dbEx: function(){
    return db
  },

  getUserName: function () {
    return localStorage.getItem("login");
  },
  getUserData: async function (user: string) {

      const docRef = doc(db, "utenti_poke", user);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data().username
      } else {
      }
  },
  logout: function () {
    localStorage.removeItem("login");
  },
  isAuthenticated: function () {
    return Boolean(localStorage.getItem("login"));
  },

  registrazione: function (username: any, email: any, password: any) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: any) => {
        // Signed up 
        const user = userCredential.user;
        return setDoc(doc(db, "utenti_poke", user.uid), {
          idutente: user.uid,
          username: username,
          email: email,
          bio: "",
          profile_picture_url: "",
        });
      })
      .catch((error: any) => {
        alert("Account già esistente");
      });
  },

  login: function (email: any, password: any) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user
        localStorage.setItem("login", user.uid)
        this.isAuthenticated 
        window.location.reload();
      })
      .catch((error) => {
        alert("Email o password errate");
      });
  },

};