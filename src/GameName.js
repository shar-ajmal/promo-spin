import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore'
import { db } from "./firebase-config";
import "./gamecustom.css";

export default function GameName({gameData, user, gameId}) {
    const [gameName, setGameName] = useState()
    console.log("inside game name")
    console.log(gameData)

    useEffect(() => {
        console.log("inside game name")
        console.log(gameData)
        setGameName(gameData.game_name)
    }, [])

    function handleChange(e) {
        setGameName(e.target.value)
    }

    const saveGameName = async () => {
        const gamesCollectionRef = collection(db, 'games');
        const docRef = await getDocs(query(gamesCollectionRef, where('user_id', '==', user.uid), where('game_id', '==', gameData.game_id)));
        getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid), where('game_id', '==', gameData.game_id))).then((res) => {
            const docRef = doc(db, "games", res.docs[0].id);
            console.log(docRef)
            updateDoc(docRef, { 'game_name': gameName });
        })
        if (docRef.empty) {
            console.log('No matching documents.');
            return;
        }
        // console.log("game name update")
        // console.log(gameName)
    }

    return (
        <div>
            <input value={gameName} onChange={handleChange}/>
            <button onClick={saveGameName}>Save</button>
        </div>
    )
}