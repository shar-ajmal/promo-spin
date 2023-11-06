import React, { useState, useEffect } from "react";
import "./gamecustom.css";

import GameName from "./GameName";
import GameFields from "./GameFields";
import SpinWheel from "./SpinWheel";
import OptionTable from "./OptionTable";
import Navbar from "./Navbar";
import Settings from "./Settings";
import GameInfo from "./GameInfo";
import GameNavBar from "./GameNavbar";
import UploadLogo from "./UploadLogo";

import { updateDataModelIfNeeded } from "./updateFunctions";

import { collection, getDocs, addDoc, query, where, updateDoc, doc } from 'firebase/firestore'
import { constructWheelArray } from './function';
import { db, storage } from './firebase-config';
import { useFetcher, useParams } from 'react-router-dom';
import { Button, Typography } from 'antd'

import { useNavigate } from "react-router-dom";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';



export default function GameCustom({user}) {
    const [activeTab, setActiveTab] = useState("tab1");
    const [formFields, setFormFields] = useState([{'fieldName': 'email', 'deletable': false, 'fieldId': 1}])
    const [tableValues, setTableValues] = useState([]);
    const [wheelElements, setWheelElements] = useState([]);
    const [gameName, setGameName] = useState()
    const [wheelColor, setWheelColor] = useState('')
    const [textColor, setTextColor] = useState('')
    const [displayName, setDisplayName] = useState(true)
    const [file, setFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [logoUrl, setLogoUrl] = useState('')


    const [gameData, setGameData] = useState()

    const tableCollectionRef = collection(db, 'table_values')
    const gamesCollectionRef = collection(db, 'games')

    const params = useParams()
    const gameId = params.gameId

    const navigate = useNavigate();

    const [winEmail, setWinEmail] = useState(
      'Thanks for playing with {game_name}. You have won {prize_name}. Show this email to the booth manager to claim your prize!\n\nBest Wishes,\n' + user.name
  )
  const winEmailCollectionRef = collection(db, 'win_emails')


  //   //Should not belong here but whatever
  //   useEffect(() => {
  //     getWinEmail()
  // }, [])

  const getWinEmail = async() => {
      console.log("Getting the win email")
      const data = await getDocs(query(winEmailCollectionRef, where('user_id', '==', user.uid)));
      if (!data.empty) {
          console.log("data exists")
          const doc = data.docs.map((doc) => ({...doc.data(), id:doc.id}))[0]
          console.log(doc)
          setWinEmail(doc.text)
      }
      else {
          console.log("data empty")
          await addDoc(winEmailCollectionRef, {'user_id': user.uid, 'text': winEmail});
      }
  }

  useEffect(() => {
    if (gameData != undefined) {
      const newFields = {
        wheelColor: '#333',
        textColor: '#ffffff',
        displayName: true,
        logoUrl: ''
      };

      console.log("printing game id")
      console.log(gameData.id)
      
      updateDataModelIfNeeded(gameData.id, newFields)
    }
  }, [gameData])

  useEffect(() => {
    if (gameData != undefined) {
      setWheelColor(gameData.wheelColor)
      setTextColor(gameData.textColor)
      setDisplayName(gameData.displayName)
    }
  }, [gameData])

  useEffect(() => {
    console.log("fetching logs")
    fetchFileUrl();
  }, [gameData]);

    useEffect(() => {
        console.log("Printing user info in custom game page")
        console.log(user)
        console.log("done printing user info")
        // setDisplayOnboarding(false)
        if (user != undefined) {
            getTableData()
            getGameData()
            getWinEmail()
        }
    }, [])

    useEffect(() => {
      if (gameData != undefined) {
        setGameName(gameData.game_name)
      }
    }, [gameData])

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

    const fetchFileUrl = async () => {
      const gameId = gameData.id
      console.log("inside fetch file")
      console.log(gameId)
      try {
        const fileRef = ref(storage, `userLogos/${gameId}/logo.png`);
        const url = await getDownloadURL(fileRef);
        setFile(url);
        setImagePreviewUrl(url)
      } catch (error) {
        console.error("Error fetching file URL: ", error);
      }
    };

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
          {gameData ? <GameInfo imagePreviewUrl={imagePreviewUrl} file={file} setFile={setFile} setImagePreviewUrl={setImagePreviewUrl} displayName={displayName} setDisplayName={setDisplayName} gameName={gameName} setGameName={setGameName} setWheelColor={setWheelColor} setTextColor={setTextColor} wheelColor={wheelColor} textColor={textColor} user={user} gameData={gameData}></GameInfo> : <p>Loading...</p>}
        </div>
        <div class="section2">

            <Typography.Title level={2} style={{ margin: 0 }}>
                Spin Wheel Customization
            </Typography.Title>
            <br></br>
            { gameData ? <GameNavBar imagePreviewUrl={imagePreviewUrl} displayName={displayName} gameName={gameName} wheelColor={wheelColor} textColor={textColor} gameData={gameData}></GameNavBar> : <p>Loading...</p>}
            <SpinWheel wheelElements={wheelElements} wheelColor={wheelColor} textColor={textColor}/>
            {gameData ? <OptionTable user={user} wheelElements={wheelElements} gameData={gameData} setGameData={setGameData} setWheelElements={setWheelElements} tableValues={tableValues} setTableValues={setTableValues} tableCollectionRef={tableCollectionRef}/> : <p>Loading...</p>}
        </div>
      </div>
        <div className="tab-section">
        {activeTab === "tab1" && (
            <div style={{padding: '20px'}}>
              {gameData ? <GameInfo imagePreviewUrl={imagePreviewUrl} file={file} setFile={setFile} setImagePreviewUrl={setImagePreviewUrl} displayName={displayName} setDisplayName={setDisplayName} gameName={gameName} setGameName={setGameName} setWheelColor={setWheelColor} setTextColor={setTextColor} wheelColor={wheelColor} textColor={textColor} user={user} gameData={gameData}></GameInfo> : <p>Loading...</p>}
            </div>
        )}
        {activeTab === "tab2" && (
          <div>
            <GameNavBar imagePreviewUrl={imagePreviewUrl} displayName={displayName} gameName={gameName} wheelColor={wheelColor} textColor={textColor} gameData={gameData}></GameNavBar>
            <SpinWheel wheelElements={wheelElements} wheelColor={wheelColor} textColor={textColor}/>
            <OptionTable user={user} wheelElements={wheelElements} gameData={gameData} setGameData={setGameData} setWheelElements={setWheelElements} tableValues={tableValues} setTableValues={setTableValues} tableCollectionRef={tableCollectionRef}/>

          </div>
        )}
        </div>
    </div>
  );
};