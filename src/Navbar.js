import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";
import './navbar.css'

export default function Navbar({user}) {
    const spinUrl = "/spin/" + user.uid
    const navigate = useNavigate();

    const handleBack = (page) => {
        navigate(page)
    }

    return(
        <div class="topnav">
            <a class="category" onClick={() => handleBack('/')}>Admin</a>
            <a class="category" onClick={() => handleBack('/emails')}>Emails</a>
            <a class="category" onClick={() => handleBack('/chart')}>Chart</a>
            <a class="logout" onClick={() => auth.signOut()}>Logout</a>
        </div>
    )
}