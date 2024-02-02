import { useState, useEffect } from "react"
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore'
import { db } from "./firebase-config";
import Navbar from "./Navbar"
import {saveAs} from "file-saver";
import { Typography, Button } from 'antd';

export default function CodeSnippet ({gameData}) {
    const [bodyString, setBodyString] = useState('')
    const [headerString, setHeaderString] = useState('')
    const { Text, Link, Title } = Typography;

    const htmlString = `
    <div id="spinWheelTrigger"></div>
    <script  src='https://promo-spin-staging.web.app/widget/embedWidget.js' data-game-id='{}'  type="text/javascript" defer></script>
    `

    useEffect(() => {
        if (gameData != null) { // I suggest using != null to check for both null and undefined
          const bodyHTML = `
            <div id="spinWheelTrigger"></div>
            <script src='https://promo-spin-staging.web.app/widget/embedWidget.js' data-game-id='${gameData.game_id}' type="text/javascript" defer></script>
          `;

          const headerHTML = `
            <link rel="stylesheet" href="https://promo-spin-staging.web.app/widget/embedWidget.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/4.16.13/antd.min.css" />
          `
          // Use htmlString here as needed
          setBodyString(bodyHTML)
          setHeaderString(headerHTML)
        }
      }, [gameData]);

    return (
        <div class="code-snippet-body">
            <Title level={5} bold>Insert this at the bottom of your header tag in your html file</Title>
            <Text code>
                {headerString}
            </Text>
            <br></br>
            <Title level={5} bold>Insert this at the bottom of your body tag in your html file</Title>
            <br></br>
            <Text code>
                {bodyString}
            </Text>
        </div>
    )

}