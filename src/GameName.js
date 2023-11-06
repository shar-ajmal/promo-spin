import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore'
import { db } from "./firebase-config";
import { Input, Switch } from 'antd';
import "./gamecustom.css";

export default function GameName({gameName, setGameName, user, gameId, displayName, setDisplayName}) {
    // const [gameName, setGameName] = useState()
    // console.log("inside game name")
    // console.log(gameData)

    // useEffect(() => {
    //     console.log("inside game name")
    //     console.log(gameData)
    //     setGameName(gameData.game_name)
    // }, [])

    console.log("looking at display name")
    console.log(displayName)

    function handleChange(e) {
        setGameName(e.target.value)
    }

    function onChange() {
        setDisplayName(!displayName)
    }


    return (
        <div className="input-container">
            <Input value={gameName} onChange={handleChange}></Input>
            <Switch checked={displayName} onChange={onChange}></Switch>
            {/* <input value={gameName} onChange={handleChange}/> */}
            {/* <button onClick={saveGameName}>Save</button> */}
        </div>
    )
}