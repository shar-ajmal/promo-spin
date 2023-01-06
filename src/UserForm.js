import {useState, useEffect, useRef} from 'react';
import {db} from './firebase-config'
import { async } from '@firebase/util';
import { collection, getDocs ,addDoc, query, where, onSnapshot } from 'firebase/firestore'
import emailjs from '@emailjs/browser';
import NavbarUserForm from './NavbarUserForm'

export default function UserForm({userId, wheelElements, selectItem}) {
    const collectedInfoRef = collection(db, 'collected_info')
    console.log("in user form")
    console.log(userId)

    const [sendFields, setSendFields] = useState({
        'user_email': '',
        'restaurant_name': 'Coughlins Law',
        'item_name': '',
    })
    const form = useRef();
    const didMount = useRef(false);

    useEffect(() => {
        if ( !didMount.current || sendFields['item_name'] === "" ) {
            console.log("Exiting")
            didMount.current = true;
            return;
        }
        console.log("USE EFFECT")
        console.log(sendFields)
        sendEmail()
    }, [sendFields['item_name']])

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log(sendFields)
        const qSnap = await getDocs(query(collectedInfoRef, where("email", "==", sendFields['user_email']), where("user_id", "==", userId)));

        if (qSnap.size) {
            alert("email alredy exists!")
          } else {
            submitInfo()
          }
    }

    function submitInfo() {
        var selectedItemIndex = selectItem()
        var selectedItem = wheelElements[selectedItemIndex]
        console.log("IN SUBMIT INFO")
        console.log(selectedItem)
        setSendFields({...sendFields, item_name: selectedItem})

        if (sendFields['user_email'] != "") {
            addDoc(collectedInfoRef,  {'email': sendFields['user_email'], 'timestamp': Date.now(), 'user_id': userId})
        }

        // if (sendFields['user_email'] != "") {
        //     addDoc(emailCollection,  {'email': sendFields['user_email']})
        // }

        // if (sendFields['user_phone'] != "") {
        //     addDoc(phoneCollection,  {'phone_number': sendFields['user_phone']})
        // }
        console.log("sending email")
    }

    function sendEmail () {
        console.log("in send email")
        console.log(sendFields)
        emailjs.send('service_5fq3k6n', 'template_eidfxld', sendFields, '_5voPVzogLZi48BMl')
          .then((result) => {
              console.log(result.text);
          }, (error) => {
              console.log(error.text);
          });
          setTimeout(() => {
            if (sendFields['item_name'] === "") return;

            console.log("in alert")
            console.log(sendFields)
            var alertMessage = "You have won "+sendFields['item_name']+". An email has been sent to " + sendFields['user_email'] + ". Show the email to claim your prize."
            if(!alert(alertMessage)){window.location.reload();}
          }, 2000)
    };

    const handle_change = (e) => {
        setSendFields({...sendFields, [e.target.name]: e.target.value })
        console.log(e.target.name)
    }

    return (
        <form onSubmit={handleSubmit} class="user-form input-margin">
            <input placeholder='email' name="user_email" value={sendFields['user_email']} onChange={handle_change}/><br/>
            <button class="submit-button button-green" type="submit">Spin</button>
        </form>
    )
}