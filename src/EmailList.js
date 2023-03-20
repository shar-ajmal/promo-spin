import { useState, useEffect } from "react"
import moment from 'moment'
import standardizeData from "./firebase-config"

export default function EmailList({emailList}) {

    const [displayEmails, setDisplayEmails] = useState([])
    const [largestObject, setLargestObject] = useState([])

    useEffect(() => {
        var formattedEmails = standardizeData(emailList)
        console.log("this is the formatted email list")
        console.log(formattedEmails)
        // if (formattedEmails.length > 0) {
        //     const keySet = formattedEmails.reduce((set, obj) => {
        //         Object.keys(obj).forEach(key => set.add(key));
        //         return set;
        //       }, new Set());
        //       const keyObject = Object.fromEntries(Array.from(keySet).map(key => [key, undefined]));

        //     setLargestObject(keyObject)
        //     console.log("Largest key set")
        //     console.log(keyObject)
        // }
        setDisplayEmails(formattedEmails)
        if (formattedEmails.length > 0) {
            console.log("getting formatted emails")
            console.log(formattedEmails[0])
            setLargestObject(formattedEmails[0])
        }
        
    }, [emailList])

    // function formatEmails(list) {
    //     var formEntries = []
    //     list.forEach((element) => {
    //         var formValue = {'prize': element['item_name']}
    //         var dateString = moment.unix(element['timestamp']).format("MM/DD/YYYY");
    //         formValue['date'] = dateString
    //         element['collected_info'].forEach((obj) => {
    //             var key = Object.keys(obj)[0];
    //             var value = obj[key];
    //             formValue[key] = value
    //         })
    //         formEntries.push(formValue)
    //     })

    //     return formEntries
    // }

    return (
        <table class="email-table">
            <tr>
            {Object.keys(largestObject).map(key => (
                <th key={key}>{key}</th>
            ))}
            </tr>
            {displayEmails.map((element, index) => { return (
                <tr key={index}>
                    {Object.keys(largestObject).map((key, index) => (
                        <td key={index}>
                            {element[key] || ''}
                        </td>
                    ))}
                </tr>
            )})}
        </table>
    )
}