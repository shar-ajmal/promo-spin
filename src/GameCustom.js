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
import { createAlternatingArrayWithDuplicates } from "./function";

import { updateDataModelIfNeeded } from "./updateFunctions";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';


import { collection, getDocs, addDoc, query, where, updateDoc, doc } from 'firebase/firestore'
import { constructWheelArray, validEntries } from './function';
import { db, storage } from './firebase-config';
import { useFetcher, useParams } from 'react-router-dom';
import { Button, Typography, Checkbox } from 'antd'

import { useNavigate } from "react-router-dom";


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
    const [fbPage, setFBPage] = useState('')
    const [igHandle, setIGHandle] = useState('')
    const [randomCheck, setRandomCheck] = useState(false)
    const [randomArray, setRandomArray] = useState([])
    const [displayItems, setDisplayItems] = useState([])
    const [consent, setConsent] = useState(true)

    const { Text, Link } = Typography;


    
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

  const saveButtonStyle = {
    background: '#52c41a',
borderColor: '#52c41a',
color: '#fff',
fontWeight: 500,
transition: 'all 0.3s ease-in-out',
marginRight: '50px'
  };

  const hoverStyle = {
    background: '#5eff5e',
    borderColor: '#5eff5e',
    transition: 'all 0.3s ease-in-out',
  };

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
    if (wheelElements.length > 0) {
      const newRandomArray = createAlternatingArrayWithDuplicates(wheelElements)
      console.log("Printing random array")
      console.log(newRandomArray)
      console.log(wheelElements)
      setRandomArray(newRandomArray)
    }
    console.log("printing random array")
    console.log(randomArray)
  }, [wheelElements])

  useEffect(() => {
    if (gameData != undefined) {
      setWheelColor(gameData.wheelColor)
      setTextColor(gameData.textColor)
      setDisplayName(gameData.displayName)
    }
  }, [gameData])

  useEffect(() => {
    console.log("fetching logs")
    if (gameData != null) {
      fetchFileUrl();

    }
  }, [gameData]);

  useEffect(() => {
    if (gameData != null) {
      if (gameData.random_check) {
        console.log("random check detected in object")
        console.log(gameData.random_check)
        setRandomCheck(gameData.random_check)
      }
      else {
        setRandomCheck(false)
      }
    }
  }, [gameData])

  useEffect(() => {
    if (gameData != null) {
      console.log("We've detected game data and are in consent")
      console.log(gameData.consent_check)
      if (gameData.consent_check !== undefined) {
        console.log("random consent detected in object")
        console.log(gameData.consent_check)
        setConsent(gameData.consent_check)
      }
      else {
        console.log("we are resetting consent to true")
        setConsent(true)
      }
    }
  }, [gameData])

  const onChangeCheckbox = (e) => {
    setRandomCheck(e.target.checked);
  };

  const onChangeConsent = (e) => {
    setConsent(e.target.checked);
  };

    useEffect(() => {
        console.log("Printing user info in custom game page")
        console.log(user)
        console.log("done printing user info")
        // setDisplayOnboarding(false)
        if (user != undefined) {
            // getTableData()
            getGameData()
            getWinEmail()
        }
    }, [])

    useEffect(() => {
      if (gameData != undefined) {
        setGameName(gameData.game_name)
        setTableValues(gameData.wheel_fields)
        console.log("printing wheel fields")
        console.log(gameData.wheel_fields)
      }
    }, [gameData])

    useEffect(() => {
      if (randomCheck) {
        setDisplayItems(randomArray)
      }
      else {
        setDisplayItems(wheelElements)
      }
    }, [randomCheck, wheelElements])

    // const getTableData = async() => {
    //     console.log("getting user dt")
    //     let data = await getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid)));
    //     console.log("Custom Game Table elements")
    //     console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
    //     // console.log(gameData.wheel_fields)
    //     // setTableValues(gameData.wheel_fields)
    //     console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))

    //     var wheelArray = constructWheelArray(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
    //     setWheelElements(wheelArray)
    //     console.log("table values")
    //     console.log(tableValues)
    // }

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
        // setTableValues(gameData.docs.map((doc) => doc.data().wheel_fields)[0].wheel_fields)
        var wheelArray = constructWheelArray(gameData.docs.map((doc) => doc.data().wheel_fields)[0])
        console.log("about to set wheel elements")
        console.log(gameData.docs.map((doc) => doc.data().wheel_fields)[0])
        console.log(wheelArray)
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

    const updateGame = async() => {
        const gamesCollectionRef = collection(db, 'games');
        const docRef = await getDocs(query(gamesCollectionRef, where('user_id', '==', user.uid), where('game_id', '==', gameData.game_id)));
        getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid), where('game_id', '==', gameData.game_id))).then((res) => {
            const docRef = doc(db, "games", res.docs[0].id);
            console.log(docRef)
            updateDoc(docRef, { 'wheel_fields': tableValues });
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

    function save() {
      if (validEntries(tableValues)) {
        saveGameName()
        saveGameFields()
        saveSocialFields()
        saveGameColorsDisplay()
        saveRandomCheck()
        saveConsentCheck()
        // saveLogo()
        updateGame()

        updateWheel()
        alert("Changes Saved")
      }
    }

    function updateWheel() {
      var wheelArray = constructWheelArray(tableValues)
        setWheelElements(wheelArray)
        var newRandomArray = createAlternatingArrayWithDuplicates(wheelArray)
        setRandomArray(newRandomArray)
        if (randomCheck) {
            setDisplayItems(newRandomArray)
        }
        else {
            setDisplayItems(wheelArray)
        }
    }

    const saveLogo = async () => {
      if (!(file instanceof File)) {
        console.log("not instance of file")
        return
      } 
      console.log('printing file')
      console.log(file)
      const gameId = gameData.id;

      // Create a storage reference
      const storageRef = ref(storage, `userLogos/${gameId}/logo.png`);

      try {
          // If there's already a logo, delete it before uploading the new one
          await deleteObject(storageRef).catch(error => {
          // It's okay if the delete failed because the file didn't exist
          if (error.code !== 'storage/object-not-found') {
              throw error;
          }
          });

          // Upload the new file
          const snapshot = await uploadBytes(storageRef, file);
          // Get the download URL
          const downloadURL = await getDownloadURL(snapshot.ref);

          // Save the download URL to the user's document in Firestore
          const userRef = doc(db, 'games', gameId);
          await updateDoc(userRef, {
          logoURL: downloadURL,
          });

          console.log('File uploaded and URL saved to Firestore!');
      } catch (error) {
          console.error('Error uploading image and saving URL:', error);
      }
  };


    const saveGameColorsDisplay = async() => {
      const updateData ={
          'wheelColor': wheelColor, 
          'textColor': textColor, 
          'displayName': displayName,
      }

      const gamesCollectionRef = collection(db, 'games');
      const docRef = await getDocs(query(gamesCollectionRef, where('user_id', '==', user.uid), where('game_id', '==', gameData.game_id)));
      getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid), where('game_id', '==', gameData.game_id))).then((res) => {
          const docRef = doc(db, "games", res.docs[0].id);
          console.log(docRef)
          updateDoc(docRef, updateData);
      })
      if (docRef.empty) {
          console.log('No matching documents.');
          return;
      }
  }

  const saveGameFields = async() => {
      const gamesCollectionRef = collection(db, 'games');
      const docRef = await getDocs(query(gamesCollectionRef, where('user_id', '==', user.uid), where('game_id', '==', gameData.game_id)));
      console.log("Save game fields")
      getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid), where('game_id', '==', gameData.game_id))).then((res) => {
          const docRef = doc(db, "games", res.docs[0].id);
          console.log("updating the game fields")
          console.log(formFields)
          console.log(docRef)
          updateDoc(docRef, { 'form_fields': formFields });
      })
      if (docRef.empty) {
          console.log('No matching documents.');
          return;
      }
  }

  const saveSocialFields = async() => {
      const gamesCollectionRef = collection(db, 'games');
      const docRef = await getDocs(query(gamesCollectionRef, where('user_id', '==', user.uid), where('game_id', '==', gameData.game_id)));
      getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid), where('game_id', '==', gameData.game_id))).then((res) => {
          const docRef = doc(db, "games", res.docs[0].id);
          console.log(docRef)
          updateDoc(docRef, { 'ig_handle': igHandle, 'fb_page': fbPage });
      })
      if (docRef.empty) {
          console.log('No matching documents.');
          return;
      }
  }

  const saveRandomCheck = async() => {
    const gamesCollectionRef = collection(db, 'games');
    const docRef = await getDocs(query(gamesCollectionRef, where('user_id', '==', user.uid), where('game_id', '==', gameData.game_id)));
    getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid), where('game_id', '==', gameData.game_id))).then((res) => {
        const docRef = doc(db, "games", res.docs[0].id);
        console.log(docRef)
        updateDoc(docRef, { 'random_check': randomCheck });
    })
    if (docRef.empty) {
        console.log('No matching documents.');
        return;
    }
}

  const saveConsentCheck = async() => {
    const gamesCollectionRef = collection(db, 'games');
    const docRef = await getDocs(query(gamesCollectionRef, where('user_id', '==', user.uid), where('game_id', '==', gameData.game_id)));
    getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid), where('game_id', '==', gameData.game_id))).then((res) => {
        const docRef = doc(db, "games", res.docs[0].id);
        console.log(docRef)
        updateDoc(docRef, { 'consent_check': consent });
    })
    if (docRef.empty) {
        console.log('No matching documents.');
        return;
    }
  }
    
  return (
    <div className="screen-with-tabs">
        <Navbar user={user}/>
        <div class="top-button-container">
            <Button onClick={() => navigate('/')}> {"<- Back"}</Button>
            <div>

              <Button style={saveButtonStyle}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = hoverStyle.background;
                    e.currentTarget.style.borderColor = hoverStyle.borderColor;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = saveButtonStyle.background;
                    e.currentTarget.style.borderColor = saveButtonStyle.borderColor;
                }}
                onClick={save}> {"Save"}</Button>

