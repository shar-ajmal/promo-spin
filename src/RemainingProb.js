import { useEffect, useState } from "react";

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
        <div className="total-prob"><div className="total-prob-el ">Total Probability:</div> <div className="total-prob-el ">{remainProb}%</div></div>
    )

}