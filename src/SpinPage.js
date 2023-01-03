
import Wheel from './Wheel';
import { useState, useEffect } from 'react';
import UserForm from './UserForm';
import NavbarUserForm from './NavbarUserForm';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore'
import { constructWheelArray } from './function';
import { db } from './firebase-config';

export default function SpinPage() {
    const [selectedItem, setSelectedItem] = useState(null)
    const [wheelElements, setWheelElements] = useState()
    const [busName, setBusName] = useState()

    const busNameCollectionRef = collection(db, 'busName')
    const tableCollectionRef = collection(db, 'table_values')

    const params = useParams()
    const userId = params.userId
    console.log("Printing user id of url")
    console.log(userId)

    useEffect(() => {
        if (userId != undefined) {
            getTableData()
            getBusData()
        }
    }, [])

    const getTableData = async() => {
        console.log("getting user dt")
        let data = await getDocs(query(tableCollectionRef, where("user_id", "==", userId)));
        console.log("Table elements")
        console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        var wheelArray = constructWheelArray(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        setWheelElements(wheelArray)
    }

    const getBusData = async() => {
        let data = await getDocs(query(busNameCollectionRef, where("user_id", "==", userId)));
        if (data != undefined) {
            // console.log(data.docs.map((doc) => ({...doc.data()}))[0])
            setBusName(data.docs.map((doc) => ({...doc.data()}))[0]['name'])
        }
    }
    
    function selectItemIndex() {
        const selectedItemIndex = Math.floor(Math.random() * wheelElements.length);
        setSelectedItem(selectedItemIndex)
        console.log(selectedItemIndex)
    }

    if(wheelElements != undefined) {
        return (
            <div>
                <NavbarUserForm busName={busName}></NavbarUserForm>
                <Wheel userId={userId} wheelElements={wheelElements} selectedItem={selectedItem}/> 
                {/* <UserForm wheelElements={wheelElements} selectItemIndex={selectItemIndex}></UserForm> */}
                {/* <button onClick={selectItemIndex}>test</button> */}
            </div>
        )
    }
    else return <div></div>
}