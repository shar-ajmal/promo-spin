import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore'
import { db } from "./firebase-config";
import { Input } from 'antd';
import "./gamecustom.css";

export default function GameName({gameName, setGameName, user, gameId}) {
    // const [gameName, setGameName] = useState()
    // console.log("inside game name")
    // console.log(gameData)

    // useEffect(() => {
    //     console.log("inside game name")
    //     console.log(gameData)
    //     setGameName(gameData.game_name)
    // }, [])

    function handleChange(e) {
        setGameName(e.target.value)
    }


    return (
        <div className="input-container">
            <Input value={gameName} onChange={handleChange}></Input>
            {/* <input value={gameName} onChange={handleChange}/> */}
            {/* <button onClick={saveGameName}>Save</button> */}
        </div>
    )
}