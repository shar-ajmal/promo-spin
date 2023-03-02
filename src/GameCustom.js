import React, { useState, useEffect } from "react";
import "./gamecustom.css";

import GameName from "./GameName";
import GameFields from "./GameFields";
import SpinWheel from "./SpinWheel";
import { collection, getDocs, query, where } from 'firebase/firestore'
import { constructWheelArray } from './function';
import { db } from './firebase-config';

export default function GameCustom({user}) {
    const [activeTab, setActiveTab] = useState("tab1");
    const [formFields, setFormFields] = useState([{'fieldName': 'email', 'deletable': false, 'fieldId': 1}])
    const [tableValues, setTableValues] = useState([]);
    const [wheelElements, setWheelElements] = useState([]);
    const [gameName, setGameName] = useState()

    const tableCollectionRef = collection(db, 'table_values')


    useEffect(() => {
        console.log("Printing user info in custom game page")
        console.log(user)
        console.log("done printing user info")
        // setDisplayOnboarding(false)
        if (user != undefined) {
            getTableData()
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
  

    console.log(user)
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="screen-with-tabs">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "tab1" ? "active" : ""}`}
          onClick={() => handleTabClick("tab1")}
        >
          Tab 1
        </button>
        <button
          className={`tab ${activeTab === "tab2" ? "active" : ""}`}
          onClick={() => handleTabClick("tab2")}
        >
          Tab 2
        </button>
      </div>
      <div className="elements">
        <div class="section1">
            <h3>Game Name</h3>
            <GameName gameName={gameName} setGameName={setGameName}></GameName>
        </div>
        <div class="section2">
            <h3>Game Form Fields</h3>
            <GameFields formFields={formFields} setFormFields={setFormFields}></GameFields>
        </div>
        <div>
            <h3>Spin Wheel</h3>
            <SpinWheel wheelElements={wheelElements}/>
        </div>
        </div>
        <div className="tab-section">
        {activeTab === "tab1" && (
            <>
                <div>
                    <h3>Game Name</h3>
                    <GameName gameName={gameName} setGameName={setGameName}></GameName>
                </div>
                <div>
                    <h3>Game Form Fields</h3>
                    <GameFields formFields={formFields} setFormFields={setFormFields}></GameFields>
                </div>
            </>
        )}
        {activeTab === "tab2" && (
          <div>
            <SpinWheel wheelElements={wheelElements}/>
          </div>
        )}
        </div>
    </div>
  );
};