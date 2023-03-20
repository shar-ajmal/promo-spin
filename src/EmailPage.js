import { useState, useEffect } from "react";
import {db} from './firebase-config'
import { read, utils, writeFileXLSX } from 'xlsx';
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, whereIn } from 'firebase/firestore'
import moment from 'moment'
import Navbar from "./Navbar";
import DropdownButton from "./DropdownButton";
import EmailList from "./EmailList";

import standardizeData from "./firebase-config";

export default function EmailPage({user}) {
    const [filteredEmailList, setFilteredEmailList] = useState()
    const [globalEmailList, setGlobalEmailList] = useState([])
    const [gameList, setGameList] = useState([])
    const navigate = useNavigate();
    const [selectedGame, setSelectedGame] = useState('')
    const [hideGames, setHideGames] = useState(false)

    const collectedInfoRef = collection(db, 'collected_info');
    const gamesCollectionRef = collection(db, 'games');

    const handleBack = () => {
        navigate('/')
    }

    useEffect(() => {
        console.log("We here")
        if (selectedGame.game_id === 1) {
            console.log(globalEmailList)
            setFilteredEmailList(globalEmailList)
        }
        else {
            console.log("changing")
            console.log(selectedGame)
            const filteredEmails = globalEmailList.filter(obj => obj.game_id === selectedGame.game_id);
            setFilteredEmailList(filteredEmails)
            console.log(filteredEmails)
        }
    }, [selectedGame])

    useEffect(() => {
        
        setSelectedGame({'game_name':'All Games', 'game_id': 1})
        getGameData()
    }, [hideGames]);

    const getEmailData = async(tempGameList) => {
        console.log("Getting email data")
        console.log(tempGameList)
        if (tempGameList.length > 0) {
            let data =  await getDocs(query(collectedInfoRef, where("user_id", "==", user.uid)));
            setGlobalEmailList(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
            console.log("Collecting email info")
            console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
            setFilteredEmailList(data.docs.map((doc) => ({...doc.data(), id:doc.id})))

        }
    }

    const getGameData = async() => {
        let data = await getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid)));
        setGameList(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        console.log("printing out games list")
        console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        var gameData = data.docs.map((doc) => ({...doc.data(), id:doc.id}))

        var tempGameList = [{'game_name': 'All Games', 'game_id': 1}]
        gameData.forEach((element) => {
            if (hideGames){
                if (element.game_enabled) {
                    tempGameList.push({
                        'game_name': element.game_name, 
                        'game_id': element.game_id
                    })
                }
            }
            else {
                tempGameList.push({
                    'game_name': element.game_name, 
                    'game_id': element.game_id
                })
            }
        })

        console.log("printing tempGameList")
        console.log(tempGameList)

        getEmailData(tempGameList)
        setGameList(tempGameList)
    }

    function exportData () {
        var wb = utils.book_new();
        var formEntries = standardizeData(filteredEmailList)
        var ws = utils.json_to_sheet(formEntries);



        var fileName = selectedGame['game_name'] + ".xlsx"
        utils.book_append_sheet(wb, ws, "MySheet1");
        writeFileXLSX(wb, fileName)
    }

    function toggleGames () {
        console.log("setting hide games")
        console.log(!hideGames)
        setHideGames(!hideGames)
    }

    return (
        <div>
            <Navbar user={user}></Navbar>
            <DropdownButton gameList={gameList} selectedGame={selectedGame} setSelectedGame={setSelectedGame}></DropdownButton>
            {/* <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" onClick={toggleGames}/>
            <label for="vehicle1"> Hide Disabled Games </label> */}
            <br></br>
            <button onClick={exportData}>Export</button>

            {filteredEmailList ? <EmailList emailList={filteredEmailList}></EmailList> : <p>Loading...</p>}
        </div>
    )
}