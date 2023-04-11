import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";
import { Typography } from 'antd';
import ManagePlanButton from './ManagePlanButton';
import ProPlanButton from './ProPlanButton'
import { getCustomClaimRole } from './firebase-config';
import { useEffect, useState } from "react";
import OnboardingModal from "./Onboarding";
import { collection, getDoc, query, where, doc, updateDoc } from 'firebase/firestore'
import { db } from "./firebase-config";


import './navbar.css'

export default function Navbar({user}) {
    const navigate = useNavigate();
    const [role, setRole] =  useState([])
    const [showOnboarding, setShowOnboarding] = useState(false)


    async function getRole() {
        console.log("ROLE")
        const value = await getCustomClaimRole();
        console.log(value)
        setRole(value)
    }

    async function firstTimeUserOnboarding() {
        const docRef = doc(db, 'users', user.uid)
        let dataSnapshot = await getDoc(docRef)
        let data = dataSnapshot.data()
        console.log("printing user data")
        console.log(data)
        if(data['show_onboard_flow']) {
            setShowOnboarding(true)
        }
    }

    useEffect(() => {
        getRole()
    }, [])

    useEffect(() => {
        firstTimeUserOnboarding()
    }, [])

    function enableOnboarding() {
        setShowOnboarding(true)
    }

    const handleBack = (page) => {
        navigate(page)
    }


    return(
        <div class="topnav">
            {/* <a class="category" onClick={() => handleBack('/')}>Admin</a>
            <a class="category" onClick={() => handleBack('/emails')}>Emails</a>
            <a class="category" onClick={() => handleBack('/chart')}>Chart</a>
            <a class="logout" onClick={() => auth.signOut()}>Logout</a> */}
            { showOnboarding ? <OnboardingModal setShowOnboarding={setShowOnboarding} user={user}></OnboardingModal> : <div></div>}
            <div class="category" onClick={() => handleBack('/')}>
                <Typography.Title level={5} style={{ margin: 0, color: 'white' }}>
                    Admin
                </Typography.Title>
            </div>
            <div class="category" onClick={() => handleBack('/emails')}>
                <Typography.Title level={5} style={{ margin: 0, color: 'white' }}>
                    Emails
                </Typography.Title>
            </div>
            <div class="category" onClick={() => handleBack('/chart')}>
                <Typography.Title level={5} style={{ margin: 0, color: 'white' }}>
                    Chart
                </Typography.Title>
            </div>
            <div class="category" onClick={enableOnboarding}>
                <Typography.Title level={5} style={{ margin: 0, color: 'white' }}>
                    Help
                </Typography.Title>
            </div>
            <div class="category">
                {role == "pro" ? <ManagePlanButton user={user}></ManagePlanButton> : <ProPlanButton user={user}></ProPlanButton>}
            </div>
            <div class="logout" onClick={() => auth.signOut()}>
                <Typography.Title level={5} style={{ margin: 0, color: 'white' }}>
                    Logout
                </Typography.Title>
            </div>
        </div>
    )
}