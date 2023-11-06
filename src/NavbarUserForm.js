import './navbar.css'
import { useEffect } from 'react';

import { Typography } from 'antd';

export default function NavbarUserForm({busName, apothec}) {

    useEffect(() => {
        if (apothec) {
            var topnav = document.getElementsByClassName("topnav")[0]
            if (topnav) {
                topnav.style.setProperty('background-color', '#3e5a62');
            }
        }
    }, [apothec])

    return(
        <div class="topnav">
            <div className='bus-title'>
                {apothec ? <img className="logo" src="/apothec.png"/> : <div></div>}
                <div className='title'>
                {apothec ? <div></div> : <Typography.Title level={3} style={{ margin: 0, color: 'white' }}>
                    {busName}
                </Typography.Title>
                }
                </div>
            </div>
        </div>
    )
}