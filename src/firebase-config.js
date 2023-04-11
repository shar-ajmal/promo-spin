// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

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

import  {GoogleAuthProvider,getAuth,signInWithPopup} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

// function uploaQRCode(file, userId) {
//   const storageRef = ref(storage, `/QRCode/${userId}`)
//   uploadBytes(storageRef, file).then(() => {console.log("img uploaded")});
// }

export async function getCustomClaimRole() {
  await auth.currentUser.getIdToken(true);
  const decodedToken = await auth.currentUser.getIdTokenResult();
  return decodedToken.claims.stripeRole;
}

const generateQRCode = (userId) => {
  console.log("In gen qr code")
  const urlString = 'https://api.qrserver.com/v1/create-qr-code/?data=http://promo-spin.web.app/spin/' + userId +'&size=100x100&format=png'
  console.log(urlString)
  fetch(urlString)
  .then(response => {
      console.log(response)
      console.log(response.url)
      // console.log(qrCodeImg)
      console.log("qr code gen")
      addDoc(collection(db, "qrCodes"), {
        user_id: userId,
        urlRef: urlString
      });
      // uploaQRCode(response.url, userId)
      // qrCodeImg.setAttribute('src',response.url)
  })
}

const generateUser = (user) => {
  console.log("In gen qr code")
  const firstGameID = uuidv4()
  const urlString = 'https://api.qrserver.com/v1/create-qr-code/?data=http://promo-spin.web.app/spin/' + firstGameID +'&size=200x200&format=png'
  console.log(urlString)
  fetch(urlString)
  .then(response => {
      console.log(response)
      console.log(response.url)
      // console.log(qrCodeImg)
      console.log("qr code gen")

      const userRef = doc(db, "users", user.uid);
      const userData = {
        user_id: user.uid,
        urlRef: urlString,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
        show_onboard_flow: true,
        business_name: ""
      }
      setDoc(userRef, userData);
      // addDoc(collection(db, "users"), {
      //   user_id: user.uid,
      //   urlRef: urlString,
      //   name: user.displayName,
      //   authProvider: "google",
      //   email: user.email,
      //   show_onboard_flow: true,
      //   business_name: ""
      // });
      // addDoc(collection(db, "games"), {
      //   user_id: user.uid,
      //   game_id: firstGameID,
      //   game_name: '',
      //   form_fields: [],
      //   wheel_fields:[]
      // });
      // uploaQRCode(response.url, userId)
      // qrCodeImg.setAttribute('src',response.url)
  })
}

export function standardizeData (list) {
  var fieldSet = new Set();
  var formEntries = []
  list.forEach((element) => {
      element['collected_info'].forEach((obj) => {
          var key = Object.keys(obj)[0];
          fieldSet.add(key)
      })
  })

  console.log("Printing out set")
  console.log(fieldSet)
  list.forEach((element) => {
      var formValue = {'prize': element['item_name']}
      var dateString = moment.unix(element['timestamp']).format("MM/DD/YYYY");

      formValue['date'] = dateString
      console.log("Testing")
      console.log(element['collected_info'])
      element['collected_info'].forEach((obj) => {
          console.log("NEW VALUE")
          var key = Object.keys(obj)[0];
          var value = obj[key];
          console.log(key)
          console.log(value)
          formValue[key] = value
      })

      fieldSet.forEach((element) => {
          console.log("PRINTING SET VAL")
          console.log(element)
          if (!(element in formValue)) {
              console.log("ADDING SET VAL")
              console.log(element)
              formValue[element] = ''
          }
      })
      console.log("pushing form value")
      console.log(formValue)
      formEntries.push(formValue)
  })
  console.log("printing form entries")
  console.log(formEntries)

  return formEntries
}

export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("user_id", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      generateUser(user)
      // await addDoc(collection(db, "users"), {
      //   uid: user.uid,
      //   name: user.displayName,
      //   authProvider: "google",
      //   email: user.email,
      // });

      // await addDoc(collection(db, "busName"), {
      //   user_id: user.uid,
      //   name: "",
      // });

      // generateQRCode(user.uid)
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

