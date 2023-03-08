import { useState, useEffect } from "react"
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore'
import { db } from "./firebase-config";
import Navbar from "./Navbar"
import {saveAs} from "file-saver";

export default function Settings({gameData}) {
    const [busName, setBusName] = useState("");
    const [qrCode, setQrCode] = useState();
    const [numInfo, setNumInfo] = useState();
    // const qrCodeCollectionRef = collection(db, 'qrCodes')
    // const busNameCollectionRef = collection(db, 'busName')
    const infoCollectionRef = collection(db, 'collected_info')
    const userCollectionRef = collection(db, 'users')



    // function handleChange(e) {
    //     setBusName(e.target.value)
    // }

    // function onSave() {
    //     console.log("inside onsve")
    //     getDocs(query(userCollectionRef, where("user_id", "==", user.uid))).then((res) => {
    //         console.log("hello world!")
    //         console.log(res.docs[0].id)
    //         console.log(res.snapshot)
    //         const docRef = doc(db, "users", res.docs[0].id);
    //         console.log(docRef)
    //         updateDoc(docRef, {'business_name': busName})
    //         // if (res.docs.length === 0) {
    //         //     console.log("adding name")
    //         //     addDoc(busNameCollectionRef, {'user_id': user.uid, 'name': busName})
    //         // }
    //         // else {
    //         //     const docRef = doc(db, "busName", res.docs[0].id);
    //         //     updateDoc(docRef, {'name': busName})
    //         // }
    //     })
    // }

    function downloadQRCode () {
        var downloadTitle = gameData.game_name + '-QRCode'
        saveAs(qrCode, downloadTitle);
    }

    const getGameInfo = async() => {
        setQrCode(gameData.qr_code)
        console.log("in info num")
        let data = await getDocs(query(infoCollectionRef, where("game_id", "==", gameData.game_id)));
        let docs = data.docs.map((doc) => ({...doc.data()}))
        setNumInfo(docs.length)
    }


    // const userInfo = async() => {
    //     console.log("inside qr code use effect")
    //     let data = await getDocs(query(userCollectionRef, where("user_id", "==", user.uid)));
    //     let snap = data.docs.map((doc) => ({...doc.data()}))[0]
    //     setQrCode(snap['urlRef'])
    //     setBusName(snap['business_name'])
    //     console.log('exiting use effect')
    // }

    useEffect(() => {
        // const getQRCode = async() => {
        //     console.log("inside qr code use effect")
        //     let data = await getDocs(query(qrCodeCollectionRef, where("user_id", "==", user.uid)));
        //     setQrCode(data.docs.map((doc) => ({...doc.data()}))[0]['urlRef'])
        //     console.log('exiting use effect')
        // }

        // getQRCode()
        // getBusName()
        getGameInfo()
    }, [])

    // const getBusName = async() => {
    //     console.log("inside bu nme")
    //     let data = await getDocs(query(busNameCollectionRef, where("user_id", "==", user.uid)));
    //     console.log(data.docs.map((doc) => ({...doc.data()}))[0])
    //     if (data != undefined) {
    //         setBusName(data.docs.map((doc) => ({...doc.data()}))[0]['name'])
    //     }
    // }

    const getCollectedInfo = async() => {
        console.log("in info num")
        let data = await getDocs(query(infoCollectionRef, where("game_id", "==", gameData.game_id)));
        let docs = data.docs.map((doc) => ({...doc.data()}))
        setNumInfo(docs.length)
    }


    return (
        <div>
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