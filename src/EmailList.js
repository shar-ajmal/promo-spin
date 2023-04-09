import { useState, useEffect } from "react"
import moment from 'moment'
import { standardizeData } from "./firebase-config"
import { Space, Table, Tag } from 'antd';

export default function EmailList({emailList}) {

    const [displayEmails, setDisplayEmails] = useState([])
    const [tableKeys, setTableKeys] = useState([])

    useEffect(() => {
        var formattedEmails = standardizeData(emailList)
        console.log("this is the formatted email list")
        console.log(formattedEmails)
        setDisplayEmails(formattedEmails)
        if (formattedEmails.length > 0) {
            console.log("getting formatted emails")
            console.log(formattedEmails[0])
            var keyList = Object.keys(formattedEmails[0])
            var keyDictList = []
            for (var key of keyList) {
                var keyListObj = {
                    'title': key, 
                    'dataIndex': key,
                    'key': key
                }
                keyDictList.push(keyListObj)
            }

            setTableKeys(keyDictList)
        }
        
    }, [emailList])


    return (
        <Table columns={tableKeys} dataSource={displayEmails} />
    )
}