import React, { useState, useEffect } from "react";
import "./gamecustom.css";

import GameName from "./GameName";
import GameFields from "./GameFields";
import SpinWheel from "./SpinWheel";
import OptionTable from "./OptionTable";
import Navbar from "./Navbar";
import Settings from "./Settings";
import GameInfo from "./GameInfo";

import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore'
import { constructWheelArray } from './function';
import { db } from './firebase-config';
import { useParams } from 'react-router-dom';
import { Button, Typography } from 'antd'

import { useNavigate } from "react-router-dom";


export default function GameCustom({user}) {
    const [activeTab, setActiveTab] = useState("tab1");
    const [formFields, setFormFields] = useState([{'fieldName': 'email', 'deletable': false, 'fieldId': 1}])
    const [tableValues, setTableValues] = useState([]);
    const [wheelElements, setWheelElements] = useState([]);
    const [gameName, setGameName] = useState()

    const [gameData, setGameData] = useState()

    const tableCollectionRef = collection(db, 'table_values')
    const gamesCollectionRef = collection(db, 'games')

    const params = useParams()
    const gameId = params.gameId

    const navigate = useNavigate();


    useEffect(() => {
        console.log("Printing user info in custom game page")
        console.log(user)
        console.log("done printing user info")
        // setDisplayOnboarding(false)
        if (user != undefined) {
            getTableData()
            getGameData()
        }
    }, [])

    const getTableData = async() => {
        console.log("getting user dt")
        let data = await getDocs(query(tableCollectionRef, where("user_id", "==", user.uid)));
        console.log("Custom Game Table elements")
        console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        setTableValues(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        var wheelArray = constructWheelArray(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        setWheelElements(wheelArray)
        console.log("table values")
        console.log(tableValues)
    }

    const getGameData = async() => {
        console.log("Getting game data query params")
        console.log(user.uid)
        console.log(gameId)
        let gameData = await getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid), where("game_id", "==", gameId)));
        console.log("getting game data")
        console.log(gameData.docs.map((doc) => ({...doc.data(), id:doc.id}))[0])
        setGameData(gameData.docs.map((doc) => ({...doc.data(), id:doc.id}))[0])
        console.log("printing form wheel data")
        var wheelArray = constructWheelArray(gameData.docs.map((doc) => doc.data().wheel_fields)[0])
        setWheelElements(wheelArray)
    }
  

    console.log(user)
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const deleteData = async() => {
        getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid), where('game_id', '==', gameId))).then((res) => {
            const docRef = doc(db, "games", res.docs[0].id);
            console.log(docRef)
            updateDoc(docRef, {'game_enabled': false})
                .then(() => {
                console.log("Document successfully deleted!");
                navigate('/')
                })
                .catch((error) => {
                console.error("Error removing document: ", error);
                });
        })
    }

    function deleteGame() {
        var response = window.confirm("Are you sure you want to delete this game? You'll lost the QR code associated with the game.")

        if (response) {
            deleteData()
        }
        else {
            // alert("Denied")
        }

    }

    // const handleBack = (page) => {
    //     navigate(page)
    // }

  return (
    <div className="screen-with-tabs">
        <Navbar user={user}/>
        <div class="top-button-container">
            <Button onClick={() => navigate('/')}> {"<- Back"}</Button>
            <Button danger onClick={deleteGame}>Delete Game</Button>
        </div>
      <div className="tabs">
        <button
          className={`tab ${activeTab === "tab1" ? "active" : ""}`}
          onClick={() => handleTabClick("tab1")}
        >
          Form Field
        </button>
        <button
          className={`tab ${activeTab === "tab2" ? "active" : ""}`}
          onClick={() => handleTabClick("tab2")}
        >
          Spin Wheel
        </button>
      </div>
      <div className="desktop-elements">
        <div class="section1">
            {gameData ? <GameInfo user={user} gameData={gameData}></GameInfo> : <p>Loading...</p>}
            {/* <Typography.Title level={2} style={{ margin: 0 }}>
                Form Field Customization
            </Typography.Title>
            <br></br>

            <Typography.Title level={3} style={{ margin: 0 }}>
                Game Name
            </Typography.Title>
            {gameData ? <GameName gameData={gameData} user={user} /> : <p>Loading...</p>}
            <br></br>

            <Typography.Title level={3} style={{ margin: 0 }}>
                Game Form Fields
            </Typography.Title>
            {gameData ? <GameFields gameData={gameData} user={user} formFields={formFields} setFormFields={setFormFields}></GameFields> : <p>Loading...</p>}
            <br></br>
            
            <Typography.Title level={3} style={{ margin: 0 }}>
                QR Code
            </Typography.Title>
            {gameData ? <Settings gameData={gameData}/> : <p>Loading...</p>} */}
        </div>
        <div class="section2">

            <Typography.Title level={2} style={{ margin: 0 }}>
                Spin Wheel Customization
            </Typography.Title>
            <br></br>
            <SpinWheel wheelElements={wheelElements}/>
            {gameData ? <OptionTable user={user} wheelElements={wheelElements} gameData={gameData} setGameData={setGameData} setWheelElements={setWheelElements} tableValues={tableValues} setTableValues={setTableValues} tableCollectionRef={tableCollectionRef}/> : <p>Loading...</p>}
        </div>
      </div>
        <div className="tab-section">
        {activeTab === "tab1" && (
            <div style={{padding: '20px'}}>
                {gameData ? <GameInfo user={user} gameData={gameData}></GameInfo> : <p>Loading...</p>}
            </div>
        )}
        {activeTab === "tab2" && (
          <div>
            <SpinWheel wheelElements={wheelElements}/>
            <OptionTable user={user} wheelElements={wheelElements} gameData={gameData} setGameData={setGameData} setWheelElements={setWheelElements} tableValues={tableValues} setTableValues={setTableValues} tableCollectionRef={tableCollectionRef}/>

          </div>
        )}
        </div>
    </div>
  );
};