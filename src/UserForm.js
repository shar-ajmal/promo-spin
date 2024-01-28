import {useState, useEffect, useRef} from 'react';
import {db} from './firebase-config'
import { collection, getDocs ,addDoc, query, where, onSnapshot } from 'firebase/firestore'
import emailjs from '@emailjs/browser';
import { Checkbox } from 'antd';
import { CheckboxProps } from 'antd';


export default function UserForm({apothec, widget, setSelectedItemTop, gameData, wheelElements, selectItem}) {
    const collectedInfoRef = collection(db, 'collected_info')
    const [role, setRole] = useState("")
    const [winEmail, setWinEmail] = useState("")
    const [adminEmail, setAdminEmail] = useState("")
    const freePlanLimit = 150;
    const [consent, setConsent] = useState(false)

    console.log("in user form")
    // console.log(userId)

    const [sendFields, setSendFields] = useState({'item_name': ''})

    const[selectedItem, setSelectedItem] = useState(null)

    const winEmailCollectionRef = collection(db, 'win_emails')
    const usersCollectionRef = collection(db, 'users')

    const form = useRef();
    const didMount = useRef(false);

    // async function getRole() {
    //     console.log("ROLE")
    //     const value = await getCustomClaimRole();
    //     console.log(value)
    //     setRole("pro")
    // }

    const getWinEmail = async() => {
        console.log("Getting the win email")
        // console.log(userId)
        const data = await getDocs(query(winEmailCollectionRef, where('user_id', '==', gameData.user_id)));
        console.log("getting data")
        console.log(data)
        const doc = data.docs.map((doc) => ({...doc.data(), id:doc.id}))[0]
        console.log(doc)
        setWinEmail(doc.text)
    }

    // useEffect(() => {
    //     if (gameData.length > 0) {
    //         getWinEmail()
    //     }
    // }, [])

    // useEffect(() => {
    //     getRole()
    // }, [])

    // const navigate = useNavigate();

    // const handleBack = (page) => {
    //     navigate(page)
    // }

    useEffect(() => {
        console.log("Inside the user form")
        console.log(gameData)
        var formFieldJSON = {}
        if (gameData.length >  0) {
            gameData['form_fields'].forEach(element => {
                formFieldJSON[element['fieldName']] = ''
            });
        }

        console.log(formFieldJSON)
        setSendFields(formFieldJSON)
    }, [])

    const getAdminEmail = async() => {
        const data = await getDocs(query(usersCollectionRef, where('user_id', '==', gameData.user_id)));
        const doc = data.docs.map((doc) => ({...doc.data(), id:doc.id}))[0]
        setAdminEmail(doc.email)
    }

    useEffect(() => {
        if (gameData != undefined) {
            getAdminEmail()
        }
    }, [gameData])

    useEffect(() => {
        // if ( !didMount.current || selectedItem['item_name'] === "" ) {
        //     console.log("Exiting")
        //     didMount.current = true;
        //     return;
        // }
        console.log("USE EFFECT")
        console.log(selectedItem)
        if (selectedItem) {
            console.log("sending the email")
            sendEmail()
        }
    }, [selectedItem])

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log(sendFields)
        if (sendFields['email'] === "") {
            alert("Please Enter Email Address")
            return
        }
        // const allDocRefs = await getDocs(query(collectedInfoRef, where("game_id", "==", gameData.game_id)));

        // console.log("printing doc ref size", allDocRefs.size)

        // if (role != "pro" && allDocRefs.size >= freePlanLimit) {
        //     alert ("Business owner needs to upgrade plan! Email Limit Hit!")
        //     return;
        // }
        const qSnap = await getDocs(query(collectedInfoRef, where("email", "==", sendFields['email']), where("game_id", "==", gameData.game_id)));
        submitInfo()
        // if (!qSnap.empty) {
        //     alert("email alredy exists!")
        // } else {
        //     submitInfo()
        // }
    }

    function modifyWinEmail(spinnedItem) {
        const winEmailMap = {
            '{game_name}' : gameData.game_name,
            '{prize_name}': spinnedItem
        }
        console.log(winEmailMap)

        // var winEmail2 = "Thanks for playing with {game_name}. You have won {prize_name}. Show this email to the booasdfasdfth manager to claim your prize! Best Wishes, Shaheryar Ajmal"
        // var wordArray = winEmail.split(" ")

        const game_name_regex = /{game_name}/g
        const prize_name_regex = /{prize_name}/g
        var modifiedString = winEmail.replace(game_name_regex, gameData.game_name)
        modifiedString = modifiedString.replace(prize_name_regex, spinnedItem)

        console.log(modifiedString)

        return modifiedString


        // for (const key in winEmailMap) {
        //     const regexString = /key/g
        //     // const regexString = `/${string}/g`;
        //     // const regexExpression = new RegExp(regexString.slice(1, -1));
        //     // regexExpression.lastIndex = 0;

        //     // const regex = new RegExp(key);

        //     console.log("print regex")
        //     console.log(regexString)
        //     console.log(winEmailMap[key])
        //     console.log(winEmail.replace(regexString, winEmailMap[key]))
        // }

        // for (var i=0; i< wordArray.length; i++) {

        //     var word = wordArray[i]
        //     // console.log(word.replace(
        //     //     /{([^}]+)}/g,
        //     //     (match, placeholder) => winEmailMap[placeholder] || match
        //     //   ))
        //     if (word in winEmailMap) {
        //         console.log("found word")
        //         console.log(word)
        //         word = winEmailMap[word]
        //     }
        //     wordArray[i] = word
        // }

        // console.log(wordArray)

        // console.log(wordArray.join(" "))



        // const replacedTemplate = winEmail.replace(
        //     /{([^}]+)}/g,
        //     (match, placeholder) => winEmailMap[placeholder] || match
        //   );

        //   console.log(replacedTemplate)

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
        collectedInfoList.push({'Consented to Marketing': consent.toString()})

        if (sendFields['email'] != "") {
            addDoc(collectedInfoRef,  {
                'collected_info': collectedInfoList, 
                'timestamp': Date.now(), 
                'email': sendFields['email'],
                'item_name': spinnedItem,
                'game_id': gameData.game_id, 
                'user_id': gameData.user_id, 
                'consent': consent,
            })
        }

        console.log("sending email")
    }

    function sendEmail () {
        console.log("in send email")
        console.log(sendFields)
        console.log(selectedItem)
        // const emailText = modifyWinEmail(selectedItem)
        const emailText = ""

        const allFields = {...sendFields}
        allFields['send_email'] = emailText
        allFields['item_name'] = selectedItem
        allFields['send_to_email'] =  sendFields['email']
        allFields['admin_email'] = adminEmail
        // allFields['user_name']:
        allFields['game_name'] = gameData['game_name']
        console.log("printing out all fields")
        console.log(allFields)
        emailjs.send('service_hffutvo', 'template_ve594cg', allFields, '6Eohf7T4_Yeh7W24i')
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
            // if(!alert(alertMessage)){window.location.reload();}

            console.log("printing string")
            console.log(allFields['item_name'])
            const addUnderscores = (str) => str.replace(/ /g, '_');

            const modifiedString = addUnderscores(allFields['item_name']);
            const resolutionUrl = '/resolution/' + gameData.game_id + '/' + modifiedString
            widget ? setSelectedItemTop(selectedItem): window.location.href = resolutionUrl;
          }, 2000)
    };

    const handle_change = (e) => {
        console.log("handing change")
        setSendFields({...sendFields, [e.target.name]: e.target.value })
        console.log(e.target.name)
    }

    const checkboxOnChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
        console.log("inside checkbox")
        console.log(e.target.checked)
        setConsent(e.target.checked)
      };

    return (
        <form class="user-form input-margin">
            {console.log("loading game data")}
            <Checkbox onChange={checkboxOnChange}>Consent to Receiving Marketing Material</Checkbox>
            {console.log(gameData['form_fields'])}
            {
                gameData && Array.isArray(gameData['form_fields']) &&
                gameData['form_fields'].map((element, index) => {
                    return (
                        <input 
                            key={index}
                            placeholder={element.fieldName} 
                            name={element.fieldName} 
                            value={sendFields[element['fieldName']]} 
                            onChange={handle_change} 
                        />
                    );
                })
            }

            <button onClick={handleSubmit} type="submit" class="submit-button button-green">Spin</button>
        </form>
    )
}