// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes } from "firebase/storage";

import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "@firebase/firestore";

import  {GoogleAuthProvider,getAuth,signInWithPopup} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVYKGhmks7UU_t0ZSqIF7SQvyhmm-CjA4",
  authDomain: "promo-spin.firebaseapp.com",
  projectId: "promo-spin",
  storageBucket: "promo-spin.appspot.com",
  messagingSenderId: "986158827674",
  appId: "1:986158827674:web:e3b6f28ca37624740d3723",
  measurementId: "G-J8GNW6WH0D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);


export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

// function uploaQRCode(file, userId) {
//   const storageRef = ref(storage, `/QRCode/${userId}`)
//   uploadBytes(storageRef, file).then(() => {console.log("img uploaded")});
// }

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
  const urlString = 'https://api.qrserver.com/v1/create-qr-code/?data=http://promo-spin.web.app/spin/' + user.uid +'&size=100x100&format=png'
  console.log(urlString)
  fetch(urlString)
  .then(response => {
      console.log(response)
      console.log(response.url)
      // console.log(qrCodeImg)
      console.log("qr code gen")
      addDoc(collection(db, "users"), {
        user_id: user.uid,
        urlRef: urlString,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
        show_onboard_flow: true,
        business_name: ""
      });
      // uploaQRCode(response.url, userId)
      // qrCodeImg.setAttribute('src',response.url)
  })
}
export const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
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

