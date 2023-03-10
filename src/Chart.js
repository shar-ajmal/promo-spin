
import { LineChart, Line, CartesianGrid, XAxis, YAxis,ResponsiveContainer,ScatterChart, Scatter, BarChart, Bar, Label } from 'recharts';
import { useState, useEffect } from "react";
import moment from 'moment'
import _ from 'lodash';

import "./chartpage.css"

export default function Chart({filteredDataList}){

    // const [filteredDataList, setFilteredDataList] = useState([])
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        console.log("Inside chart component")
        console.log(filteredDataList)
        var groupedData = groupChartData(filteredDataList)
        setChartData(groupedData)
    }, [filteredDataList])

    function groupChartData(data) {
        let groupedResults = _.groupBy(data, (result) => moment.unix(Math.trunc(result['timestamp']/1000)).startOf('day'));
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
        <div class="chart-container">
            <ResponsiveContainer width="95%" height={500}>
                <BarChart data={chartData}>
                    
                    <XAxis 
                    dataKey = 'timestamp'
                    domain = {['auto', 'auto']}
                    name = 'Time'
                    tickFormatter = {(unixTime) => moment.unix(unixTime).format('MMM Do')}
                    type = 'number'
                    >
                    </XAxis>
                    <YAxis/>
                    <Bar dataKey="count" fill="#8884d8" name="Count" barSize={30}/>
                </BarChart>
            </ResponsiveContainer>
        </div> 
    )
}