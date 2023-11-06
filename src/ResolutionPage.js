import NavbarUserForm from "./NavbarUserForm";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from 'firebase/firestore'
import {db} from './firebase-config'
import { Typography } from 'antd';

import './resolution.css'

export default function ResolutionPage({user}) {
    const [gameData, setGameData] = useState([])
    const gamesCollectionRef = collection(db, 'games')
    const [wonItem, setWonItem] = useState([])
    const [igHandle, setIGHandle] = useState('')
    const [fbPage, setFBPage] = useState('')
    const [apothec, setApothec] = useState(false)

    const params = useParams();
    const gameId = params.gameId;
    // var encodedWonItem = params.wonItem
    // var decodedWonItem = decodeURIComponent(encodedWonItem)
   

    useEffect(() => {
        if (gameId != undefined) {
            getGameData()
        }
    }, [])

    useEffect(() => {
        const replaceUnderscoresWithSpaces = (str) => str.replace(/_/g, ' ');
        console.log("removing underscore")
        var decodedWonItem = replaceUnderscoresWithSpaces(params.wonItem)
        console.log(decodedWonItem)
    
        const wonItem = decodedWonItem.toLowerCase() === 'nothing' ? "Try again next time!" : decodedWonItem ;
        setWonItem(wonItem)
    }, [])

    useEffect(() => {
      console.log("printing game data in resolution")
      console.log(gameData.user_id)
      if(gameData.user_id == "Su5PLb3DQeOsRWbqfAFB6Bl8D6F2") {
        setApothec(true)
      }
    }, [gameData])

    function instagramLink() {
        const appURL = 'instagram://user?username=' + igHandle;
        const webURL = 'instagram://user?username='  + igHandle;
      
        function openURL(url) {
          const win = window.open(url, '_blank');
          win.focus();
        }
      
        function openInstagramApp() {
          openURL(appURL);
        }
      
        function openInstagramWeb() {
          openURL(webURL);
        }
      
        if (window.navigator && window.navigator.userAgent.match(/instagram/i)) {
          openInstagramApp();
        } else {
          openInstagramWeb();
        }
      }

      const redirectoToFaceBook = () => {
        window.location.href=fbPage
      }

      

    const getGameData = async() => {
        let data = await getDocs(query(gamesCollectionRef, where("game_id", "==", gameId)));
        console.log("Game elements")
        const mappedData = data.docs.map((doc) => ({...doc.data(), id:doc.id}))[0]
        if (mappedData.ig_handle) { setIGHandle(mappedData.ig_handle) }
        if (mappedData.fb_page) { setFBPage(mappedData.fb_page) }
        setGameData(data.docs.map((doc) => ({...doc.data(), id:doc.id}))[0])
    }

    
    return (
        <div>
            <NavbarUserForm busName={gameData.game_name} apothec={apothec}>
            </NavbarUserForm>
            <div className="won-item">
                <Typography.Title level={1} style={{ margin: 0, color: 'black' }}>
                        {wonItem}
                </Typography.Title>
            </div>
            <div className="thanks-message">
                <Typography.Title level={3} style={{ margin: 0, color: 'black', paddingBottom: "50px" }}>
                        Thanks for playing!
                </Typography.Title>
                {igHandle != '' ? 
                <div className="ig-button" onClick={instagramLink}>
                    <img className="ig-logo" src="/ig_logo.webp"/>
                    <div>
                    <Typography.Title level={5} style={{ margin: 0, color: 'white', paddingLeft: "10px" }}>
                        Follow the journey with @{igHandle}
                    </Typography.Title>
                    </div>
                </div> : <div></div>
                }

                {fbPage != '' ? 
                <div className="ig-button" onClick={redirectoToFaceBook}>
                    <img className="ig-logo" src="/fb_logo.png"/>
                    <div>
                    <Typography.Title level={5} style={{ margin: 0, color: 'black', paddingLeft: "10px" }}>
                        Follow us on Facebook!
                    </Typography.Title>
                    </div>
                </div> : <div></div>
                }
                
            </div>
        </div>
        
    )
}