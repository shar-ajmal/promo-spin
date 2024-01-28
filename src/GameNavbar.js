import { useEffect, useState } from "react";
import { Typography } from 'antd'

export default function GameNavBar({wheelColor, textColor, logo, gameName, displayName, imagePreviewUrl}) {
    // const [gameName, setGameName] = useState('')

    // useEffect(() => {
    //     setGameName(gameData.game_name)
    // }, [])
    console.log("here in the function")
    console.log(textColor)
    return (
        <div class="topnav" style={{background: wheelColor}}>
            <div className='bus-title'>
                <img className="logo" src={imagePreviewUrl}/>
                {/* {apothec ? <img className="logo" src="/apothec.png"/> : <div></div>} */}
                <div className='title'>
                { displayName ? <Typography.Title level={3} style={{ margin: 0, color: 'white'  }}>{gameName}</Typography.Title> : <div></div>}
                {/* {apothec ? <div></div> : <Typography.Title level={3} style={{ margin: 0, color: 'white' }}>
                    {busName}
                </Typography.Title>
                } */}
                </div>
            </div>
        </div>
    )
}