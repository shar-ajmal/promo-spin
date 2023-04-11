import { initializeApp } from "firebase/app";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  doc,
  setDoc,
} from "@firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyDH5E0czNAAbRleyvnKdA_1PhY-PHVz4dY",
  authDomain: "promo-spin-staging.firebaseapp.com",
  projectId: "promo-spin-staging",
  storageBucket: "promo-spin-staging.appspot.com",
  messagingSenderId: "896961729195",
  appId: "1:896961729195:web:17cfefab5b58dae5d21dee",
  measurementId: "G-E485M38X0S"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

const usersCollection = collection(db, "users")

getDocs(usersCollection).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  })
  .catch((error) => {
    console.log("Error getting documents: ", error);
  });
