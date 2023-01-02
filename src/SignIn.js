import React from 'react'
import {signInWithGoogle} from './firebase-config'

export default function SignInPage() {

    return (
        <div class="signin-container">
            <div>
                <h1>Welcome to Promo-Spin</h1>
                <p>Please Sign-In/Sign-Up</p>
            </div>
            <button class="button-blue "onClick={signInWithGoogle}>Sign in w/ Google</button>
        </div>
    )
}