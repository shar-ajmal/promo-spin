import { collection, getDocs, query, where, addDoc, doc, onSnapshot } from "firebase/firestore";
import getStripe from "./initializeStripe";
import { db, app } from "./firebase-config";
import { getFunctions, httpsCallable } from "firebase/functions";



export async function createCheckoutSession(uid) {

    console.log(uid)
    console.log(db)
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("user_id", "==", uid));
    const querySnapshot = await getDocs(q);
  
    if (querySnapshot.empty) {
      console.log(`User with UID ${uid} not found`);
      return;
    }
  
    // We assume that there's only one user with the given UID
    const userDoc = querySnapshot.docs[0];

  // Create a new checkout session in the subollection inside this user's document

  const sessionRef = collection(db, "users", userDoc.id, "checkout_sessions");

  const { id: checkoutSessionId } = await addDoc(sessionRef, {
    // replace the price_XXX value with the correct value from your product in stripe.
    price: "price_1MtdiVAFJ9qTOX9QC38xlXRZ",
    success_url: 'https://promo-spin-staging.web.app/',
    cancel_url: 'https://promo-spin-staging.web.app/',
  });

  const checkoutSessionRef = doc(sessionRef, checkoutSessionId);
  onSnapshot(checkoutSessionRef, async (snap) => {
    console.log(snap.data())
    const { sessionId } = snap.data();
    console.log(snap.data().sessionId)
    console.log(sessionId)
    if (snap.exists()) {
      const stripe = await getStripe();
      stripe.redirectToCheckout( {sessionId});
    }
  });
}

export function sendToCustomerPortal(uid) {

    // Get Firebase functions instance
    const functions = getFunctions(app);

  
    // Define your function reference
    const createPortalLink = httpsCallable(functions, 'ext-firestore-stripe-payments-createPortalLink');

        // Call the function
    createPortalLink({ returnUrl: 'https://promo-spin-staging.web.app/' })
    .then((result) => {
        window.location.assign(result.data.url);
    })
    .catch((error) => {
        console.error(error);
    });
  }
