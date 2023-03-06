import { useState, useEffect } from 'react'
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore'
import { db } from './firebase-config'
import { useNavigate } from "react-router-dom";

import { v4 as uuidv4 } from 'uuid';

export default function GamePage({user}) {
    const [gameArray, setGameArray] = useState([])
    const gamesCollectionRef = collection(db, 'games')
    const navigate = useNavigate();

    useEffect(() => {
        getTableData()
    }, [])

    const getTableData = async() => {
        console.log("getting user dt")
        let data = await getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid)));
        console.log("Table elements")
        console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        setGameArray(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
    }

    const redirect = (gameId) => {
        const gameUrl = "/game/" + gameId
        navigate(gameUrl)
    }

    function createGame() {
        const newGameId = uuidv4()
        const qrCodeString = 'https://api.qrserver.com/v1/create-qr-code/?data=http://promo-spin.web.app/spin/' + newGameId +'&size=200x200&format=png'
        addDoc(gamesCollectionRef, {
            'user_id': user.uid, 
            'game_id': newGameId, 
            'game_name': '[NEW GAME]', 
            'form_fields': [{'fieldName': 'email', 'deletable': false, 'fieldId': 1}],
            'wheel_fields': [{'name': 'item1', 'probability': 50}, {'name': 'item2', 'probability': 50}],
            'qr_code': qrCodeString
        })

        const gameUrl = "/game/" + newGameId
        navigate(gameUrl)
    }

    return (
        <div>
            <h1>Game Dashboard</h1>
            {gameArray.map((element, index) => {
                return ( 
                    <div>
                        {element.game_name === '' ? "INSERT NAME" : element.game_name}
                        <button onClick={() => redirect(element.game_id)}>View Game</button>
                    </div>
                )
            })}
            <button onClick={createGame}>Create New Game</button>
        </div>
    )
}