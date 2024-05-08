import React from 'react';

import {db} from './firebase-config'

import { v4 as uuidv4 } from 'uuid';


import './styles.css';
import './table.css'
import { async } from '@firebase/util';
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc, query, where} from 'firebase/firestore'
import { getAllByRole } from '@testing-library/react';
import { useState, useEffect } from 'react';
import InputFields from './InputField';
import { constructWheelArray } from './function';
import RemainingProb from './RemainingProb';
import { Button, Typography } from 'antd'

import { validEntries } from './function';
import { createAlternatingArrayWithDuplicates } from './function';

export default function OptionTable({ randomCheck, randomArray, wheelElements, setWheelElements, setRandomArray, displayItems, tableValues, setTableValues, user, setDisplayItems, gameData, setGameData, tableCollectionRef}) {
    console.log("gae")
    console.log(wheelElements)

    // const [tableValues, setTableValues] = useState([])

    const { Text, Link } = Typography;


    // useEffect(() => {
    //     console.log("In option table")
    //     console.log(gameData)
    //     setTableValues(gameData.wheel_fields)
    // }, [])

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

    // const updateGame = async() => {
    //     const gamesCollectionRef = collection(db, 'games');
    //     const docRef = await getDocs(query(gamesCollectionRef, where('user_id', '==', user.uid), where('game_id', '==', gameData.game_id)));
    //     getDocs(query(gamesCollectionRef, where("user_id", "==", user.uid), where('game_id', '==', gameData.game_id))).then((res) => {
    //         const docRef = doc(db, "games", res.docs[0].id);
    //         console.log(docRef)
    //         updateDoc(docRef, { 'wheel_fields': tableValues });
    //     })
    //     if (docRef.empty) {
    //         console.log('No matching documents.');
    //         return;
    //     }
    // }
    function updateTableDatabase() {
        // if (!validEntries()) {
        //     return
        // }

        // updateGame()
        // console.log("In updateTableDatabase")

        var wheelArray = constructWheelArray(tableValues)
        setWheelElements(wheelArray)
        var newRandomArray = createAlternatingArrayWithDuplicates(wheelArray)
        setRandomArray(newRandomArray)
        if (randomCheck) {
            setDisplayItems(newRandomArray)
        }
        else {
            setDisplayItems(wheelArray)
        }
    }

    function addEntry() {
        setTableValues(rows => [...rows, {'name':'', 'probability':'', 'id': uuidv4()}])
    }

    return (
        <div>
            {/* <Typography.Title level={3} style={{ margin: 0 }}>
                Prize Name
            </Typography.Title> */}
            {console.log("HELLO")}
            {console.log(tableValues)}
            {tableValues && (
      <RemainingProb tableValues={tableValues}></RemainingProb>
    )}            <table class="table input-margin" id="table">
                {console.log("gae3")}
                <tr>
                    <th>
                        <Typography.Title level={5} style={{ margin: 0 }}>
                            Prize Name
                        </Typography.Title>
                    </th>
                    <th>
                        <Typography.Title level={5} style={{ margin: 0 }}>
                            Prize Probability
                        </Typography.Title>
                    </th>
                </tr>
        {tableValues ? (
            <tbody>
            {tableValues.map((element, index) => (
                <tr className="entry-row" key={"entry-row-" + index}>
                <InputFields
                    showCount maxLength={30}
                    fuckhello={'fuckhello'}
                    tableValues={tableValues}
                    setTableValues={setTableValues}
                    id={element.id}
                    fName={element['name']}
                    fProbability={element.probability}
                />
                </tr>
            ))}
            </tbody>
        ) : (
        <p>Loading...</p>
        )}

                {console.log("gae5")}
                {console.log(tableValues)}
            </table>
            <div className='wheel-button-container'>
                <Button type="primary" onClick={addEntry}>Add New Entry</Button>
                <Button className='save-button' style={saveButtonStyle}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = hoverStyle.background;
                        e.currentTarget.style.borderColor = hoverStyle.borderColor;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = saveButtonStyle.background;
                        e.currentTarget.style.borderColor = saveButtonStyle.borderColor;
                    }}
                    onClick={updateTableDatabase}>Show Prizes on Wheel</Button>
            </div>
        </div>
    )
}