import React from 'react';
import './PopupBox.css';
import Wheel from './Wheel';
import { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { createAlternatingArrayWithDuplicates } from './function';
const PopupBox = ({ onClose, children, wheelElements, gameData, setWheelElements }) => {
  const [selectedItemTop, setSelectedItemTop] = useState(null)
  const [wheelColor, setWheelColor] = useState('')
  const [textColor, setTextColor] = useState('')
  const [displayItems, setDisplayItems] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    console.log("Inside pop up box component")
  }, [])

  useEffect(() => {
    console.log("Inside popupbox use effect")
    console.log(gameData)
    if (gameData != null) {
      setDataLoaded(true)
      setTextColor(gameData.textColor)
      setWheelColor(gameData.wheelColor)
      console.log('in the random function')
      console.log("printing game data")
      console.log(gameData)
      console.log(gameData.random_check)
      console.log(wheelElements)
      if (gameData.random_check && wheelElements.length > 2) {
        console.log("in the random function for sure")
          var randomArray = createAlternatingArrayWithDuplicates(wheelElements)
          console.log(randomArray)
          setDisplayItems(randomArray)
      }
      else {
        setDisplayItems(wheelElements)
      }
    }
}, [gameData, wheelElements])


  useEffect(() => {
    console.log("Selected item has changed")
    console.log(selectedItemTop)
  }, [selectedItemTop])
  return (
    dataLoaded ? (
      <div className="popup-box">
        <div className="box">
          <span className="close-icon" onClick={onClose}>x</span>
          {
            !selectedItemTop ? (
              <div>
                <Typography.Title level={1}>
                  {gameData.game_name}
                </Typography.Title>
                <Wheel wheelColor={wheelColor} textColor={textColor} widget={true} gameData={gameData} wheelElements={displayItems} setSelectedItemTop={setSelectedItemTop} selectedItem={selectedItemTop}/>
              </div>
            ) : (
              <div>
                <Typography.Title level={1}>
                  Congratulations!
                </Typography.Title>
                <Typography.Title level={3}>
                  You have won {selectedItemTop}. Check your email!
                </Typography.Title>
              </div>
            )
          }
        </div>
      </div>
    ) : <div />
  );
};

export default PopupBox;