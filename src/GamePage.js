import { useState, useEffect } from 'react'
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore'
import { db } from './firebase-config'
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import GameCard from './GameCard';
import { Button, Typography } from 'antd'
import { v4 as uuidv4 } from 'uuid';
import { getCustomClaimRole } from './firebase-config';
export default function GamePage({user}) {
    const [gameArray, setGameArray] = useState([])
    const [role, setRole] =  useState([])
    const gamesCollectionRef = collection(db, 'games')
    const navigate = useNavigate();

    async function getRole() {
        console.log("ROLE")
        const value = await getCustomClaimRole();
        console.log(value)
        setRole(value)
    }

    useEffect(() => {
        getRole()
    }, [])

    useEffect(() => {
        getGameData()
    }, [role])

    const getGameData = async() => {
        console.log("getting user dt")
        let data = await getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid)));
        console.log("Game elements")
        console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        var gameList = data.docs.map((doc) => ({...doc.data(), id:doc.id}))
        var enabledGameList = gameList.filter(game => game.game_enabled || game.game_enabled === undefined)
        console.log("Game Role")
        console.log(enabledGameList)
        console.log(role)
        if (role === "pro") {
            setGameArray(enabledGameList)
        }
        else{
            if (enabledGameList.length != 0) {
                var newGameList = [enabledGameList[0]]
                setGameArray(newGameList)
            }
        }
        
    }

    const redirect = (gameId) => {
        const gameUrl = "/game/" + gameId
        navigate(gameUrl)
    }

    function createGame() {
        console.log("Getting role")
        console.log(role)
        if (role === 'pro') {
            const newGameId = uuidv4()
            const qrCodeString = 'https://api.qrserver.com/v1/create-qr-code/?data=http://promo-spin-staging.web.app/spin/' + newGameId +'&size=200x200&format=png'
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
        else {
            alert("Upgrade your plan to pro to create new games!")
        }
    }

    return (
        <div>
            <Navbar user={user}></Navbar>
            <Typography.Title level={1} style={{ margin: 0 }}>
                Game Dashboard
            </Typography.Title>
            <div class="top-button-container">
                <Button type='primary' onClick={createGame} size='large'>Create New Game +</Button>
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