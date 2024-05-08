import React from 'react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import MyWidget from './MyWidget';
import '../PopupBox.css'
import '../styles.css'


function renderMyWidget(gameId) {
    const div = document.createElement('div');
    console.log("rendering widget with game id")
    console.log(gameId)
    document.body.appendChild(div);
    ReactDOM.render(
        <StrictMode>
            <MyWidget gameId={gameId}/>
        </StrictMode>, div
    );
}

console.log("This is the embeddable widget")

window.onload = () => {
    // Check for the presence of the 'spinWheelTrigger' div
    console.log("window has been loaded")
    const triggerDiv = document.getElementById('spinWheelTrigger');
    
    // if (triggerDiv) {
        console.log("we've detected the trigger div")
        const currentScript = document.currentScript || (() => {
            const scripts = document.getElementById('promo-spin-script');
            return scripts;
        })();
            console.log(currentScript,"currentScript")
            let gameId = currentScript.getAttribute('data-game-id');
            console.log("in time out function")
            console.log("getting game id in timeout")
            console.log(gameId)
            // Any additional code that uses gameId can go here.
            renderMyWidget(gameId);
    // }
};