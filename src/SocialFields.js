import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore'
import { db } from "./firebase-config";
import { Input } from 'antd';
import "./gamecustom.css";

export default function SocialFields ({igHandle, setIGHandle, fbPage, setFBPage, user}) {
    function handleFBChange(e) {
        setFBPage(e.target.value)
    }

    function handleIGChange(e) {
        setIGHandle(e.target.value)
    }

    return (
        <div>
            <div className="input-container">
                <Input addonBefore="IG Handle" placeholder='Instagram Account Name, ie: @shaheryarajmal' value={igHandle} onChange={handleIGChange}></Input>
            </div>
            <div className="input-container">
                <Input addonBefore="FB Page Link" placeholder='FB Page Link, ie: https://www.facebook.com/Entrepreneur' value={fbPage} onChange={handleFBChange}></Input>
            </div>
        </div>
    )
}