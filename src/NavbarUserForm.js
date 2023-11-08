import './navbar.css'
import { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase-config';

import { Typography } from 'antd';

export default function NavbarUserForm({gameName, logo, wheelColor, textColor, apothec, gameData}) {
 
    // useEffect(() => {
    //     if (apothec) {
    //         var topnav = document.getElementsByClassName("topnav")[0]
    //         if (topnav) {
    //             topnav.style.setProperty('background-color', '#3e5a62');
    //         }
    //     }
    // }, [apothec])

    return(
        <div className="topnav" style={{background: wheelColor}}>
            <div className='bus-title'>
            <img className="logo" src={logo}/>

                {/* {apothec ? <img className="logo" src="/apothec.png"/> : <div></div>} */}
                <div className='title'>
                {/* {apothec ? <div></div> : <Typography.Title level={3} style={{ margin: 0, color: 'white' }}>
                    {busName}
                </Typography.Title>
                } */}
                { gameName ? <Typography.Title level={3} style={{ margin: 0, color: textColor }}>{gameName}</Typography.Title> : <div></div>}
                </div>
            </div>
        </div>
    )
}