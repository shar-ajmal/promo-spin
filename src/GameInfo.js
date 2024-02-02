import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc, query, where} from 'firebase/firestore'
import { db, storage } from "./firebase-config";
// import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { Input, Button, Space, Typography } from 'antd';

import GameName from "./GameName";
import GameFields from "./GameFields";
import Settings from "./Settings";
import SocialFields from "./SocialFields";
import GameColors from "./GameColors";
import UploadLogo from "./UploadLogo";
import CodeSnippet from "./CodeSnippet";

import "./gamecustom.css";

export default function GameInfo ({igHandle, setIGHandle, fbPage, setFBPage, user, gameData, textColor, wheelColor, setWheelColor, setTextColor, gameName, setGameName, displayName, setDisplayName, file, setFile, imagePreviewUrl, setImagePreviewUrl}) {
    const [formFields, setFormFields] = useState([])
    // const [gameName, setGameName] = useState()
   


    useEffect(() => {
        setFormFields(gameData.form_fields)
        // setGameName(gameData.game_name)
        if (gameData.ig_handle) {
            setIGHandle(gameData.ig_handle)
        }
        if (gameData.fb_page) {
            setFBPage(gameData.fb_page)
        }
    }, [])

    function save() {
        // saveGameName()
        // saveGameFields()
        // saveSocialFields()
        // saveGameColorsDisplay()
        // saveLogo()
    }

    const saveButtonStyle = {
        background: '#52c41a',
    borderColor: '#52c41a',
    color: '#fff',
    fontWeight: 500,
    transition: 'all 0.3s ease-in-out',
    float: 'right'
      };

      const hoverStyle = {
        background: '#5eff5e',
        borderColor: '#5eff5e',
        transition: 'all 0.3s ease-in-out',
      };


    // const saveLogo = async () => {
    //     // if (!file) return;

    //     const gameId = gameData.id;

    //     // Create a storage reference
    //     const storageRef = ref(storage, `userLogos/${gameId}/logo.png`);

    //     try {
    //         // If there's already a logo, delete it before uploading the new one
    //         await deleteObject(storageRef).catch(error => {
    //         // It's okay if the delete failed because the file didn't exist
    //         if (error.code !== 'storage/object-not-found') {
    //             throw error;
    //         }
    //         });

    //         // Upload the new file
    //         const snapshot = await uploadBytes(storageRef, file);
    //         // Get the download URL
    //         const downloadURL = await getDownloadURL(snapshot.ref);

    //         // Save the download URL to the user's document in Firestore
    //         const userRef = doc(db, 'games', gameId);
    //         await updateDoc(userRef, {
    //         logoURL: downloadURL,
    //         });

    //         console.log('File uploaded and URL saved to Firestore!');
    //     } catch (error) {
    //         console.error('Error uploading image and saving URL:', error);
    //     }
    // };


      const saveGameColorsDisplay = async() => {
        const updateData ={
            'wheelColor': wheelColor, 
            'textColor': textColor, 
            'displayName': displayName,
        }

        const gamesCollectionRef = collection(db, 'games');
        const docRef = await getDocs(query(gamesCollectionRef, where('user_id', '==', user.uid), where('game_id', '==', gameData.game_id)));
        getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid), where('game_id', '==', gameData.game_id))).then((res) => {
            const docRef = doc(db, "games", res.docs[0].id);
            console.log(docRef)
            updateDoc(docRef, updateData);
        })
        if (docRef.empty) {
            console.log('No matching documents.');
            return;
        }
    }

    const saveGameFields = async() => {
        const gamesCollectionRef = collection(db, 'games');
        const docRef = await getDocs(query(gamesCollectionRef, where('user_id', '==', user.uid), where('game_id', '==', gameData.game_id)));
        getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid), where('game_id', '==', gameData.game_id))).then((res) => {
            const docRef = doc(db, "games", res.docs[0].id);
            console.log(docRef)
            updateDoc(docRef, { 'form_fields': formFields });
        })
        if (docRef.empty) {
            console.log('No matching documents.');
            return;
        }
    }

    const saveSocialFields = async() => {
        const gamesCollectionRef = collection(db, 'games');
        const docRef = await getDocs(query(gamesCollectionRef, where('user_id', '==', user.uid), where('game_id', '==', gameData.game_id)));
        getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid), where('game_id', '==', gameData.game_id))).then((res) => {
            const docRef = doc(db, "games", res.docs[0].id);
            console.log(docRef)
            updateDoc(docRef, { 'ig_handle': igHandle, 'fb_page': fbPage });
        })
        if (docRef.empty) {
            console.log('No matching documents.');
            return;
        }
    }

    const saveGameName = async () => {
        const gamesCollectionRef = collection(db, 'games');
        const docRef = await getDocs(query(gamesCollectionRef, where('user_id', '==', user.uid), where('game_id', '==', gameData.game_id)));
        getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid), where('game_id', '==', gameData.game_id))).then((res) => {
            const docRef = doc(db, "games", res.docs[0].id);
            console.log(docRef)
            updateDoc(docRef, { 'game_name': gameName });
        })
        if (docRef.empty) {
            console.log('No matching documents.');
            return;
        }
        // console.log("game name update")
        // console.log(gameName)
    }

    return (
        <div>
            <Typography.Title level={2} style={{ margin: 0 }}>
                Form Field Customization
            </Typography.Title>
            <br></br>

            <Typography.Title level={3} style={{ margin: 0 }}>
                Game Name
            </Typography.Title>
            {/* {gameData ? <GameName gameData={gameData} user={user} /> : <p>Loading...</p>} */}
            {gameData ? <GameName setDisplayName={setDisplayName} displayName={displayName} gameName={gameName} setGameName={setGameName} user={user} /> : <p>Loading...</p>}
            <br></br>

            <Typography.Title level={3} style={{ margin: 0 }}>
                Game Colors
            </Typography.Title>
            {gameData ? <GameColors setWheelColor={setWheelColor} setTextColor={setTextColor} wheelColor={wheelColor} textColor={textColor} s/> : <p>Loading...</p>}
            <br></br>

            <Typography.Title level={3} style={{ margin: 0 }}>
                Game Logo
            </Typography.Title>
            <UploadLogo imagePreviewUrl={imagePreviewUrl} setImagePreviewUrl={setImagePreviewUrl} file={file} setFile={setFile}></UploadLogo>
            <br></br>
            
            <Typography.Title level={3} style={{ margin: 0 }}>
                Social Media Links
            </Typography.Title>
            {gameData ? <SocialFields fbPage={fbPage} setFBPage={setFBPage} igHandle={igHandle} setIGHandle={setIGHandle} user={user} /> : <p>Loading...</p>}

            <Typography.Title level={3} style={{ margin: 0 }}>
                Game Form Fields
            </Typography.Title>
            {gameData ? <GameFields gameData={gameData} user={user} formFields={formFields} setFormFields={setFormFields}></GameFields> : <p>Loading...</p>}
            <br></br>
            {/* <Button className='save-button' style={saveButtonStyle}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = hoverStyle.background;
                    e.currentTarget.style.borderColor = hoverStyle.borderColor;
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = saveButtonStyle.background;
                    e.currentTarget.style.borderColor = saveButtonStyle.borderColor;
                }}
            onClick={save}>Save</Button> */}
            <br></br>
            <Typography.Title level={3} style={{ margin: 0 }}>
                Add Spin Wheel in Website
            </Typography.Title>
            <br></br>
            {gameData ? <CodeSnippet gameData={gameData}/> : <p>Loading...</p>}
            <Typography.Title level={3} style={{ margin: 0 }}>
                QR Code
            </Typography.Title>
            <br></br>
            {gameData ? <Settings gameData={gameData}/> : <p>Loading...</p>}
            <br></br>
            

        </div>
    )



}