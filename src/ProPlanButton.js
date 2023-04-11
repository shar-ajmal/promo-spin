import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import { doc, collection, addDoc } from "firebase/firestore";
import { createCheckoutSession } from "./createCheckoutSession";
import {Button} from 'antd'
console.log("Logging stripe key")
console.log(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export default function ProPlanButton({user, plan}) {
  const [loading, setLoading] = useState(false)

  function handleClick() {
    setLoading(true)
  }
  return (
    <Button type="primary" onClick={() =>{createCheckoutSession(user.uid); handleClick();}}>
      {loading ? "Loading..." : "Upgrade to Pro"}
    </Button>
  );
}
