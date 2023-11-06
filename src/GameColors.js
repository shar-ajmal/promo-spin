import { useEffect, useState } from "react";
import { Input, Button, Space } from 'antd';
import { useFetcher } from "react-router-dom";

export default function GameColors({wheelColor, textColor, setWheelColor, setTextColor}) {
    // const [tempWheelColor, setTempWheelColor] = useState('')
    // const [tempTextColor, setTempTextColor] = useState('')

    // useEffect(() => {
    //     setTempWheelColor(wheelColor)
    //     setTempTextColor(textColor)
    // }, [])

    function handleWheelChange(e) {
        setWheelColor(e.target.value)
    }
    function handleTextChange(e) {
        setTextColor(e.target.value)
    }


    return (
        <div>
            <div className="input-container color-container">
                <div className="color-box" style={{background: wheelColor}}>
            
                </div>
                <div className="color-input">
                    <Input addonBefore="Wheel Color" placeholder='ie: Add your hexcode, ie: #ffffff' value={wheelColor} onChange={handleWheelChange}></Input>
                </div>
            </div>
            <div className="input-container color-container">
                <div className="color-box" style={{background: textColor}}>
            
                </div>
                <div className="color-input">
                    <Input addonBefore="Text Color" placeholder='ie: Add your hexcode, ie: #ffffff' value={textColor} onChange={handleTextChange}></Input>
                </div>
            </div>
        </div>
    )
}