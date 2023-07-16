import { useState, useEffect } from "react";
import {db} from './firebase-config'
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where,doc,  whereIn, setDoc, updateDoc, addDoc } from 'firebase/firestore'
import moment from 'moment'
import Navbar from "./Navbar";
import DropdownButton from "./DropdownButton";
import EmailList from "./EmailList";

import { standardizeData } from "./firebase-config"
import {Button, Input, Typography} from 'antd';
import { getCustomClaimRole } from './firebase-config';
import './sendemail.css'
import emailjs from '@emailjs/browser';

import { Table } from 'antd';

const { Text } = Typography; 


const { TextArea } = Input;

export default function SendEmails({user}) {
    const [role, setRole] =  useState([])
    const [filteredEmailList, setFilteredEmailList] = useState()
    const [globalEmailList, setGlobalEmailList] = useState([])
    const [gameList, setGameList] = useState([])
    const navigate = useNavigate();
    const [winEmail, setWinEmail] = useState("")

    const [sendEmail, setSendEmail] = useState('')

    const collectedInfoRef = collection(db, 'collected_info');
    const gamesCollectionRef = collection(db, 'games');
    const winEmailCollectionRef = collection(db, 'win_emails')

    async function getRole() {
        console.log("ROLE")
        const value = await getCustomClaimRole();
        console.log(value)
        setRole(value)
    }

    const saveButtonStyle = {
        background: '#52c41a',
    borderColor: '#52c41a',
    color: '#fff',
    fontWeight: 500,
    transition: 'all 0.3s ease-in-out',
      };

      const hoverStyle = {
        background: '#5eff5e',
        borderColor: '#5eff5e',
        transition: 'all 0.3s ease-in-out',
      };

    useEffect(() => {
        getRole()
    }, [])

    useEffect(() => {
        getWinEmail()
    }, [])

    useEffect(() => {
        getGameData()
    }, [role]);

    const dataRoles = [
        {
          key: '1',
          Variable: '{game_name}',
          Description: 'Your game name. Once you set your game name, this variable will replace the text "{game_name}" with your game name.',
        },
        {
            key: '2',
            Variable: '{prize_name}',
            Description: 'The prize the user wins. Whatever prize the user wins, his variable will replace the text "{prize_name}" with the prize they won.',
          },
      ];

    const columns = [
        {
            key: 'Variable',
            title: 'Variable',
            dataIndex: 'Variable',
        },

        {
            key: 'Description',
            title: 'Description',
            dataIndex: 'Description',
        }
    ]

    const getWinEmail = async() => {
        console.log("Getting the win email")
        const data = await getDocs(query(winEmailCollectionRef, where('user_id', '==', user.uid)));
        const doc = data.docs.map((doc) => ({...doc.data(), id:doc.id}))[0]
        console.log(doc)
        setWinEmail(doc.text)
    }

    const saveWinEmail = async () => {
        // const docRef = await getDocs(query(winEmailCollectionRef, where('user_id', '==', user.uid)));
        getDocs(query(winEmailCollectionRef, where("user_id", "==", user.uid))).then((res) => {
            const data = {'user_id': user.uid, 'text': winEmail}
            console.log("looking at res")
            if (res.empty) {
                // Document doesn't exist, so add it
                addDoc(winEmailCollectionRef, {'user_id': user.uid, 'text': winEmail});
            }
            else {
                const docRef = doc(db, "win_emails", res.docs[0].id);
                console.log("Printing doc reft stuff")
                console.log(docRef)
                console.log(docRef.empty)
                // Document exists, so update it
                updateDoc(docRef, {'user_id': user.uid, 'text': winEmail});
            } 
        })
      };

    function handleWinEmailChange(e) {
        setWinEmail(e.target.value)
    }

    function handleSetEmailChange(e) {
        setSendEmail(e.target.value)
    }

    function sendEmailtoSubscribers() {
        const emailLoad = {
            'user_name': user.name,
            'user_email': "shaheryar.ajmal@gmail.com",
            'send_email': sendEmail,
            'send_to_email': "muajmal@ucsc.edu"
        }
        console.log(user)
        console.log(emailLoad)
        emailjs.send('service_5fq3k6n', 'template_ogzj6u8', emailLoad, '_5voPVzogLZi48BMl')
          .then((result) => {
              console.log(result.text);
          }, (error) => {
              console.log(error.text);
          });
    }
      

    const getEmailData = async(tempGameList) => {
        console.log("Getting email data")
        var gameIdList = []
        console.log("getting game id list")
        tempGameList.map((element) => {
            if (element)
            gameIdList.push(element['game_id'])
        })

        console.log(gameIdList)
        
        if (gameIdList.length > 0) {
            
            let data =  role == "pro" ? await getDocs(query(collectedInfoRef, where("user_id", "==", user.uid))): await getDocs(query(collectedInfoRef, where("user_id", "==", user.uid), where("game_id", "in", gameIdList)));
            setGlobalEmailList(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
            console.log("Collecting email info")
            console.log(user.uid)
            console.log(gameIdList)
            console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
            setFilteredEmailList(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        }
    }

    const getGameData = async() => {
        let data = await getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid)));
        setGameList(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        console.log("printing out games list")
        console.log(data.docs.map((doc) => ({...doc.data(), id:doc.id})))
        var gameData = data.docs.map((doc) => ({...doc.data(), id:doc.id}))

        var tempGameList = [{'game_name': 'All Games', 'game_id': 1}]
        gameData.forEach((element) => {
            if (element.game_enabled) {
                tempGameList.push({
                    'game_name': element.game_name, 
                    'game_id': element.game_id
                })
            }
        })

        console.log("Looking at get gamedata function")
        console.log(role)
        console.log(tempGameList)

        if (role != "pro") {
            if (tempGameList.length != 0) {
                tempGameList = [tempGameList[0], tempGameList[1]]
            }
        }

        console.log("printing tempGameList")
        console.log(tempGameList)

        getEmailData(tempGameList)
    }

    function save() {

    }


    return (
        <div>
            <Navbar user={user}></Navbar>
            <div className="text-area-list">
                <div>
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        Win Email
                    </Typography.Title>
                    <div className="email-description">
                        <Text>This is the email that is sent to the user after they spin to win a prize.</Text>
                    </div>
                    <div className="text-area-container">
                        <TextArea rows={4} maxLength={500} value={winEmail} onChange={handleWinEmailChange}>
                        </TextArea>
                    </div>
                    <Button className='save-button' style={saveButtonStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = hoverStyle.background;
                            e.currentTarget.style.borderColor = hoverStyle.borderColor;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = saveButtonStyle.background;
                            e.currentTarget.style.borderColor = saveButtonStyle.borderColor;
                        }}
                    onClick={saveWinEmail}>Save</Button>
                    <div className="variable-table">
                        <Table pagination={false} dataSource={dataRoles} columns={columns} />
                    </div>
                </div>
                <div>
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        Send Email
                    </Typography.Title>
                    <div className="email-description">
                        <Text>Use this to send an email to everyone on your mailing list. WARNING: This email will be sent to all your subscribers!</Text>
                    </div>
                    <div className="text-area-container">
                        <TextArea rows={4} maxLength={500} onChange={handleSetEmailChange}>
                        </TextArea>
                    </div>
                    <Button type="primary" onClick={sendEmailtoSubscribers}>Send Email</Button>
                </div>
            </div>
        </div>
    )
}