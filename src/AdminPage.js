import Wheel from './Wheel';
import OptionTable from './OptionTable'
import SpinWheel from './SpinWheel';
import Navbar from './Navbar';
import { useEffect, useInsertionEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore'
import { constructWheelArray } from './function';
import { db } from './firebase-config';
import RemainingProb from './RemainingProb';
import * as Modal from 'react-modal';
// import {OnboardingModal} from 'onboarding-react'
import OnboardingModal from './Onboarding';

export default function AdminPage({user}) {
    const [tableValues, setTableValues] = useState([]);
    const [wheelElements, setWheelElements] = useState([]);
    const [displayOnboarding, setDisplayOnboarding] = useState([]);

    const [busName, setBusName] = useState()

    const tableCollectionRef = collection(db, 'table_values')
    const userCollectionRef = collection(db, 'users')

    useEffect(() => {
        console.log("Printing user info in admin page")
        console.log(user)
        console.log("done printing user info")
        // setDisplayOnboarding(false)
        if (user != undefined) {
            getTableData()
            getBusName()
        }
    }, [])

    const getTableData = async() => {
        console.log("getting user dt")
        let data = await getDocs(query(tableCollectionRef, where("user_id", "==", user.uid)));
        console.log("Table elements")
        console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        setTableValues(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        var wheelArray = constructWheelArray(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        setWheelElements(wheelArray)
        console.log("table values")
        console.log(tableValues)
    }

    const getBusName = async() => {
        let data = await getDocs(query(userCollectionRef, where("user_id", "==", user.uid)));
        console.log("in bus")
        // console.log(getBusName)
        var snap = data.docs.map((doc) => ({...doc.data()}))[0]
        setDisplayOnboarding(snap['show_onboard_flow'])
        if (snap['business_name'] === "") {
            setBusName(<h3>Please add your buiness name via the info tab.</h3>)
        }
        else {
            setBusName(<h1>{snap['business_name']}</h1>)
        }
    }


    return (
        <div>
            <Navbar user={user}></Navbar>
            {displayOnboarding? 
            <OnboardingModal setDisplayOnboarding={setDisplayOnboarding} user={user}></OnboardingModal>
            :
            <div></div>
          }
            <div className='bus-name'>{busName}</div>
            <SpinWheel wheelElements={wheelElements}/>
            <OptionTable user={user} wheelElements={wheelElements} setWheelElements={setWheelElements} tableValues={tableValues} setTableValues={setTableValues} tableCollectionRef={tableCollectionRef}/>
        </div>
    );
}