<Button danger onClick={deleteGame}>Delete Game</Button>

            </div>
            
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
          {gameData ? <GameInfo formFields={formFields} setFormFields={setFormFields} igHandle={igHandle} setIGHandle={setIGHandle} fbPage={fbPage} setFBPage={setFBPage} imagePreviewUrl={imagePreviewUrl} file={file} setFile={setFile} setImagePreviewUrl={setImagePreviewUrl} displayName={displayName} setDisplayName={setDisplayName} gameName={gameName} setGameName={setGameName} setWheelColor={setWheelColor} setTextColor={setTextColor} wheelColor={wheelColor} textColor={textColor} user={user} gameData={gameData}></GameInfo> : <p>Loading...</p>}
        </div>
        <div class="section2">

            <Typography.Title level={2} style={{ margin: 0 }}>
                Spin Wheel Customization
            </Typography.Title>
            <br></br>
            { gameData ? <GameNavBar imagePreviewUrl={imagePreviewUrl} displayName={displayName} gameName={gameName} wheelColor={wheelColor} textColor={textColor} gameData={gameData}></GameNavBar> : <p>Loading...</p>}
            <SpinWheel wheelElements={displayItems} wheelColor={wheelColor} textColor={textColor}/>
            <br></br>
            <Checkbox checked={randomCheck} onChange={onChangeCheckbox}>Randomize Wheel Elements</Checkbox><br></br>
            {console.log("printing consent inline")}
            {console.log(consent)}

            <Checkbox checked={consent} onChange={onChangeConsent}>Display Consent Checkbox</Checkbox> <br></br>
            <Text type="danger">
                Please read <a href="/Disclaimer_ Removing the Consent Checkbox.pdf" target="_blank" style={{ color: 'inherit', textDecoration: 'underline' }}>this disclaimer</a> before disabling the consent checkbox.
            </Text>

            {gameData ? <OptionTable setWheelElements={setWheelElements} setRandomArray={setRandomArray} wheelElements={wheelElements} randomArray={randomArray} user={user} displayItems={displayItems} gameData={gameData} setGameData={setGameData} setDisplayItems={setDisplayItems} tableValues={tableValues} setTableValues={setTableValues} tableCollectionRef={tableCollectionRef}/> : <p>Loading...</p>}
        </div>
      </div>
        <div className="tab-section">
        {activeTab === "tab1" && (
            <div style={{padding: '20px'}}>
              {gameData ? <GameInfo formFields={formFields} setFormFields={setFormFields}  igHandle={igHandle} setIGHandle={setIGHandle} fbPage={fbPage} setFBPage={setFBPage}  imagePreviewUrl={imagePreviewUrl} file={file} setFile={setFile} setImagePreviewUrl={setImagePreviewUrl} displayName={displayName} setDisplayName={setDisplayName} gameName={gameName} setGameName={setGameName} setWheelColor={setWheelColor} setTextColor={setTextColor} wheelColor={wheelColor} textColor={textColor} user={user} gameData={gameData}></GameInfo> : <p>Loading...</p>}
            </div>
        )}
        {activeTab === "tab2" && (
          <div>
            <GameNavBar imagePreviewUrl={imagePreviewUrl} displayName={displayName} gameName={gameName} wheelColor={wheelColor} textColor={textColor} gameData={gameData}></GameNavBar>
            <SpinWheel wheelElements={displayItems} wheelColor={wheelColor} textColor={textColor}/>
            <Checkbox checked={randomCheck} onChange={onChangeCheckbox}>Randomize Wheel Elements</Checkbox><br></br>
            <Checkbox checked={consent} onChange={onChangeConsent}>Display Consent Checkbox</Checkbox><br></br>
            <Text type="danger">
                Please read <a href="/Disclaimer_ Removing the Consent Checkbox.pdf" target="_blank" style={{ color: 'inherit', textDecoration: 'underline' }}>this disclaimer</a> before disabling the consent checkbox.
            </Text>
            <OptionTable setWheelElements={setWheelElements} setRandomArray={setRandomArray} wheelElements={wheelElements} randomArray={randomArray} user={user} displayItems={displayItems} gameData={gameData} setGameData={setGameData} setDisplayItems={setDisplayItems} tableValues={tableValues} setTableValues={setTableValues} tableCollectionRef={tableCollectionRef}/>          </div>
        )}
        </div>
    </div>
  );
};