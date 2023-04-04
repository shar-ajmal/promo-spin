import { useState, useEffect } from "react"

export default function DataTable({filteredDataList}){

    const [prizeData, setPrizeData] = useState([])

    useEffect(() => {
        if (filteredDataList != undefined) {
            console.log("Inside chart component")
            console.log(filteredDataList)
            var groupedData = groupPrizeData(filteredDataList)
            setPrizeData(groupedData)
        }
    }, [filteredDataList])

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
            return parseFloat(b.prizeCount) - parseFloat(a.prizeCount);
        });
        const sumTotal = prizeArray.reduce((acc, obj) => acc + obj.prizeCount, 0);
        prizeArray.push({'prizeName': 'total', "prizeCount": sumTotal})
        console.log(prizeArray)


        return prizeArray
        


    }

    return (
        <div className="chart-page-element">
            <h2>Prize Table</h2>
            <table class=" email-table prize-data-table">
                <tr>
                    <th>Prize Name</th>
                    <th>Count</th>
                </tr>
                {console.log("viewing prize info")}
                {console.log(prizeData)}
                {prizeData.map((element, index) => { return (
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
        </div>
    )
}