import { useState, useEffect } from "react"
export default function EmailList({emailList}) {

    const [displayEmails, setDisplayEmails] = useState()

    useEffect(() => {
        setDisplayEmails(emailList)
    })
    return (
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
    )
}