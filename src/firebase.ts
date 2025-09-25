import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDlttLZkUIGgu7s4GG0foBXaHEEjdaswVQ",
  authDomain: "auth-evius.firebaseapp.com",
  databaseURL: "https://auth-evius-default-rtdb.firebaseio.com",
  projectId: "auth-evius",
  storageBucket: " auth-evius.appspot.com",
  messagingSenderId: "116406599326",
  appId: "1:116406599326:web:7d15cbe4b73007a1dd858f",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
