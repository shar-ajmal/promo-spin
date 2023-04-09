import { sendToCustomerPortal } from './createCheckoutSession';

export default function ManagePlanButton({user}) {
    return (
        <button onClick={() => sendToCustomerPortal(user.uid)}>Manage Plan</button>
    )
}