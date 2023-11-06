import React from 'react';
import './PopupBox.css';
import Wheel from './Wheel';
import { useState, useEffect } from 'react';
const PopupBox = ({ onClose, children, wheelElements, gameData }) => {
  const [selectedItemTop, setSelectedItemTop] = useState(null)
  useEffect(() => {
    console.log("Inside pop up box component")
  }, [])
  useEffect(() => {
    console.log("Selected item has changed")
    console.log(selectedItemTop)
  }, [selectedItemTop])
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={onClose}>x</span>
        {
          !selectedItemTop && gameData ? 
          <div>
            <h1>{gameData.game_name}</h1>
            <Wheel widget={true} gameData={gameData} wheelElements={wheelElements} setSelectedItemTop={setSelectedItemTop} selectedItem={selectedItemTop}/>
          </div> 
          :
          <div>
            <h1>Congratulations!</h1>
            <h3>You have won {selectedItemTop}</h3>
          </div>
        }
      </div>
    </div>
  );
};

export default PopupBox;