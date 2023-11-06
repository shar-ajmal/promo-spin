// Assuming your spinwheel component is named MySpinwheel
import React from 'react';
import ReactDOM from 'react-dom';
import SpinWheel from '../SpinWheel';
import { useState, useEffect } from 'react';
import { getDocs, query, where, collection} from 'firebase/firestore'
import { db } from '../firebase-config'
import { constructWheelArray } from '../function';
import PopupBox from '../PopupBox';
import '../PopupBox.css'
import '../styles.css'



function MyWidget({gameId}) {
  const [wheelElements, setWheelElements] = useState([])
  const [gameData, setGameData] = useState([])
  const gamesCollectionRef = collection(db, 'games')
  const [isPopupVisible, setPopupVisible] = useState(false);


  const getGameData = async() => {
    console.log("Getting game data query params")
    console.log(gameId)
    let gameData = await getDocs(query(gamesCollectionRef, where("game_id", "==", gameId)));
    console.log("getting game data")
    console.log(gameId)
    console.log(gameData.docs.map((doc) => ({...doc.data(), id:doc.id}))[0])
    setGameData(gameData.docs.map((doc) => ({...doc.data(), id:doc.id}))[0])
    console.log("printing form wheel data")
    var wheelArray = constructWheelArray(gameData.docs.map((doc) => doc.data().wheel_fields)[0])
    setWheelElements(wheelArray)
  }

  useEffect(() => {
    console.log("local storage functionality")
    if (gameId != undefined) {
      getGameData()
  }
    console.log("Widget use effect")
  }, [])

  useEffect(() => {
    console.log("getting spinwheel local storage2")
    console.log(localStorage.getItem('spinwheel_shown'))
    if (localStorage.getItem('spinwheel_shown') != 'true') {
      console.log("We in here for spinwheel")
      setPopupVisible(true)
    }
    else {
      console.log("nah, f that")
      setPopupVisible(false)
    }
  })

  function closePopUpBox() {
    setPopupVisible(false)
    localStorage.setItem('spinwheel_shown', true);
    console.log("setting up local storage")
  }

    // Your spinwheel component logic here
    return (
      // Your spinwheel JSX here
      <div>
        {isPopupVisible && 
        <PopupBox gameData={gameData} wheelElements={wheelElements} onClose={() => closePopUpBox()}>
          <h1>Your React Component</h1>
          {/* You can place your React component here */}
        </PopupBox>
        }
      </div>
    );
  }
  
  export default MyWidget;
