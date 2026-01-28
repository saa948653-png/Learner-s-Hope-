
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA79EwGYsLDBf2SAt-LmyoOA80PRjaMY0A",
  authDomain: "learner-s-hope.firebaseapp.com",
  projectId: "learner-s-hope",
  storageBucket: "learner-s-hope.firebasestorage.app",
  messagingSenderId: "683963542190",
  appId: "1:683963542190:web:5c449e857406a789ab1b3f",
  measurementId: "G-TVDFH9NNY9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
