import { LineChart, Line, CartesianGrid, XAxis, YAxis,ResponsiveContainer,ScatterChart, Scatter, BarChart, Bar, Label } from 'recharts';
import { useState, useEffect } from "react";
import {db} from './firebase-config'
import { collection, getDocs, query, where} from 'firebase/firestore'
import { read, utils, writeFileXLSX } from 'xlsx';
import { useNavigate } from "react-router-dom";
import moment from 'moment'
import _ from 'lodash';
import Navbar from './Navbar';
import DropdownButton from './DropdownButton';
import Chart from './Chart';
import DataTable from './DataTable';

export default function ChartPage({user}) {
    const collectedInfoRef = collection(db, 'collected_info')
    const gamesCollectionRef = collection(db, 'games')
    const [chartData, setChartData] = useState([])
    const [prizeInfo, setPrizeInfo] = useState([])
    const [timePeriod, setTimePeriod] = useState([])

    const [filteredDataList, setFilteredDataList] = useState()
    const [globalDataList, setGolbalDataList] = useState([])
    const [gameList, setGameList] = useState([])
    const [selectedGame, setSelectedGame] = useState('')

    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/')
    }

    useEffect(() => {
        console.log("We here")
        if (selectedGame.game_id === 1) {
            console.log(globalDataList)
            setFilteredDataList(globalDataList)
            // dataClean(filteredDataList)
        }
        else if (selectedGame.game_id != null) {
            console.log("changing")
            console.log(selectedGame)
            const filteredData = globalDataList.filter(obj => obj.game_id === selectedGame.game_id);
            setFilteredDataList(filteredData)
            console.log(filteredData)
            // dataClean(filteredDataList)
        }

        // dataClean(filteredDataList)
    }, [selectedGame])

    useEffect(() => {
        const getInfoData = async() => {
            let data = await getDocs(query(collectedInfoRef, where("user_id", "==", user.uid)))
            let mappedData = data.docs.map((doc) => ({...doc.data(), id:doc.id}))
            // setChartData(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
            console.log("MAPPING DATAs")
            console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
            setGolbalDataList(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
            setFilteredDataList(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
            // dataClean(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
            // let groupedData = groupChartData(mappedData)
            // let groupedPrizeData = groupPrizeData(mappedData)
            // setPrizeInfo(groupedPrizeData)
            // setChartData(groupedData)
        }

        getInfoData()
        getGameData()
        setSelectedGame({'game_name':'All Games', 'game_id': 1})
    }, [])

    function dataClean(dataList) {
        console.log("In data clean")
        console.log(dataList)
        let groupedData = groupChartData(dataList)
        // let groupedPrizeData = groupPrizeData(dataList)
        // setPrizeInfo(groupedPrizeData)
        setChartData(groupedData)
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

    function groupPrizeData(data) {
        console.log("IN PRIZE FUNCTION")
        console.log(data)
        let prizeDict = {}

        for (var i=0; i<data.length; i++) {
            if (data[i]['item_name'] === undefined || data[i]['item_name'] === "") continue
            if (!(data[i]['item_name'] in prizeDict)) {
                prizeDict[data[i]['item_name']] = 1
            }
            else {
                prizeDict[data[i]['item_name']] += 1
            }
        }

        console.log(prizeDict)
        let prizeArray = []

        for (let key in prizeDict) {
            prizeArray.push({'prizeName': key, "prizeCount": prizeDict[key]})
        }

        console.log("printing prize arr")
        prizeArray.sort(function(a, b) {
            return parseFloat(a.prizeCount) - parseFloat(b.prizeCount);
        });
        console.log(prizeArray)


        return prizeArray
        


    }

    // gets count per day
    function groupChartData(data) {
        let groupedResults = _.groupBy(data, (result) => moment.unix(Math.trunc(result['timestamp']/1000)).startOf('month'));
        var dataCountArr = []

        console.log("GROUPED RESULTS")
        console.log(groupedResults)

        for (let x in groupedResults) {
            // console.log(x)
            // console.log(groupedResults[x])
            var timestamp = Math.trunc(groupedResults[x][0]['timestamp']/1000)
            console.log("printing out the timestamp")
            console.log(timestamp)
            dataCountArr.push({'count': groupedResults[x].length, 'timestamp': Math.trunc(groupedResults[x][0]['timestamp']/1000)})
            console.log("PRINTING OUT DATES")
            console.log(moment.unix(Math.trunc(groupedResults[x][0]['timestamp']/1000)).format("MMM Do"))
        }

        console.log("Returning data count arr")
        console.log(dataCountArr)

        return dataCountArr
    }


    return (
        <div>
            <Navbar user={user}></Navbar>
            <DropdownButton gameList={gameList} selectedGame={selectedGame} setSelectedGame={setSelectedGame}></DropdownButton>
            <h2>Prize Table</h2>
            <DataTable filteredDataList={filteredDataList}></DataTable>
            <h2>Info Collected over Time</h2>
            <Chart filteredDataList={filteredDataList}></Chart>
        </div>
      );
}