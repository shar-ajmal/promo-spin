
import Wheel from './Wheel';
import { useState, useEffect } from 'react';
import UserForm from './UserForm';
import NavbarUserForm from './NavbarUserForm';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore'
import { constructWheelArray } from './function';
import { db, storage } from './firebase-config';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export default function SpinPage() {
    const [selectedItem, setSelectedItem] = useState(null)
    const [wheelElements, setWheelElements] = useState()
    const [busName, setBusName] = useState()
    const [gameData, setGameData] = useState([])
    const [apothec, setApothec] = useState(false)
    const [userId, setUserId] = useState('')

    const [wheelColor, setWheelColor] = useState('')
    const [textColor, setTextColor] = useState('')
    const [logo, setLogo] = useState('')
    const [gameName, setGameName] = useState('')

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

    useEffect(() => {
        if (gameData != undefined) {

        // fetchFileUrl()
        setGameName(gameData.game_name)
        setTextColor(gameData.textColor)
        setWheelColor(gameData.wheelColor)
        setLogo(gameData.logoURL)
        }
    }, [gameData])

    const fetchFileUrl = async () => {
        const gameId = gameData.id
        console.log("inside fetch file")
        console.log(gameId)
        console.log("getting gameId")
        console.log(gameData)
        console.log(gameData.id)
        try {
          const fileRef = ref(storage, `userLogos/${gameId}/logo.png`);
          const url = await getDownloadURL(fileRef);
          setLogo(url);
        } catch (error) {
          console.error("Error fetching file URL: ", error);
        }
      };

    const getGameData = async() => {
        let data = await getDocs(query(gamesCollectionRef, where("game_id", "==", gameId)));
        console.log("Game elements")
        console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        var dataClean = data.docs.map((doc) => ({...doc.data(), id:doc.id}))[0]
        if (dataClean.user_id == "Su5PLb3DQeOsRWbqfAFB6Bl8D6F2") {
            setApothec(true)
        }
        setGameData(data.docs.map((doc) => ({...doc.data(), id:doc.id}))[0])
        var wheelArray = constructWheelArray(data.docs.map((doc) => doc.data().wheel_fields)[0])
        setWheelElements(wheelArray)
    }

    if(wheelElements != undefined) {
        return (
            <div>
                <NavbarUserForm logo={logo} wheelColor={wheelColor} textColor={textColor} gameName={gameName} apothec={apothec} gameData={gameData} busName={gameData.game_name}></NavbarUserForm>
                <Wheel wheelColor={wheelColor} textColor={textColor} apothec={apothec} gameId={gameId} gameData={gameData}  wheelElements={wheelElements} selectedItem={selectedItem}/> 
            </div>
        )
    }
    else return <div></div>
}