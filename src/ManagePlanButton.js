import { sendToCustomerPortal } from './createCheckoutSession';
import { Button } from 'antd';
import { useState } from 'react';
export default function ManagePlanButton({user}) {
    const [loading, setLoading] = useState(false)

    function handleClick() {
        setLoading(true)
    }
    return (
        <Button type="primary" onClick={() => {sendToCustomerPortal(user.uid); handleClick();}}>
            {loading ? "Loading..." : "Manage Plan"}
        </Button>
    )
}