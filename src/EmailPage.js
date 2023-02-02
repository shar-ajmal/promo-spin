import { useState, useEffect } from "react";
import {db} from './firebase-config'
import { read, utils, writeFileXLSX } from 'xlsx';
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from 'firebase/firestore'

import Navbar from "./Navbar";

export default function EmailPage({user}) {
    const [emailList, setEmailList] = useState([])
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/')
    }

    useEffect(() => {
        const collectedInfoRef = collection(db, 'collected_info');
        
        const getEmailData = async() => {
            let data = await getDocs(query(collectedInfoRef, where("user_id", "==", user.uid)));
            setEmailList(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
            // console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        }

        getEmailData()
    }, []);

    function exportData () {
        var wb = utils.book_new();
        var ws = utils.json_to_sheet(emailList);

        utils.book_append_sheet(wb, ws, "MySheet1");
        writeFileXLSX(wb, "Test1.xlsx")
    }

    return (
        <div>
            <Navbar user={user}></Navbar>
            <button onClick={exportData}>Export</button>
            <table class="email-table">
                <tr>
                    <th>
                        Email
                    </th>
                    <th>
                        Prize
                    </th>
                </tr>
                {emailList.map((element, index) => { return (
                    <tr>
                        <td>
                            {element['email']}
                        </td>
                        <td>
                            {element['item_name']}
                        </td>
                    </tr>
                )})}
            </table>
        </div>
    )
}