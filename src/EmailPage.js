import { useState, useEffect } from "react";
import {db} from './firebase-config'
import { read, utils, writeFileXLSX } from 'xlsx';
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from 'firebase/firestore'

import Navbar from "./Navbar";
import DropdownButton from "./DropdownButton";
import EmailList from "./EmailList";

export default function EmailPage({user}) {
    const [filteredEmailList, setFilteredEmailList] = useState()
    const [globalEmailList, setGlobalEmailList] = useState([])
    const [gameList, setGameList] = useState([])
    const navigate = useNavigate();
    const [selectedGame, setSelectedGame] = useState('')

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
        getEmailData()
        getGameData()
    }, []);

    const getEmailData = async() => {
        let data = await getDocs(query(collectedInfoRef, where("user_id", "==", user.uid)));
        setGlobalEmailList(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        console.log("Collecting email info")
        console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        setFilteredEmailList(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
    }

    const getGameData = async() => {
        let data = await getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid)));
        setGameList(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        console.log("printing out games list")
        console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        var gameData = data.docs.map((doc) => ({...doc.data(), id:doc.id}))

        var tempGameList = [{'game_name': 'All Games', 'game_id': 1}]
        gameData.forEach((element) => {
            tempGameList.push({
                'game_name': element.game_name, 
                'game_id': element.game_id
            })
        })

        console.log("printing tempGameList")
        console.log(tempGameList)
        setGameList(tempGameList)
    }

    function exportData () {
        var wb = utils.book_new();
        var ws = utils.json_to_sheet(filteredEmailList);

        var fileName = selectedGame['game_name'] + ".xlsx"
        utils.book_append_sheet(wb, ws, "MySheet1");
        writeFileXLSX(wb, fileName)
    }

    return (
        <div>
            <Navbar user={user}></Navbar>
            <DropdownButton gameList={gameList} selectedGame={selectedGame} setSelectedGame={setSelectedGame}></DropdownButton>
            <br></br>
            <button onClick={exportData}>Export</button>

            {filteredEmailList ? <EmailList emailList={filteredEmailList}></EmailList> : <p>Loading...</p>}
        </div>
    )
}