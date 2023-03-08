import React, { useEffect, useState } from 'react';
import './dropdown.css'

function DropdownButton({gameList, selectedGame, setSelectedGame}) {
  const [toggleShow, setToggleShow] = useState()

  useEffect(() => {
    console.log("printing out gamelist")
    console.log(gameList)
    setToggleShow(false)
  }, [])
  function handleOptionClick(option) {
    setSelectedGame(option)
  }

  function toggleDropdown() {
    setToggleShow(!toggleShow)
  }

  return (
    <div className="dropdown">
      <button className="dropdown-toggle" type="button" data-toggle="dropdown" onClick={toggleDropdown}>
        {selectedGame.game_name}
      </button>
      <div className={`dropdown-menu ${toggleShow ? "show" : ""}`}>
        {gameList.map((option) => (
          <button key={option} className="dropdown-item" onClick={() => handleOptionClick(option)}>
            {option.game_name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DropdownButton;