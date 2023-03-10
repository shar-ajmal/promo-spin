import { useState, useEffect } from 'react'
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore'
import { db } from './firebase-config'
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import GameCard from './GameCard';

import { v4 as uuidv4 } from 'uuid';

export default function GamePage({user}) {
    const [gameArray, setGameArray] = useState([])
    const gamesCollectionRef = collection(db, 'games')
    const navigate = useNavigate();

    useEffect(() => {
        getGameData()
    }, [])

    const getGameData = async() => {
        console.log("getting user dt")
        let data = await getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid)));
        console.log("Game elements")
        console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        var gameList = data.docs.map((doc) => ({...doc.data(), id:doc.id}))
        var enabledGameList = gameList.filter(game => game.game_enabled || game.game_enabled === undefined)
        setGameArray(enabledGameList)
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
            'wheel_fields': [{'name': 'item1', 'probability': 50, 'id': uuidv4()}, {'name': 'item2', 'probability': 50, 'id': uuidv4()}],
            'qr_code': qrCodeString, 
            'game_enabled': true
        })

        const gameUrl = "/game/" + newGameId
        navigate(gameUrl)
    }

    return (
        <div>
            <Navbar user={user}></Navbar>
            <h1>Game Dashboard</h1>
            <div class="top-button-container">
                <button onClick={createGame}>Create New Game</button>
            </div>
            <div>
                <div className='card-list'>
                    {gameArray.map((element, index) => {
                        return (
                            <GameCard gameInfo={element}></GameCard>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}