import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { doc, collection, addDoc } from "firebase/firestore";
import { createCheckoutSession } from "./createCheckoutSession";
console.log("Logging stripe key")
console.log(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export default function ProPlanButton({user, plan}) {

//   const handleUpgradeClick = async () => {
//     const stripe = await stripePromise;


//     // Get a reference to the subcollection
// const subcollectionRef = collection(db, 'stripe', user.uid, 'checkout_sessions');

// // Create a new document within the subcollection
// const sessionRef = doc(subcollectionRef);
// const sessionData = {
//   price: 'price id',
//   success_url: 'https://localhost:3000/success',
//   cancel_url: 'https://localhost:3000/fail',
// };
// const session = await addDoc(sessionRef, sessionData);

//     // Redirect the user to the Stripe Checkout page
//     const result = await stripe.redirectToCheckout({
//       sessionId: session.id,
//     });

//     // Handle the result of the Stripe Checkout session
//     if (result.error) {
//       console.error(result.error.message);
//       // Show an error message to the user
//     } else {
//       // Show a success message to the user
//       console.log("Success!")
//     }
//   };

  return (
    <button onClick={() =>createCheckoutSession(user.uid)}>Upgrade to Premium</button>
  );
}
