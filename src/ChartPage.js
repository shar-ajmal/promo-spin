import { useState, useEffect } from "react";
import {db} from './firebase-config'
import { collection, getDocs, query, where} from 'firebase/firestore'
import _ from 'lodash';
import Navbar from './Navbar';
import DropdownButton from './DropdownButton';
import Chart from './Chart';
import DataTable from './DataTable';
import { getCustomClaimRole } from './firebase-config';

import './gamecustom.css'

export default function ChartPage({user}) {
    const collectedInfoRef = collection(db, 'collected_info')
    const gamesCollectionRef = collection(db, 'games')
    const [filteredDataList, setFilteredDataList] = useState([])
    const [globalDataList, setGolbalDataList] = useState([])
    const [gameList, setGameList] = useState([])
    const [selectedGame, setSelectedGame] = useState({'game_name':'All Games', 'game_id': 1})
    const [activeTab, setActiveTab] = useState("tab1");
    const [role, setRole] =  useState([])

    async function getRole() {
        console.log("ROLE")
        const value = await getCustomClaimRole();
        console.log(value)
        setRole(value)
    }

    useEffect(() => {
        getRole()
    }, [])

    console.log(user)
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        console.log("We here")
        if (selectedGame.game_id === 1) {
            console.log(globalDataList)
            setFilteredDataList(globalDataList)
        }
        else if (selectedGame.game_id != null) {
            console.log("changing")
            console.log(selectedGame)
            const filteredData = globalDataList.filter(obj => obj.game_id === selectedGame.game_id);
            setFilteredDataList(filteredData)
            console.log(filteredData)
        }

    }, [selectedGame, role])

    useEffect(() => {
        setSelectedGame({'game_name':'All Games', 'game_id': 1})
        getGameData()
    }, [role])

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

        if (role != "pro") {
            if (tempGameList.length != 0) {
                tempGameList = [tempGameList[0], tempGameList[1]]
            }
        }

        console.log("printing tempGameList")
        console.log(role)
        console.log(tempGameList)

        setGameList(tempGameList)

        var gameIdList = [];
        
        tempGameList.map((element) => {
            gameIdList.push(element['game_id'])
        });

        let infoData =  role == "pro" ? await getDocs(query(collectedInfoRef, where("user_id", "==", user.uid))): await getDocs(query(collectedInfoRef, where("user_id", "==", user.uid), where("game_id", "in", gameIdList)));
        console.log("MAPPING DATAs")
        console.log(infoData.docs.map((doc) => ({...doc.data(), id:doc.id})))
        setGolbalDataList(infoData.docs.map((doc) => ({...doc.data(), id:doc.id})))
        setFilteredDataList(infoData.docs.map((doc) => ({...doc.data(), id:doc.id})))
    }


    return (
        <div>
            <Navbar user={user}></Navbar>
            <DropdownButton gameList={gameList} selectedGame={selectedGame} setSelectedGame={setSelectedGame}></DropdownButton>

            <div className="tabs">
                <button
                className={`tab ${activeTab === "tab1" ? "active" : ""}`}
                onClick={() => handleTabClick("tab1")}
                >
                Prize Data
                </button>
                <button
                className={`tab ${activeTab === "tab2" ? "active" : ""}`}
                onClick={() => handleTabClick("tab2")}
                >
                Chart
                </button>
            </div>

            <div className='desktop-elements' style={{display: 'flex'}}>
                {console.log("here is the filtered data list", filteredDataList)}
                 <DataTable filteredDataList={filteredDataList}></DataTable>
                <Chart filteredDataList={filteredDataList}></Chart>
            </div>

            <div className="tab-section">
                {activeTab === "tab1" && (
                    <div style={{padding: '20px'}}>
                        <DataTable filteredDataList={filteredDataList}></DataTable> : <p>Loading</p>
                    </div>
                )}
                {activeTab === "tab2" && (
                    <div>
                        <Chart filteredDataList={filteredDataList}></Chart>
                    </div>
                )}
            </div>
        </div>
      );
}