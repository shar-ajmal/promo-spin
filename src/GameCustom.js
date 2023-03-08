import React, { useState, useEffect } from "react";
import "./gamecustom.css";

import GameName from "./GameName";
import GameFields from "./GameFields";
import SpinWheel from "./SpinWheel";
import OptionTable from "./OptionTable";
import Navbar from "./Navbar";
import Settings from "./Settings";

import { collection, getDocs, query, where } from 'firebase/firestore'
import { constructWheelArray } from './function';
import { db } from './firebase-config';
import { useParams } from 'react-router-dom';


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

  return (
    <div className="screen-with-tabs">
        <Navbar user={user}/>
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
            <h2>Form Field Customization</h2>
            <h3>Game Name</h3>
            {gameData ? <GameName gameData={gameData} user={user} /> : <p>Loading...</p>}
            <h3>Game Form Fields</h3>
            {gameData ? <GameFields gameData={gameData} user={user} formFields={formFields} setFormFields={setFormFields}></GameFields> : <p>Loading...</p>}
            <h3>QR Code</h3>
            {gameData ? <Settings gameData={gameData}/> : <p>Loading...</p>}
        </div>
        <div class="section2">

            <h2>Spin Wheel Customization</h2>
            <SpinWheel wheelElements={wheelElements}/>
            {gameData ? <OptionTable user={user} wheelElements={wheelElements} gameData={gameData} setGameData={setGameData} setWheelElements={setWheelElements} tableValues={tableValues} setTableValues={setTableValues} tableCollectionRef={tableCollectionRef}/> : <p>Loading...</p>}
        </div>
      </div>
        <div className="tab-section">
        {activeTab === "tab1" && (
            <>
                <div>
                    <h3>Game Name</h3>
                    {gameData ? <GameName gameData={gameData} user={user} /> : <p>Loading...</p>}
                </div>
                <div>
                    <h3>Game Form Fields</h3>
                    {gameData ? <GameFields gameData={gameData} user={user} formFields={formFields} setFormFields={setFormFields}></GameFields> : <p>Loading...</p>}
                </div>
                <div>
                    <h3>QR Code</h3>
                    {gameData ? <Settings gameData={gameData}/> : <p>Loading...</p>}
                </div>
            </>
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