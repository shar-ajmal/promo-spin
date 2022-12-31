import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";
import './navbar.css'

export default function Navbar() {

    const navigate = useNavigate();

    const handleBack = (page) => {
        navigate(page)
    }

    return(
        <div class="topnav">
            <a onClick={() => handleBack('/')}>Admin</a>
            <a onClick={() => handleBack('/emails')}>Emails</a>
            <a onClick={() => handleBack('/chart')}>Chart</a>
            <a onClick={() => handleBack('/spin')}>User Form</a>
            <a onClick={() => auth.signOut()}>Logout</a>
        </div>
    )
}