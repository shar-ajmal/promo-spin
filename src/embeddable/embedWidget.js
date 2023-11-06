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

window.onload = () => {
    // Check for the presence of the 'spinWheelTrigger' div
    console.log("window has been loaded")
    const triggerDiv = document.getElementById('spinWheelTrigger');
    
    if (triggerDiv) {
        console.log("we've detected the trigger div")
        const currentScript = document.currentScript || (() => {
            const scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();
        const gameId = currentScript.getAttribute('data-game-id');
        
        renderMyWidget(gameId);
    }
};
