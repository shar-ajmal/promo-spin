import { LineChart, Line, CartesianGrid, XAxis, YAxis,ResponsiveContainer,ScatterChart, Scatter  } from 'recharts';
import { useState, useEffect } from "react";
import {db} from './firebase-config'
import { collection, getDocs } from 'firebase/firestore'
import { read, utils, writeFileXLSX } from 'xlsx';
import { useNavigate } from "react-router-dom";
import moment from 'moment'
import _ from 'lodash';
import Navbar from './Navbar';

export default function ChartPage({}) {
    const collectedInfoRef = collection(db, 'collected_info')
    const [chartData, setChartData] = useState([])
    const [timePeriod, setTimePeriod] = useState([])

    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/')
    }

    useEffect(() => {
        const getInfoData = async() => {
            let data = await getDocs(collectedInfoRef)
            let mappedData = data.docs.map((doc) => ({...doc.data(), id:doc.id}))
            // setChartData(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
            console.log("MAPPING DATAs")
            console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
            let groupedData = groupChartData(mappedData)
            setChartData(groupedData)
        }

        getInfoData()
    }, [timePeriod])

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
            <Navbar></Navbar>
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