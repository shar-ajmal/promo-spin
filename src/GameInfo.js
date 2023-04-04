import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc, query, where} from 'firebase/firestore'
import { db } from "./firebase-config";
import { v4 as uuidv4 } from 'uuid';
import { Input, Button, Space, Typography } from 'antd';

import GameName from "./GameName";
import GameFields from "./GameFields";
import Settings from "./Settings";

import "./gamecustom.css";

export default function GameInfo ({user, gameData}) {
    const [formFields, setFormFields] = useState([])
    const [gameName, setGameName] = useState()

    useEffect(() => {
        setFormFields(gameData.form_fields)
        setGameName(gameData.game_name)
    }, [])

    function save() {
        saveGameName()
        saveGameFields()
    }

    const saveButtonStyle = {
        background: '#52c41a',
    borderColor: '#52c41a',
    color: '#fff',
    fontWeight: 500,
    transition: 'all 0.3s ease-in-out',
    float: 'right'
      };

      const hoverStyle = {
        background: '#5eff5e',
        borderColor: '#5eff5e',
        transition: 'all 0.3s ease-in-out',
      };

    const saveGameFields = async() => {
        const gamesCollectionRef = collection(db, 'games');
        const docRef = await getDocs(query(gamesCollectionRef, where('user_id', '==', user.uid), where('game_id', '==', gameData.game_id)));
        getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid), where('game_id', '==', gameData.game_id))).then((res) => {
            const docRef = doc(db, "games", res.docs[0].id);
            console.log(docRef)
            updateDoc(docRef, { 'form_fields': formFields });
        })
        if (docRef.empty) {
            console.log('No matching documents.');
            return;
        }
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
            <Typography.Title level={2} style={{ margin: 0 }}>
                Form Field Customization
            </Typography.Title>
            <br></br>

            <Typography.Title level={3} style={{ margin: 0 }}>
                Game Name
            </Typography.Title>
            {/* {gameData ? <GameName gameData={gameData} user={user} /> : <p>Loading...</p>} */}
            {gameData ? <GameName gameName={gameName} setGameName={setGameName} user={user} /> : <p>Loading...</p>}
            <br></br>

            <Typography.Title level={3} style={{ margin: 0 }}>
                Game Form Fields
            </Typography.Title>
            {gameData ? <GameFields gameData={gameData} user={user} formFields={formFields} setFormFields={setFormFields}></GameFields> : <p>Loading...</p>}
            <br></br>
            <Button className='save-button' style={saveButtonStyle}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = hoverStyle.background;
                    e.currentTarget.style.borderColor = hoverStyle.borderColor;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = saveButtonStyle.background;
                    e.currentTarget.style.borderColor = saveButtonStyle.borderColor;
                }}
            onClick={save}>Save</Button>
            <br></br>
            <Typography.Title level={3} style={{ margin: 0 }}>
                QR Code
            </Typography.Title>
            <br></br>
            {gameData ? <Settings gameData={gameData}/> : <p>Loading...</p>}
            

        </div>
    )



}