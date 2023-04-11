import { useState, useEffect } from "react";
import {db} from './firebase-config'
import { read, utils, writeFileXLSX } from 'xlsx';
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, whereIn } from 'firebase/firestore'
import moment from 'moment'
import Navbar from "./Navbar";
import DropdownButton from "./DropdownButton";
import EmailList from "./EmailList";

import { standardizeData } from "./firebase-config"
import {Button} from 'antd';
import { getCustomClaimRole } from './firebase-config';

export default function EmailPage({user}) {
    const [filteredEmailList, setFilteredEmailList] = useState()
    const [globalEmailList, setGlobalEmailList] = useState([])
    const [gameList, setGameList] = useState([])
    const navigate = useNavigate();
    const [selectedGame, setSelectedGame] = useState('')
    const [hideGames, setHideGames] = useState(false)
    const [role, setRole] =  useState([])


    const collectedInfoRef = collection(db, 'collected_info');
    const gamesCollectionRef = collection(db, 'games');

    const handleBack = () => {
        navigate('/')
    }

    async function getRole() {
        console.log("ROLE")
        const value = await getCustomClaimRole();
        console.log(value)
        setRole(value)
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
        getRole()
    }, [])

    useEffect(() => {
        
        setSelectedGame({'game_name':'All Games', 'game_id': 1})
        getGameData()
    }, [role]);

    const getEmailData = async(tempGameList) => {
        console.log("Getting email data")
        var gameIdList = []
        console.log("getting game id list")
        tempGameList.map((element) => {
            if (element)
            gameIdList.push(element['game_id'])
        })

        console.log(gameIdList)
        
        if (gameIdList.length > 0) {
            
            let data =  role == "pro" ? await getDocs(query(collectedInfoRef, where("user_id", "==", user.uid))): await getDocs(query(collectedInfoRef, where("user_id", "==", user.uid), where("game_id", "in", gameIdList)));
            setGlobalEmailList(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
            console.log("Collecting email info")
            console.log(user.uid)
            console.log(gameIdList)
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
            if (element.game_enabled) {
                tempGameList.push({
                    'game_name': element.game_name, 
                    'game_id': element.game_id
                })
            }
        })

        console.log("Looking at get gamedata function")
        console.log(role)
        console.log(tempGameList)

        if (role != "pro") {
            if (tempGameList.length != 0) {
                tempGameList = [tempGameList[0], tempGameList[1]]
            }
        }

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
            <DropdownButton style={{margin: '20px'}} gameList={gameList} selectedGame={selectedGame} setSelectedGame={setSelectedGame}></DropdownButton>
            {/* <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" onClick={toggleGames}/>
            <label for="vehicle1"> Hide Disabled Games </label> */}
            <Button type="primary" style={{margin: '20px'}} onClick={exportData}>Export</Button>

            {filteredEmailList ? <EmailList emailList={filteredEmailList}></EmailList> : <p>Loading...</p>}
        </div>
    )
}