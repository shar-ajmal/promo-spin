import { useEffect, useState } from "react";
import {Typography } from 'antd'

export default function RemainingProb({tableValues}) {
    const [remainProb, setRemainProb] = useState()

    useEffect(() => {
        let totalProb = 0;
        for (var i=0;i<tableValues.length;i++) {
            let probInt = parseInt(tableValues[i]['probability'])
            console.log("rem prob")
            console.log(probInt)
            if (isNaN(probInt)) {
                probInt = 0;
            }
            totalProb += probInt
        }
        setRemainProb(totalProb)
    }, [tableValues])

    return (
        <div className="total-prob">
            <div className="total-prob-el ">
                        <Typography.Title level={5} style={{ margin: 0 }}>
                            Total Probability
                        </Typography.Title>
            </div> 
            <div className="total-prob-el ">
            <Typography.Title level={5} style={{ margin: 0 }}>
                {remainProb}%
            </Typography.Title>
            
            </div>
        </div>
    )

}