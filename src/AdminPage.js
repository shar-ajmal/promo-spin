import Wheel from './Wheel';
import OptionTable from './OptionTable'
import SpinWheel from './SpinWheel';
import Navbar from './Navbar';
import { useEffect, useInsertionEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore'
import { constructWheelArray } from './function';
import { db } from './firebase-config';

export default function AdminPage({user}) {
    const [tableValues, setTableValues] = useState([]);
    const [wheelElements, setWheelElements] = useState([]);
    const [busName, setBusName] = useState()

    const tableCollectionRef = collection(db, 'table_values')
    const busNameCollectionRef = collection(db, 'busName')

    useEffect(() => {
        console.log("Printing user info in admin page")
        console.log(user)
        console.log("done printing user info")
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
        let data = await getDocs(query(busNameCollectionRef, where("user_id", "==", user.uid)));
        console.log("in bus")
        // console.log(getBusName)
        console.log("printin yutoij")
        console.log(data)
        if (data === undefined || data.docs.map((doc) => ({...doc.data()}))[0]['name'] === "") {
            setBusName(<h3>Please add your buiness name via the info tab.</h3>)
        }
        else {
            setBusName(<h1>{data.docs.map((doc) => ({...doc.data()}))[0]['name']}</h1>)
        }
    }

    var message = <div></div>

    return (
        <div>
            <Navbar user={user}></Navbar>
            <div className='bus-name'>{busName}</div>
            <SpinWheel wheelElements={wheelElements}/>
            <OptionTable user={user} wheelElements={wheelElements} setWheelElements={setWheelElements} tableValues={tableValues} setTableValues={setTableValues} tableCollectionRef={tableCollectionRef}/>
        </div>
    );
}
