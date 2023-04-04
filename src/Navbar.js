import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";
import { Typography } from 'antd';
import './navbar.css'

export default function Navbar({user}) {
    const spinUrl = "/spin/" + user.uid
    const navigate = useNavigate();

    const handleBack = (page) => {
        navigate(page)
    }

    return(
        <div class="topnav">
            {/* <a class="category" onClick={() => handleBack('/')}>Admin</a>
            <a class="category" onClick={() => handleBack('/emails')}>Emails</a>
            <a class="category" onClick={() => handleBack('/chart')}>Chart</a>
            <a class="logout" onClick={() => auth.signOut()}>Logout</a> */}
            <div class="category">
                <Typography.Title level={5} style={{ margin: 0, color: 'white' }} onClick={() => handleBack('/')}>
                    Admin
                </Typography.Title>
            </div>
            <div class="category">
                <Typography.Title level={5} style={{ margin: 0, color: 'white' }} onClick={() => handleBack('/emails')}>
                    Emails
                </Typography.Title>
            </div>
            <div class="category">
                <Typography.Title level={5} style={{ margin: 0, color: 'white' }} onClick={() => handleBack('/chart')}>
                    Chart
                </Typography.Title>
            </div>
            <div class="logout">
                <Typography.Title level={5} style={{ margin: 0, color: 'white' }} onClick={() => auth.signOut()}>
                    Logout
                </Typography.Title>
            </div>
        </div>
    )
}