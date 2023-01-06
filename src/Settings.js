import { useState, useEffect } from "react"
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore'
import { db } from "./firebase-config";
import Navbar from "./Navbar"
import {saveAs} from "file-saver";

export default function Settings({user}) {
    const [busName, setBusName] = useState("");
    const [qrCode, setQrCode] = useState();
    const [numInfo, setNumInfo] = useState();
    const qrCodeCollectionRef = collection(db, 'qrCodes')
    const busNameCollectionRef = collection(db, 'busName')
    const infoCollectionRef = collection(db, 'collected_info')


    function handleChange(e) {
        setBusName(e.target.value)
    }

    function onSave() {
        console.log("inside onsve")
        getDocs(query(busNameCollectionRef, where("user_id", "==", user.uid))).then((res) => {
            console.log("hello world!")
            console.log(res.docs[0].id)
            console.log(res.snapshot)
            if (res.docs.length === 0) {
                console.log("adding name")
                addDoc(busNameCollectionRef, {'user_id': user.uid, 'name': busName})
            }
            else {
                const docRef = doc(db, "busName", res.docs[0].id);
                updateDoc(docRef, {'name': busName})
            }
        })
    }

    function downloadQRCode () {
        saveAs(qrCode, "Spin-Wheel-QRCode");
    }

    useEffect(() => {
        const getQRCode = async() => {
            console.log("inside qr code use effect")
            let data = await getDocs(query(qrCodeCollectionRef, where("user_id", "==", user.uid)));
            setQrCode(data.docs.map((doc) => ({...doc.data()}))[0]['urlRef'])
            console.log('exiting use effect')
        }

        getQRCode()
        getBusName()
        getCollectedInfo()
    }, [])

    const getBusName = async() => {
        console.log("inside bu nme")
        let data = await getDocs(query(busNameCollectionRef, where("user_id", "==", user.uid)));
        console.log(data.docs.map((doc) => ({...doc.data()}))[0])
        if (data != undefined) {
            setBusName(data.docs.map((doc) => ({...doc.data()}))[0]['name'])
        }
    }

    const getCollectedInfo = async() => {
        console.log("in info num")
        let data = await getDocs(query(infoCollectionRef, where("user_id", "==", user.uid)));
        let docs = data.docs.map((doc) => ({...doc.data()}))
        setNumInfo(docs.length)
    }


    return (
        <div>
            <Navbar user={user}></Navbar>
            <h3>Business Name</h3>
            <div className="bus-container">
                <div class="input-margin">
                    <input placeholder="Enter Restaurant Name" value={busName} onChange={handleChange}/>
                </div>
                <button class="bus-container-button" onClick={onSave}>Save</button>
            </div>
            <h5>Emails Collected: {numInfo}</h5>
            <div class="input-margin">
                <h1>QR Code</h1>
                <p>This code will link to the user form. Download it and have clients scan it to spin a prize.</p>
                <button class="button-blue" onClick={downloadQRCode}>Download</button>
                <div class="margin-20"><img src={qrCode}/></div>
            </div>
        </div>

    )
}