import {useState, useEffect, useRef} from 'react';
import {db} from './firebase-config'
import { async } from '@firebase/util';
import { collection, getDocs ,addDoc, query, where, onSnapshot } from 'firebase/firestore'
import emailjs from '@emailjs/browser';
import NavbarUserForm from './NavbarUserForm'

export default function UserForm({gameData, userId, wheelElements, selectItem}) {
    const collectedInfoRef = collection(db, 'collected_info')
    const userCollectionRef = collection(db, 'users')

    console.log("in user form")
    console.log(userId)

    const [sendFields, setSendFields] = useState({'item_name': ''})

    const [gameFields, setGameFields] = useState([])

    const [formFields, setFormFields] = useState([])

    const[selectedItem, setSelectedItem] = useState('')

    const form = useRef();
    const didMount = useRef(false);

    useEffect(() => {
        console.log("Inside the user form")
        console.log(gameData)
        var formFieldJSON = {}
        gameData['form_fields'].forEach(element => {
            formFieldJSON[element['fieldName']] = ''
        });

        console.log(formFieldJSON)
        setSendFields(formFieldJSON)
    }, [])

    useEffect(() => {
        if ( !didMount.current || selectedItem['item_name'] === "" ) {
            console.log("Exiting")
            didMount.current = true;
            return;
        }
        console.log("USE EFFECT")
        console.log(selectedItem)
        sendEmail()
    }, [selectedItem])

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log(sendFields)
        if (sendFields['user_email'] === "") {
            alert("Please Enter Email Address")
            return
        }
        const qSnap = await getDocs(query(collectedInfoRef, where("email", "==", sendFields['email']), where("game_id", "==", gameData.game_id)));
        
        if (qSnap.size) {
            alert("email alredy exists!")
          } else {
            submitInfo()
          }
    }

    function submitInfo() {
        var selectedItemIndex = selectItem()
        var spinnedItem = wheelElements[selectedItemIndex]
        setSelectedItem(spinnedItem)
        console.log("IN SUBMIT INFO")
        console.log(spinnedItem)
        setSelectedItem(spinnedItem)
        var collectedInfoList = []
        for (var key in sendFields) {
            console.log("looking at send fields")
            console.log(sendFields)
            console.log(key)
            var obj = {}
            obj[key] = sendFields[key]
            collectedInfoList.push(obj)
        }

        if (sendFields['email'] != "") {
            addDoc(collectedInfoRef,  {
                'collected_info': collectedInfoList, 
                'timestamp': Date.now(), 
                'email': sendFields['email'],
                'item_name': spinnedItem,
                'game_id': gameData.game_id, 
                'user_id': gameData.user_id
            })
        }

        console.log("sending email")
    }

    function sendEmail () {
        console.log("in send email")
        console.log(sendFields)
        console.log(selectedItem)
        const allFields = {...sendFields}
        allFields['item_name'] = selectedItem
        allFields['game_name'] = gameData['game_name']

        emailjs.send('service_5fq3k6n', 'template_eidfxld', allFields, '_5voPVzogLZi48BMl')
          .then((result) => {
              console.log(result.text);
          }, (error) => {
              console.log(error.text);
          });
          setTimeout(() => {
            if (allFields['item_name'] === "") return;

            console.log("in alert")
            console.log(allFields)
            var alertMessage = "You have won "+allFields['item_name']+". An email has been sent to " + allFields['email'] + ". Show the email to claim your prize."
            if(!alert(alertMessage)){window.location.reload();}
          }, 2000)
    };

    const handle_change = (e) => {
        console.log("handing change")
        setSendFields({...sendFields, [e.target.name]: e.target.value })
        console.log(e.target.name)
    }

    return (
        <form onSubmit={handleSubmit} class="user-form input-margin">
            {gameData['form_fields'].map((element, index) => {
                return <input placeholder={element.fieldName} name={element.fieldName} value={sendFields[element['fieldName']]} onChange={handle_change}/>
            })}
            <button type="submit" class="submit-button button-green" type="submit">Spin</button>
        </form>
    )
}