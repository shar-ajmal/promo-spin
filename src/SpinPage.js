
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
    const tableCollectionRef = collection(db, 'table_values')

    const params = useParams()
    const userId = params.userId
    console.log("Printing user id of url")
    console.log(userId)

    useEffect(() => {
        if (userId != undefined) {
            getTableData()
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
    
    function selectItemIndex() {
        const selectedItemIndex = Math.floor(Math.random() * wheelElements.length);
        setSelectedItem(selectedItemIndex)
        console.log(selectedItemIndex)
    }

    if(wheelElements != undefined) {
        return (
            <div>
                <NavbarUserForm></NavbarUserForm>
                <Wheel userId={userId} wheelElements={wheelElements} selectedItem={selectedItem}/> 
                {/* <UserForm wheelElements={wheelElements} selectItemIndex={selectItemIndex}></UserForm> */}
                {/* <button onClick={selectItemIndex}>test</button> */}
            </div>
        )
    }
    else return <div></div>
}