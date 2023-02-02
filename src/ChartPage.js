import { LineChart, Line, CartesianGrid, XAxis, YAxis,ResponsiveContainer,ScatterChart, Scatter  } from 'recharts';
import { useState, useEffect } from "react";
import {db} from './firebase-config'
import { collection, getDocs, query, where} from 'firebase/firestore'
import { read, utils, writeFileXLSX } from 'xlsx';
import { useNavigate } from "react-router-dom";
import moment from 'moment'
import _ from 'lodash';
import Navbar from './Navbar';

export default function ChartPage({user}) {
    const collectedInfoRef = collection(db, 'collected_info')
    const [chartData, setChartData] = useState([])
    const [prizeInfo, setPrizeInfo] = useState([])
    const [timePeriod, setTimePeriod] = useState([])

    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/')
    }

    useEffect(() => {
        const getInfoData = async() => {
            let data = await getDocs(query(collectedInfoRef, where("user_id", "==", user.uid)))
            let mappedData = data.docs.map((doc) => ({...doc.data(), id:doc.id}))
            // setChartData(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
            console.log("MAPPING DATAs")
            console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
            let groupedData = groupChartData(mappedData)
            let groupedPrizeData = groupPrizeData(mappedData)
            setPrizeInfo(groupedPrizeData)
            setChartData(groupedData)
        }

        getInfoData()
    }, [])

    function groupPrizeData(data) {
        console.log("IN PRIZE FUNCTION")
        console.log(data)
        let prizeDict = {}

        for (var i=0; i<data.length; i++) {
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

    function groupChartData(data) {
        let groupedResults = _.groupBy(data, (result) => moment.unix(Math.trunc(result['timestamp']/1000)).startOf('day'));
        var dataCountArr = []

        console.log("GROUPED RESULTS")
        console.log(groupedResults)

        for (let x in groupedResults) {
            // console.log(x)
            // console.log(groupedResults[x])
            dataCountArr.push({'count': groupedResults[x].length, 'timestamp': Math.trunc(groupedResults[x][0]['timestamp']/1000)})
        }

        console.log("Returning data count arr")
        console.log(dataCountArr)

        return dataCountArr
    }


    return (
        <div>
            <Navbar user={user}></Navbar>

            <table>
                <tr>
                    <th>Prize Name</th>
                    <th>Count</th>
                </tr>
                {console.log("viewing prize info")}
                {console.log(prizeInfo)}
                {prizeInfo.map((element, index) => { return (
                    <tr>
                        <td>
                            {element['prizeName']}
                        </td>
                        <td>
                            {element['prizeCount']}
                        </td>
                    </tr>
                )
                })}
            </table>
            <ResponsiveContainer width = '95%' height = {500} >
                <ScatterChart>
                    <XAxis
                        dataKey = 'timestamp'
                        domain = {['auto', 'auto']}
                        name = 'Time'
                        tickFormatter = {(unixTime) => moment.unix(unixTime).format('MMM Do')}
                        type = 'number'
                    />
                    <YAxis dataKey = 'count' name = 'Count' />
                    <Scatter
                        data = {chartData}
                        // line = {{ stroke: '#eee' }}
                        lineJointType = 'monotoneX'
                        lineType = 'joint'
                        name = 'Count'
                    />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
      );
}