
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
    const [gameData, setGameData] = useState([])

    // const busNameCollectionRef = collection(db, 'busName')
    const userCollectionRef = collection(db, 'users')
    const tableCollectionRef = collection(db, 'table_values')
    const gamesCollectionRef = collection(db, 'games')

    const params = useParams()
    const gameId = params.gameId
    console.log("Printing user id of url")
    console.log(gameId)

    useEffect(() => {
        if (gameId != undefined) {
            // getTableData()
            // getBusData()
            getGameData()
        }
    }, [])

    const getGameData = async() => {
        let data = await getDocs(query(gamesCollectionRef, where("game_id", "==", gameId)));
        console.log("Game elements")
        console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        setGameData(data.docs.map((doc) => ({...doc.data(), id:doc.id}))[0])
        var wheelArray = constructWheelArray(data.docs.map((doc) => doc.data().wheel_fields)[0])
        setWheelElements(wheelArray)
    }

    // const getTableData = async() => {
    //     console.log("getting user dt")
    //     let data = await getDocs(query(tableCollectionRef, where("game_id", "==", gameId)));
    //     console.log("Table elements")
    //     console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
    //     var wheelArray = constructWheelArray(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
    //     setWheelElements(wheelArray)
    // }

    // const getBusData = async() => {
    //     let data = await getDocs(query(userCollectionRef, where("game_id", "==", gameId)));
    //     if (data != undefined) {
    //         // console.log(data.docs.map((doc) => ({...doc.data()}))[0])
    //         setBusName(data.docs.map((doc) => ({...doc.data()}))[0]['business_name'])
    //     }
    // }
    
    function selectItemIndex() {
        const selectedItemIndex = Math.floor(Math.random() * wheelElements.length);
        setSelectedItem(selectedItemIndex)
        console.log(selectedItemIndex)
    }

    if(wheelElements != undefined) {
        return (
            <div>
                <NavbarUserForm busName={gameData.game_name}></NavbarUserForm>
                <Wheel gameId={gameId} gameData={gameData}  wheelElements={wheelElements} selectedItem={selectedItem}/> 
                {/* <UserForm wheelElements={wheelElements} selectItemIndex={selectItemIndex}></UserForm> */}
                {/* <button onClick={selectItemIndex}>test</button> */}
            </div>
        )
    }
    else return <div></div>
}