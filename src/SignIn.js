import React from 'react'
import {signInWithGoogle} from './firebase-config'

export default function SignInPage() {

    return (
        <div>
            <button onClick={signInWithGoogle}>Sign in w/ Google</button>
        </div>
    )
}