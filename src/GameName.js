import React, { useState } from "react";
import "./gamecustom.css";

export default function GameName({user, gameId, gameName, setGameName}) {

    function handleChange(e) {
        setGameName(e.target.value)
    }

    return (
        <div>
            <input value={gameName} onChange={handleChange}/>
            <button>Save</button>
        </div>
    )
}