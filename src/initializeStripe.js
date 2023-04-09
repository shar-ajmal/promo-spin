import { Stripe, loadStripe } from "@stripe/stripe-js";

const initializeStripe = async () => {
    let stripePromise = null;
  if (!stripePromise) {
    stripePromise = await loadStripe(
        process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
    );
  }
  return stripePromise;
};
export default initializeStripe;